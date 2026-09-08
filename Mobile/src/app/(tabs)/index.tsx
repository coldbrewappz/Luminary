import { useCallback, useEffect, useState } from 'react';
import { Image, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { LoveableQuoteCard } from '@/components/loveable-quote-card';
import { Label, Screen } from '@/components/screen';
import { API_BASE_URL, type Quote } from '@/config/api';
import { Colors, Fonts, Spacing, Type } from '@/constants/theme';

// The app icon doubles as the brand mark in the header lockup.
const LOGO = require('../../../assets/images/icon.png');

/**
 * The Today tab. Ported from Frontend/.../components/DailyQuote.jsx — the fetch
 * logic is nearly identical to the web; only the rendering changes.
 *
 * The daily-quote endpoint is public, so this uses a plain fetch (no auth).
 * The screen opens with the brand lockup (logo + stacked wordmark + tagline),
 * then the day's quote fills the space below, deliberately uncluttered.
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
    // `bare` drops the shared nav bar so the brand lockup below is the header.
    <Screen
      bare
      contentStyle={styles.fill}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.textLight} />
      }>
      {/* Logo centered on top, the two-line wordmark beneath it, then the
          tagline — all centered. See the approved Today-screen redesign. */}
      <View style={styles.brand}>
        <Image source={LOGO} style={styles.logo} accessible={false} />
        <View>
          <Text style={styles.name}>Luminary</Text>
          <Text style={styles.name}>Mom</Text>
        </View>
        <Text style={styles.tagline}>A light for the motherhood journey.</Text>
      </View>

      <View style={styles.rule} />

      {/* Fills the space below the header and centers the quote within it. */}
      <View style={styles.todaySection}>
        <Label style={[styles.centered, styles.eyebrow]}>Today&apos;s light</Label>

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
          <LoveableQuoteCard quote={quote} fill={Colors.lavender} large />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  // Grow to fill the viewport so the quote can sit centered in the space.
  fill: { flexGrow: 1 },
  brand: {
    paddingHorizontal: Spacing.gutter,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    alignItems: 'center',
    gap: 10,
  },
  // 69pt: enlarged another 15% (was 60) now that the logo sits centered on top.
  logo: { width: 69, height: 69, borderRadius: 15 },
  // 27pt Georgia italic (Type.title), tightened so the two lines stack snugly.
  // Centered so "Mom" sits centered under "Luminary".
  name: { ...Type.title, lineHeight: 29, textAlign: 'center' },
  tagline: {
    fontFamily: Fonts.serif,
    fontStyle: 'italic',
    fontSize: 15,
    lineHeight: 20,
    color: Colors.textMid,
    textAlign: 'center',
  },
  // A touch darker than the linenDark hairline elsewhere, so the header reads as
  // a defined masthead rather than blending into the linen ground.
  rule: { height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(44, 37, 32, 0.22)' },
  todaySection: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.gutter,
    // Asymmetric: a small top inset and a larger bottom one biases the centered
    // quote upward, closing the gap under the header without top-aligning it.
    paddingTop: Spacing.sm,
    paddingBottom: 76,
    gap: 18,
  },
  centered: { textAlign: 'center' },
  // Bigger than the default 10pt eyebrow — reads as too small on Today.
  eyebrow: { fontSize: 12, letterSpacing: 2.5 },
  // Same height as the large card so the layout doesn't jump when it loads.
  stateCard: {
    backgroundColor: Colors.lavender,
    borderRadius: 3,
    padding: 40,
    minHeight: 330,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateText: { color: Colors.textLight, textAlign: 'center' },
});
