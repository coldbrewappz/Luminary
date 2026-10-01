import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Label } from '@/components/screen';
import { Colors, HitSlop, Radius, Spacing, Type } from '@/constants/theme';
import { useLoves } from '@/context/loves';

const MAX = 300;

/**
 * Write-your-own, presented as a sheet from the Loves tab's "+". Ports the
 * write-your-own section of LovesPanel.jsx into its own surface, so the Loves
 * list stays a plain list and the writing area gets the whole sheet.
 */
export default function WriteSheet() {
  const { addOwnQuote, atCap } = useLoves();
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  const trimmed = text.trim();

  async function submit() {
    if (busy || !trimmed || atCap) return;
    setBusy(true);
    try {
      const ok = await addOwnQuote(trimmed);
      if (ok) router.back();
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView
      style={styles.fill}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      /* Insets the scroll content when the keyboard opens so the Add button
         stays reachable above the keys on long quotes (the "big bug"). */
      automaticallyAdjustKeyboardInsets
      showsVerticalScrollIndicator={false}>
      <Label>Write your own words</Label>
      <Text style={[Type.title, styles.heading]}>Something that lifts you up.</Text>
      <Text style={Type.body}>A thought, a reminder — it becomes part of your collection.</Text>

      <TextInput
        value={text}
        onChangeText={setText}
        maxLength={MAX}
        multiline
        placeholder="Write something that lifts you up…"
        placeholderTextColor={Colors.textLight}
        style={styles.field}
        textAlignVertical="top"
      />

      <View style={styles.footer}>
        <Pressable
          onPress={submit}
          disabled={busy || !trimmed || atCap}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.button,
            (pressed || busy || !trimmed || atCap) && styles.buttonDisabled,
          ]}>
          {busy ? (
            <ActivityIndicator color={Colors.textDark} />
          ) : (
            <Text style={styles.buttonText}>ADD TO MY COLLECTION</Text>
          )}
        </Pressable>
        <Text style={styles.count}>
          {text.length} / {MAX}
        </Text>
      </View>

      {atCap ? (
        <View style={styles.capBanner}>
          <Text style={styles.capBannerText}>
            Your collection is full (20 of 20). Remove a quote to make room for a new one.
          </Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fill: { backgroundColor: Colors.linen },
  content: { flexGrow: 1, padding: Spacing.gutter, paddingTop: Spacing.lg, gap: Spacing.sm },
  heading: { marginTop: Spacing.xs },
  field: {
    marginTop: Spacing.md,
    backgroundColor: Colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.linenDark,
    borderRadius: Radius.card,
    padding: Spacing.md,
    minHeight: 110,
    // Cap the growth so a long quote scrolls inside the field instead of
    // pushing the Add button down behind the keyboard.
    maxHeight: 180,
    fontFamily: Type.quote.fontFamily,
    fontStyle: 'italic',
    fontSize: 16,
    lineHeight: 24,
    color: Colors.textDark,
  },
  footer: {
    marginTop: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  button: {
    backgroundColor: Colors.heart,
    borderRadius: Radius.card,
    height: HitSlop + 2,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: { opacity: 0.55 },
  buttonText: { ...Type.label, fontSize: 11, color: Colors.textDark, fontWeight: '600', letterSpacing: 1.5 },
  count: { ...Type.body, fontSize: 12, color: Colors.textLight },
  capBanner: {
    marginTop: Spacing.md,
    backgroundColor: Colors.blush,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  capBannerText: { ...Type.body, fontSize: 14, color: Colors.textDark, fontWeight: '500' },
});
