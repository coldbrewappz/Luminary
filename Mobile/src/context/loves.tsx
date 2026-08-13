import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { PersonalQuote, QUOTE_CAP, SavedQuote } from '@/config/api';
import { useAuth } from '@/context/auth';
import { haptics } from '@/lib/haptics';

/**
 * Ported from Frontend/.../context/LovesContext.jsx. Same shape and rules; the
 * only real change is that every network call goes through authFetch, which
 * attaches the token and silently refreshes it on a 401 — so the manual
 * `Authorization: Bearer` headers from the web version disappear here.
 *
 * A "love" is a saved quote from the catalog; a "personal" quote is one the mom
 * wrote herself. They share a single cap of QUOTE_CAP combined.
 */

/** What a Love button gets back, so the calling screen can react (toast/alert/sign-in). */
export type ToggleResult = 'auth' | 'saved' | 'removed' | 'cap' | 'error';

type LovesValue = {
  lovedQuotes: SavedQuote[];
  personalQuotes: PersonalQuote[];
  loading: boolean;
  error: string | null;
  /** Combined count against the cap. */
  total: number;
  atCap: boolean;
  isLoved: (quoteId: number) => boolean;
  toggleLove: (quote: { id: number; text: string; author: string; category: string }) => Promise<ToggleResult>;
  addOwnQuote: (text: string) => Promise<boolean>;
  removeSaved: (quoteId: number) => Promise<void>;
  removePersonal: (personalId: number) => Promise<void>;
  reload: () => Promise<void>;
};

const LovesContext = createContext<LovesValue | null>(null);

export function LovesProvider({ children }: { children: ReactNode }) {
  const { user, authFetch } = useAuth();
  const [lovedQuotes, setLovedQuotes] = useState<SavedQuote[]>([]);
  const [personalQuotes, setPersonalQuotes] = useState<PersonalQuote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = lovedQuotes.length + personalQuotes.length;
  const atCap = total >= QUOTE_CAP;

  const reload = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      // Fetch both lists together — they share one screen and one cap.
      const [lovesRes, personalRes] = await Promise.all([
        authFetch('/api/loves'),
        authFetch('/api/personal'),
      ]);
      if (!lovesRes.ok || !personalRes.ok) throw new Error('bad response');
      setLovedQuotes((await lovesRes.json()) as SavedQuote[]);
      setPersonalQuotes((await personalRes.json()) as PersonalQuote[]);
    } catch (err) {
      console.warn('Could not load collection:', err);
      setError('We had trouble loading your collection. Pull to refresh to try again.');
    } finally {
      setLoading(false);
    }
  }, [user, authFetch]);

  // Load on sign-in; clear on sign-out.
  useEffect(() => {
    if (user) {
      reload();
    } else {
      setLovedQuotes([]);
      setPersonalQuotes([]);
      setError(null);
    }
  }, [user, reload]);

  const isLoved = useCallback(
    (quoteId: number) => lovedQuotes.some((q) => q.quote?.id === quoteId),
    [lovedQuotes],
  );

  const toggleLove = useCallback(
    async (quote: { id: number; text: string; author: string; category: string }): Promise<ToggleResult> => {
      if (!user) return 'auth';

      // Already saved → remove it.
      if (lovedQuotes.some((q) => q.quote?.id === quote.id)) {
        try {
          const res = await authFetch(`/api/loves/${quote.id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error('delete failed');
          setLovedQuotes((prev) => prev.filter((q) => q.quote?.id !== quote.id));
          haptics.remove();
          return 'removed';
        } catch (err) {
          console.warn('Could not remove love:', err);
          return 'error';
        }
      }

      // Not saved → add it, unless the collection is full.
      if (atCap) {
        haptics.warning();
        return 'cap';
      }
      try {
        const res = await authFetch('/api/loves', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quoteId: quote.id }),
        });
        if (!res.ok) throw new Error('save failed');
        const saved = (await res.json()) as SavedQuote;
        setLovedQuotes((prev) => [...prev, saved]);
        haptics.save();
        return 'saved';
      } catch (err) {
        console.warn('Could not save love:', err);
        return 'error';
      }
    },
    [user, authFetch, lovedQuotes, atCap],
  );

  const addOwnQuote = useCallback(
    async (text: string): Promise<boolean> => {
      if (!user || atCap) return false;
      try {
        const res = await authFetch('/api/personal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });
        if (!res.ok) throw new Error('add failed');
        const saved = (await res.json()) as PersonalQuote;
        setPersonalQuotes((prev) => [...prev, saved]);
        haptics.success();
        return true;
      } catch (err) {
        console.warn('Could not add personal quote:', err);
        return false;
      }
    },
    [user, authFetch, atCap],
  );

  const removeSaved = useCallback(
    async (quoteId: number) => {
      try {
        await authFetch(`/api/loves/${quoteId}`, { method: 'DELETE' });
        setLovedQuotes((prev) => prev.filter((q) => q.quote?.id !== quoteId));
        haptics.remove();
      } catch (err) {
        console.warn('Could not remove saved quote:', err);
      }
    },
    [authFetch],
  );

  const removePersonal = useCallback(
    async (personalId: number) => {
      try {
        await authFetch(`/api/personal/${personalId}`, { method: 'DELETE' });
        setPersonalQuotes((prev) => prev.filter((q) => q.id !== personalId));
        haptics.remove();
      } catch (err) {
        console.warn('Could not remove personal quote:', err);
      }
    },
    [authFetch],
  );

  const value = useMemo(
    () => ({
      lovedQuotes,
      personalQuotes,
      loading,
      error,
      total,
      atCap,
      isLoved,
      toggleLove,
      addOwnQuote,
      removeSaved,
      removePersonal,
      reload,
    }),
    [lovedQuotes, personalQuotes, loading, error, total, atCap, isLoved, toggleLove, addOwnQuote, removeSaved, removePersonal, reload],
  );

  return <LovesContext.Provider value={value}>{children}</LovesContext.Provider>;
}

export function useLoves() {
  const context = useContext(LovesContext);
  if (!context) throw new Error('useLoves must be used inside <LovesProvider>');
  return context;
}
