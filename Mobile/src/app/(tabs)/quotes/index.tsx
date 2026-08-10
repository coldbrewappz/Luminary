import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CategoryTile } from '@/components/category-tile';
import { Label, Screen } from '@/components/screen';
import { API_BASE_URL, CATEGORIES, type Quote } from '@/config/api';
import { Colors, Spacing, Type } from '@/constants/theme';

/**
 * The category grid. Ports QuotesPage.jsx. On the web the counts came from a
 * hardcoded quotes array; here they're computed from the real API, so they stay
 * correct as the monthly agent adds quotes.
 */
export default function QuotesGridScreen() {
  // Map of category id -> how many quotes it has.
  const [counts, setCounts] = useState<Record<string, number>>({});

  const loadCounts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/quotes`);
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const quotes = (await res.json()) as Quote[];
      const tally: Record<string, number> = {};
      for (const q of quotes) {
        tally[q.category] = (tally[q.category] ?? 0) + 1;
      }
      setCounts(tally);
    } catch (err) {
      console.warn('Could not load quote counts:', err);
      // Leave counts empty — tiles just show "0 quotes" rather than breaking.
    }
  }, []);

  useEffect(() => {
    loadCounts();
  }, [loadCounts]);

  // Six categories → three rows of two.
  const rows = [];
  for (let i = 0; i < CATEGORIES.length; i += 2) {
    rows.push(CATEGORIES.slice(i, i + 2));
  }

  return (
    <Screen title="Quotes">
      <View style={styles.header}>
        <Label style={styles.centered}>Choose a category that speaks to you</Label>
      </View>

      <View style={styles.grid}>
        {rows.map((pair, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {pair.map((cat) => (
              <CategoryTile
                key={cat.id}
                emoji={cat.emoji}
                name={cat.name}
                count={counts[cat.id] ?? 0}
                theme={cat.theme}
                onPress={() => router.push(`/quotes/feed?category=${cat.id}`)}
              />
            ))}
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text
          onPress={() => router.push('/quotes/feed')}
          style={styles.wanderLink}
          accessibilityRole="button">
          Or wander through every quote →
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: Spacing.gutter, paddingTop: 50, paddingBottom: Spacing.lg },
  centered: { textAlign: 'center' },
  grid: { paddingHorizontal: Spacing.gutter, gap: 11 },
  row: { flexDirection: 'row', gap: 11 },
  footer: { alignItems: 'center', paddingTop: Spacing.xl },
  wanderLink: {
    fontFamily: Type.quote.fontFamily,
    fontStyle: 'italic',
    fontSize: 17,
    color: Colors.textMid,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.linenDark,
    paddingBottom: 2,
  },
});
