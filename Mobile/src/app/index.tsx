import { StyleSheet, Text, View } from 'react-native';

import { QuoteCard } from '@/components/quote-card';
import { Label, Screen } from '@/components/screen';
import { Colors, Spacing, Type } from '@/constants/theme';

/**
 * Phase 10 renders the Today layout with a fixed quote so the design system can
 * be checked on device. Phase 13 replaces this with GET /api/quotes/daily.
 */
const PLACEHOLDER = {
  text: 'Healing is not linear. Be gentle with yourself.',
  author: 'Unknown',
  category: 'healing',
};

export default function TodayScreen() {
  return (
    <Screen title="Luminary Mom">
      <View style={styles.hero}>
        <Label>A light for the postpartum journey</Label>
        <Text style={[Type.display, styles.heroText]}>You are not alone{'\n'}in this.</Text>
      </View>

      <View style={styles.rule} />

      <View style={styles.section}>
        <Label style={styles.centered}>Today&apos;s light</Label>
        <QuoteCard
          text={PLACEHOLDER.text}
          author={PLACEHOLDER.author}
          category={PLACEHOLDER.category}
          fill={Colors.lavender}
          onToggleLove={() => {}}
        />
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
});
