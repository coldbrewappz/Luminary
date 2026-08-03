import { ReactElement, ReactNode } from 'react';
import {
  Pressable,
  RefreshControlProps,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, HitSlop, Spacing, Type } from '@/constants/theme';

type ScreenProps = {
  /** Wordmark or screen name shown in the nav bar. Omit when `onBack` is set. */
  title?: string;
  /** Optional control on the right of the nav bar (e.g. the category name on the feed). */
  action?: ReactNode;
  children: ReactNode;
  /** Set false for screens that manage their own scrolling, like the feed. */
  scroll?: boolean;
  contentStyle?: ViewStyle;
  /** A <RefreshControl> for pull-to-refresh, attached to the inner ScrollView. */
  refreshControl?: ReactElement<RefreshControlProps>;
  /** When set, the nav bar shows a back chevron instead of the title. */
  onBack?: () => void;
  /** Text beside the back chevron (e.g. "Quotes"). */
  backLabel?: string;
};

/**
 * Shared chrome: linen ground, top safe-area inset, and the hairline-ruled nav
 * bar. NativeTabs owns the bottom inset, so this only claims the top edge.
 */
export function Screen({
  title,
  action,
  children,
  scroll = true,
  contentStyle,
  refreshControl,
  onBack,
  backLabel = 'Back',
}: ScreenProps) {
  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.content, contentStyle]}
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, styles.flex, contentStyle]}>{children}</View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.navbar}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={12}
            style={({ pressed }) => [styles.back, pressed && styles.backPressed]}>
            <Text style={styles.chevron}>‹</Text>
            <Text style={styles.backText}>{backLabel}</Text>
          </Pressable>
        ) : (
          <Text style={Type.wordmark}>{title}</Text>
        )}
        {action}
      </View>
      {body}
    </SafeAreaView>
  );
}

/** Uppercase, wide-tracked eyebrow. The app's quietest voice. */
export function Label({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[Type.label, styles.label, style]}>{String(children).toUpperCase()}</Text>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.linen },
  flex: { flex: 1 },
  navbar: {
    height: 48,
    paddingHorizontal: Spacing.gutter,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.linenDark,
  },
  content: { paddingBottom: Spacing.xxl },
  label: { textTransform: 'uppercase' },
  back: { flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: HitSlop, marginLeft: -4 },
  backPressed: { opacity: 0.5 },
  chevron: { fontSize: 28, color: Colors.textMid, marginTop: -3 },
  backText: { fontFamily: Type.body.fontFamily, fontSize: 15, color: Colors.textMid },
});
