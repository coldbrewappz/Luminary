import { ReactElement, ReactNode } from 'react';
import {
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

import { Colors, Spacing, Type } from '@/constants/theme';

type ScreenProps = {
  /** Wordmark or screen name shown in the nav bar. */
  title: string;
  /** Optional control on the right of the nav bar (e.g. the "+" on Loves). */
  action?: ReactNode;
  children: ReactNode;
  /** Set false for screens that manage their own scrolling, like the feed. */
  scroll?: boolean;
  contentStyle?: ViewStyle;
  /** A <RefreshControl> for pull-to-refresh, attached to the inner ScrollView. */
  refreshControl?: ReactElement<RefreshControlProps>;
};

/**
 * Shared chrome: linen ground, top safe-area inset, and the hairline-ruled nav
 * bar. NativeTabs owns the bottom inset, so this only claims the top edge.
 */
export function Screen({ title, action, children, scroll = true, contentStyle, refreshControl }: ScreenProps) {
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
        <Text style={Type.wordmark}>{title}</Text>
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
});
