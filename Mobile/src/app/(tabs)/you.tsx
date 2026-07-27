import { router } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Label, Screen } from '@/components/screen';
import { Colors, HitSlop, Radius, Spacing, Type } from '@/constants/theme';
import { useAuth } from '@/context/auth';

/**
 * Phase 11 shows only the account state. About, the widget row, and the
 * required delete-account flow land in Phase 16.
 */
export default function YouScreen() {
  const { user, loading, logout } = useAuth();

  // Reading the Keychain takes a moment. Showing "signed out" during that
  // window would make a signed-in mom flicker to a stranger on every launch.
  if (loading) {
    return (
      <Screen title="You">
        <View style={styles.centerBlock}>
          <ActivityIndicator color={Colors.textLight} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen title="You">
      <View style={styles.body}>
        {user ? (
          <>
            <View style={styles.card}>
              <Label>Signed in as</Label>
              <Text style={styles.email}>{user.email}</Text>
            </View>

            <Label style={styles.sectionLabel}>Account</Label>
            <Pressable
              onPress={logout}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
              <Text style={styles.rowText}>Sign out</Text>
            </Pressable>
          </>
        ) : (
          <>
            <View style={styles.card}>
              <Text style={Type.quoteSmall}>Your collection is waiting.</Text>
              <Text style={[Type.body, styles.cardBody]}>
                Sign in to save the quotes you love and write your own.
              </Text>
            </View>
            <Pressable
              onPress={() => router.push('/sign-in')}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
              <Text style={styles.rowText}>Sign in</Text>
            </Pressable>
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: Spacing.gutter, paddingTop: Spacing.lg },
  centerBlock: { paddingTop: Spacing.xxl, alignItems: 'center' },
  card: {
    backgroundColor: Colors.blush,
    borderRadius: Radius.card,
    padding: Spacing.lg,
    gap: Spacing.xs,
  },
  cardBody: { marginTop: Spacing.xs },
  email: { ...Type.body, fontSize: 16, color: Colors.textDark },
  sectionLabel: { marginTop: Spacing.xl, marginBottom: Spacing.sm },
  row: {
    minHeight: HitSlop,
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.linenDark,
    marginTop: Spacing.md,
  },
  rowPressed: { opacity: 0.5 },
  rowText: { ...Type.body, fontSize: 15, color: Colors.textDark },
});
