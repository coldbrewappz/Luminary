import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, StyleSheet, Text, View } from 'react-native';

import { LoveableQuoteCard } from '@/components/loveable-quote-card';
import { Label, Screen } from '@/components/screen';
import { API_BASE_URL, type Quote } from '@/config/api';
import { Colors, Spacing, Type } from '@/constants/theme';

/**
 * The Today tab. Ported from Frontend/.../components/DailyQuote.jsx — the fetch
 * logic is nearly identical to the web; only the rendering changes.
 *
 * The daily-quote endpoint is public, so this uses a plain fetch (no auth). The
 * Love button is shown but does nothing until Phase 15 ports LovesContext.
 */
export default function TodayScreen() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true); // first load only
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // pull-to-refresh only

  // The actual network call, shared by the first load and pull-to-refresh.
  const loadDailyQuote = useCallback(async () => {
    try {
      setError(false);
      const res = await fetch(`${API_BASE_URL}/api/quotes/daily`);
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = (await res.json()) as Quote;
      setQuote(data);
    } catch (err) {
      console.warn('Could not load daily quote:', err);
      setError(true);
    }
  }, []);

  // Runs once when the screen first mounts.
  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadDailyQuote();
      setLoading(false);
    })();
  }, [loadDailyQuote]);

  // Runs when the mom drags the screen down.
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDailyQuote();
    setRefreshing(false);
  }, [loadDailyQuote]);

  return (
    <Screen
      title="Luminary Mom"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.textLight} />
      }>
      <View style={styles.hero}>
        <Label>A light for the postpartum journey</Label>
        <Text style={[Type.display, styles.heroText]}>You are not alone{'\n'}in this.</Text>
      </View>

      <View style={styles.rule} />

      <View style={styles.section}>
        <Label style={styles.centered}>Today&apos;s light</Label>

        {loading ? (
          <View style={styles.stateCard}>
            <Text style={[Type.quoteSmall, styles.stateText]}>Finding today&apos;s light…</Text>
          </View>
        ) : error || !quote ? (
          <View style={styles.stateCard}>
            <Text style={[Type.quoteSmall, styles.stateText]}>
              Something went wrong. Pull down to try again.
            </Text>
          </View>
        ) : (
          <LoveableQuoteCard quote={quote} fill={Colors.lavender} />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: Spacing.gutter,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  heroText: { textAlign: 'center' },
  rule: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.linenDark },
  section: { paddingHorizontal: Spacing.gutter, paddingTop: 28, gap: 18 },
  centered: { textAlign: 'center' },
  // Loading and error share the card shape so the layout doesn't jump.
  stateCard: {
    backgroundColor: Colors.lavender,
    borderRadius: 3,
    padding: 40,
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateText: { color: Colors.textLight, textAlign: 'center' },
});
