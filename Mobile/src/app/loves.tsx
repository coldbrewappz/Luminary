import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { Spacing, Type } from '@/constants/theme';

/** Stub. The collection, cap meter, and write-your-own sheet land in Phase 15. */
export default function LovesScreen() {
  return (
    <Screen title="Quotes You Love">
      <View style={styles.body}>
        <Text style={[Type.quoteSmall, styles.centered]}>No quotes loved yet.</Text>
        <Text style={[Type.body, styles.centered]}>
          Tap the heart on any quote to add it here.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: Spacing.gutter, paddingTop: Spacing.xxl, gap: Spacing.sm },
  centered: { textAlign: 'center' },
});
