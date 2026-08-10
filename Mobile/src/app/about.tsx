import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Label, Screen } from '@/components/screen';
import { Colors, Spacing, Type } from '@/constants/theme';

/**
 * "Our story" — ported from Frontend/.../pages/AboutPage.jsx. Pushed from the
 * You tab, so it gets a back chevron rather than the wordmark.
 */
export default function AboutScreen() {
  return (
    <Screen onBack={() => router.back()} backLabel="You">
      <View style={styles.body}>
        <Label style={styles.eyebrow}>Our story</Label>
        <Text style={styles.heading}>Built by a mom,{'\n'}for moms.</Text>

        <Text style={styles.paragraph}>
          The postpartum period is one of the most quietly difficult seasons of a woman&apos;s life.
          Luminary Mom was created to be a small, steady light — a place to come when you need a
          reminder that what you&apos;re feeling is valid, and that you are not alone.
        </Text>
        <Text style={styles.paragraph}>
          We believe in the power of words to shift a moment. Sometimes one sentence is enough to
          help you breathe again.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: Spacing.gutter, paddingTop: Spacing.xl, gap: Spacing.md },
  eyebrow: { fontSize: 11 },
  heading: { ...Type.title, fontSize: 32, marginBottom: Spacing.sm },
  paragraph: { ...Type.body, fontSize: 15, lineHeight: 26, color: Colors.textMid },
});
