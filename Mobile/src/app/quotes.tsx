import { StyleSheet, Text, View } from 'react-native';

import { Label, Screen } from '@/components/screen';
import { Spacing, Type } from '@/constants/theme';

/** Stub. The category grid and feed land in Phase 14. */
export default function QuotesScreen() {
  return (
    <Screen title="Quotes">
      <View style={styles.body}>
        <Label style={styles.centered}>Choose a category that speaks to you</Label>
        <Text style={[Type.quoteSmall, styles.centered]}>Categories arrive in Phase 14.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: Spacing.gutter, paddingTop: Spacing.xl, gap: Spacing.lg },
  centered: { textAlign: 'center' },
});
