import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { Spacing, Type } from '@/constants/theme';

/** Stub. Account rows, About, and the required delete-account flow land in Phase 16. */
export default function YouScreen() {
  return (
    <Screen title="You">
      <View style={styles.body}>
        <Text style={[Type.quoteSmall, styles.centered]}>Account settings arrive in Phase 16.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: Spacing.gutter, paddingTop: Spacing.xxl },
  centered: { textAlign: 'center' },
});
