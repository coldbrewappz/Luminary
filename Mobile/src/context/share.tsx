import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { Share, StyleSheet, View } from 'react-native';

import { ShareCard } from '@/components/share-card';
import { type Quote } from '@/config/api';

/**
 * Sharing a quote as an image.
 *
 * A quote card is a *picture*, so we can't just share text. This provider keeps
 * one hidden ShareCard off-screen, and `shareQuote()` fills it with a quote,
 * snapshots it to a PNG, and opens the native share sheet with the file. Nothing
 * is uploaded — the PNG is a throwaway temp file on the device.
 *
 * react-native-view-shot is a *native* module, so it's absent in Expo Go and in
 * a dev build that hasn't been rebuilt since it was added. We therefore require
 * it lazily and wrap the capture in try/catch: if it isn't there (or fails), we
 * fall back to sharing the quote as plain text rather than crashing the app.
 * (We use RN's built-in Share for both, so the share step itself never depends
 * on a native module that might be missing.)
 */
type ShareValue = { shareQuote: (quote: Quote) => void };

const ShareContext = createContext<ShareValue | null>(null);

export function ShareProvider({ children }: { children: ReactNode }) {
  const shotRef = useRef<View>(null);
  const [pending, setPending] = useState<Quote | null>(null);
  // Resolved by the hidden card's onLayout, so we snapshot only once it's drawn.
  const laidOut = useRef<(() => void) | null>(null);
  const busy = useRef(false);

  const shareQuote = useCallback(async (quote: Quote) => {
    if (busy.current) return;
    busy.current = true;

    const author = quote.author?.trim() || 'Luminary Mom';
    const text = `“${quote.text}”\n— ${author}`;

    try {
      const laid = new Promise<void>((resolve) => (laidOut.current = resolve));
      setPending(quote);
      // Wait for layout (with a safety timeout), then a frame for the image/font.
      await Promise.race([laid, new Promise((r) => setTimeout(r, 600))]);
      await new Promise((r) => setTimeout(r, 120));

      // Loaded lazily so a build without the native module doesn't crash on import.
      const { captureRef } = require('react-native-view-shot');
      const uri: string = await captureRef(shotRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });
      const fileUrl = /:\/\//.test(uri) ? uri : `file://${uri}`;
      await Share.share({ url: fileUrl });
    } catch (err) {
      // Most commonly: view-shot unavailable (Expo Go / not-yet-rebuilt). Text it is.
      console.warn('Image share unavailable, sharing text instead:', err);
      try {
        await Share.share({ message: text });
      } catch {
        // User dismissed the sheet, or nothing to do.
      }
    } finally {
      setPending(null);
      laidOut.current = null;
      busy.current = false;
    }
  }, []);

  return (
    <ShareContext.Provider value={{ shareQuote }}>
      {children}
      {pending ? (
        <View style={styles.offscreen} pointerEvents="none">
          <View ref={shotRef} collapsable={false} onLayout={() => laidOut.current?.()}>
            <ShareCard text={pending.text} author={pending.author?.trim() || 'Luminary Mom'} />
          </View>
        </View>
      ) : null}
    </ShareContext.Provider>
  );
}

export function useShare() {
  const ctx = useContext(ShareContext);
  if (!ctx) throw new Error('useShare must be used within a ShareProvider');
  return ctx;
}

const styles = StyleSheet.create({
  // Rendered but parked far off-screen so it can be snapshotted without flashing.
  offscreen: { position: 'absolute', left: -10000, top: 0 },
});
