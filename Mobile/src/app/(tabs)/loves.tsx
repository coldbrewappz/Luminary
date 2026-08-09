import { router } from 'expo-router';
import { ActivityIndicator, Alert, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen } from '@/components/screen';
import { QUOTE_CAP } from '@/config/api';
import { Colors, HitSlop, Radius, Spacing, TabBarClearance, Type } from '@/constants/theme';
import { useAuth } from '@/context/auth';
import { useLoves } from '@/context/loves';

// Collection cards rotate through these, matching LovesPanel.jsx's cardColors.
const CARD_FILLS = [Colors.blush, Colors.lavender, Colors.sage];

type CollectionItem = {
  key: string;
  id: number;
  text: string;
  author: string | null;
  type: 'saved' | 'own';
};

export default function LovesScreen() {
  const insets = useSafeAreaInsets();
  const { user, loading: authLoading } = useAuth();
  const { lovedQuotes, personalQuotes, loading, error, total, removeSaved, removePersonal, reload } =
    useLoves();

  // Merge saved quotes and personal quotes into one list.
  const collection: CollectionItem[] = [
    ...lovedQuotes.map((q) => ({
      key: `saved-${q.quote?.id}`,
      id: q.quote?.id,
      text: q.quote?.text,
      author: q.quote?.author ?? null,
      type: 'saved' as const,
    })),
    ...personalQuotes.map((q) => ({
      key: `own-${q.id}`,
      id: q.id,
      text: q.text,
      author: null,
      type: 'own' as const,
    })),
  ];

  function confirmRemove(item: CollectionItem) {
    Alert.alert('Remove this quote?', 'It will be taken out of your collection.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => (item.type === 'own' ? removePersonal(item.id) : removeSaved(item.id)),
      },
    ]);
  }

  // While the Keychain is being read, don't flash the signed-out state.
  if (authLoading) {
    return (
      <Screen title="Quotes You Love">
        <View style={styles.centerBlock}>
          <ActivityIndicator color={Colors.textLight} />
        </View>
      </Screen>
    );
  }

  // Signed out — invite them in.
  if (!user) {
    return (
      <Screen title="Quotes You Love">
        <View style={styles.emptyState}>
          <Text style={Type.quoteSmall}>Sign in to save your quotes.</Text>
          <Text style={[Type.body, styles.emptyBody]}>
            Create a free account to build your own collection of encouragement.
          </Text>
          <Pressable
            onPress={() => router.push('/sign-in')}
            style={({ pressed }) => [styles.signInButton, pressed && styles.pressed]}>
            <Text style={styles.signInText}>SIGN IN</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  const pct = Math.min(100, (total / QUOTE_CAP) * 100);

  return (
    <Screen
      title="Quotes You Love"
      action={
        <Pressable
          onPress={() => router.push('/write')}
          accessibilityRole="button"
          accessibilityLabel="Write your own quote"
          hitSlop={10}
          style={({ pressed }) => [styles.writeButton, pressed && styles.pressed]}>
          <Text style={styles.writeButtonText}>+ Write</Text>
        </Pressable>
      }
      contentStyle={{ paddingBottom: insets.bottom + TabBarClearance }}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={reload} tintColor={Colors.textLight} />
      }>
      <View style={styles.body}>
        {/* Cap meter */}
        <View style={styles.capBar}>
          <Text style={styles.capText}>
            {total} of {QUOTE_CAP} saved
          </Text>
          <View style={styles.track}>
            <View
              style={[
                styles.trackFill,
                { width: `${pct}%`, backgroundColor: total >= 18 ? Colors.blushDeep : Colors.heart },
              ]}
            />
          </View>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {loading && collection.length === 0 ? (
          <View style={styles.centerBlock}>
            <Text style={Type.quoteSmall}>Gathering your collection…</Text>
          </View>
        ) : collection.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={Type.quoteSmall}>No quotes loved yet.</Text>
            <Text style={[Type.body, styles.emptyBody]}>
              Tap the heart on any quote to add it here.
            </Text>
          </View>
        ) : (
          collection.map((item, index) => (
            <View
              key={item.key}
              style={[styles.card, { backgroundColor: CARD_FILLS[index % CARD_FILLS.length] }]}>
              <View style={styles.cardTop}>
                <Text style={styles.tag}>{item.type === 'own' ? 'MY WORDS' : 'QUOTE'}</Text>
                <Pressable
                  onPress={() => confirmRemove(item)}
                  accessibilityRole="button"
                  accessibilityLabel="Remove quote"
                  hitSlop={12}
                  style={({ pressed }) => pressed && styles.pressed}>
                  <Text style={styles.remove}>✕</Text>
                </Pressable>
              </View>
              <Text style={[Type.quoteSmall, styles.cardText]}>“{item.text}”</Text>
              {item.author ? <Text style={[Type.attrib, styles.upper]}>— {item.author}</Text> : null}
            </View>
          ))
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: Spacing.gutter, paddingTop: Spacing.lg, gap: Spacing.md },
  centerBlock: { paddingTop: Spacing.xxl, alignItems: 'center' },
  emptyState: {
    paddingTop: Spacing.xxl,
    paddingHorizontal: Spacing.gutter,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  emptyBody: { textAlign: 'center' },
  writeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.heart,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  writeButtonText: { ...Type.label, fontSize: 11, color: Colors.textDark, fontWeight: '600', letterSpacing: 1 },

  capBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.heartSoft,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
  },
  capText: { ...Type.body, fontSize: 12, color: Colors.textMid },
  track: { width: 120, height: 4, borderRadius: 999, backgroundColor: Colors.linenDark, overflow: 'hidden' },
  trackFill: { height: '100%', borderRadius: 999 },

  error: { ...Type.body, fontSize: 13, color: Colors.danger, fontStyle: 'italic' },

  card: { borderRadius: Radius.card, padding: Spacing.md, gap: 6 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tag: {
    ...Type.label,
    fontSize: 9,
    color: Colors.heart,
    backgroundColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: 'hidden',
  },
  remove: { fontSize: 15, color: Colors.textLight },
  cardText: { color: Colors.textDark },
  upper: { textTransform: 'uppercase' },

  signInButton: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.heart,
    borderRadius: Radius.card,
    height: HitSlop,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInText: { ...Type.label, fontSize: 11, color: Colors.textDark, fontWeight: '600', letterSpacing: 1.5 },
  pressed: { opacity: 0.5 },
});
