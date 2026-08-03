import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Radius, Type } from '@/constants/theme';

type CategoryTileProps = {
  emoji: string;
  name: string;
  count: number;
  theme: 'lavender' | 'blush';
  onPress: () => void;
};

/**
 * Ported from Frontend/.../components/CategoryTile.jsx. On the web the tile had
 * an "active" border because tapping collapsed the grid in place; on iPhone a
 * tap navigates to a new screen, so there's no active state to show.
 */
export function CategoryTile({ emoji, name, count, theme, onPress }: CategoryTileProps) {
  const fill = theme === 'lavender' ? Colors.lavender : Colors.blush;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      // The web tile lifted on hover; a phone has no hover, so we press-scale instead.
      style={({ pressed }) => [styles.tile, { backgroundColor: fill }, pressed && styles.pressed]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.count}>{count} quotes</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    borderRadius: Radius.card,
    padding: 18,
    minHeight: 112, // room for two-line names like "You Are Not Alone"
    gap: 4,
  },
  pressed: { transform: [{ scale: 0.97 }] },
  emoji: { fontSize: 21 },
  name: {
    fontFamily: Type.quote.fontFamily,
    fontStyle: 'italic',
    fontSize: 17,
    lineHeight: 20,
    color: Colors.textDark,
  },
  count: {
    fontFamily: Type.label.fontFamily,
    fontSize: 9,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: Colors.textLight,
  },
});
