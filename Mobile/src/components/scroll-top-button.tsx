import { Pressable, StyleSheet, Text } from 'react-native';

import { Colors, Radius } from '@/constants/theme';

type ScrollTopButtonProps = {
  visible: boolean;
  onPress: () => void;
};

/**
 * Floating "back to top" pill. Ports ScrollToTopButton.jsx. The web relied on
 * this too — and on iPhone it's genuinely needed, because native tabs (unlike
 * the iOS convention) don't scroll a list to the top when you tap the tab icon.
 */
export function ScrollTopButton({ visible, onPress }: ScrollTopButtonProps) {
  if (!visible) return null;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Back to top"
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Text style={styles.arrow}>↑</Text>
      <Text style={styles.label}>Top</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.white,
    borderRadius: Radius.card,
    paddingHorizontal: 14,
    paddingVertical: 10,
    // A soft lift so it reads as floating above the feed.
    shadowColor: '#2C2520',
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  pressed: { opacity: 0.7 },
  arrow: { fontSize: 15, color: Colors.textMid },
  label: {
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: Colors.textMid,
  },
});
