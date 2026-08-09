import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, HitSlop, Radius, Spacing, Type } from '@/constants/theme';

/** Feed cards rotate through the three card fills. Sage is in the palette but the web feed never uses it. */
export const CARD_FILLS = [Colors.lavender, Colors.blush, Colors.sage] as const;

type QuoteCardProps = {
  text: string;
  author?: string | null;
  category?: string | null;
  fill?: string;
  loved?: boolean;
  pending?: boolean;
  onToggleLove?: () => void;
  /** Taller, roughly-square card with larger text — for the Today hero card. */
  large?: boolean;
};

export function QuoteCard({
  text,
  author,
  category,
  fill = Colors.lavender,
  loved = false,
  pending = false,
  onToggleLove,
  large = false,
}: QuoteCardProps) {
  return (
    <View style={[styles.card, large && styles.cardLarge, { backgroundColor: fill }]}>
      <Text style={[styles.mark, large && styles.markLarge]}>&ldquo;</Text>
      <Text style={[Type.quote, styles.text, large && styles.textLarge]}>{text}</Text>

      <View style={styles.meta}>
        {author ? <Text style={[Type.attrib, styles.upper]}>— {author}</Text> : <View />}
        {category ? <Text style={styles.chip}>{category.toUpperCase()}</Text> : null}
      </View>

      {onToggleLove ? (
        <Pressable
          onPress={onToggleLove}
          disabled={pending}
          accessibilityRole="button"
          accessibilityLabel={loved ? 'Remove from your collection' : 'Save to your collection'}
          style={({ pressed }) => [styles.love, (pressed || pending) && styles.lovePressed]}>
          <Text style={[styles.loveText, loved && styles.loveTextOn]}>
            {loved ? '♥  LOVED' : '♡  LOVE'}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.lg,
    paddingTop: 26,
    paddingBottom: Spacing.md,
  },
  // Today's hero card: tall and squarish, with the quote centered in it.
  cardLarge: {
    minHeight: 330,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingTop: 44,
    paddingBottom: 28,
  },
  mark: {
    position: 'absolute',
    top: 4,
    left: 16,
    fontFamily: Type.quote.fontFamily,
    fontSize: 54,
    lineHeight: 62,
    color: Colors.textLight,
    opacity: 0.32,
  },
  markLarge: { top: 14, left: 22, fontSize: 72, lineHeight: 80 },
  text: { marginTop: Spacing.md },
  textLarge: { fontSize: 25, lineHeight: 35 },
  meta: {
    marginTop: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  upper: { textTransform: 'uppercase' },
  chip: {
    ...Type.label,
    color: Colors.textLight,
    backgroundColor: 'rgba(255,255,255,0.45)',
    paddingHorizontal: 11,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  /** 44pt tall: the text is small, the target is not. */
  love: { height: HitSlop, justifyContent: 'center', marginBottom: -Spacing.md },
  lovePressed: { opacity: 0.5 },
  loveText: { ...Type.label, letterSpacing: 1.5, color: Colors.textLight },
  loveTextOn: { color: Colors.heart },
});
