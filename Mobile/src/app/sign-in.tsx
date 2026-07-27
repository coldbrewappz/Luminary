import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Label } from '@/components/screen';
import { Colors, HitSlop, Radius, Spacing, Type } from '@/constants/theme';
import { useAuth } from '@/context/auth';

/**
 * LoginPage.jsx and RegisterPage.jsx merged into one sheet that toggles mode.
 * Two near-identical screens is a web habit; on a phone it's one sheet with a
 * switch at the bottom.
 */
export default function SignInSheet() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'signIn' | 'register'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isRegister = mode === 'register';

  async function submit() {
    if (busy) return;
    const trimmed = email.trim();
    if (!trimmed || !password) {
      setError('Enter your email and password to continue.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await (isRegister ? register(trimmed, password) : login(trimmed, password));
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView
      style={styles.fill}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
        <Label>Save a little light for later</Label>
        <Text style={[Type.title, styles.heading]}>
          {isRegister ? 'Welcome in.' : 'Welcome back.'}
        </Text>
        <Text style={Type.body}>
          {isRegister
            ? 'Create a free account and your collection is saved for good.'
            : 'Sign in and we’ll add this quote to your collection.'}
        </Text>

        <View style={styles.fields}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@email.com"
            placeholderTextColor={Colors.textLight}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            style={styles.field}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={Colors.textLight}
            secureTextEntry
            autoCapitalize="none"
            /* newPassword lets iOS Keychain offer to generate and save one. */
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            textContentType={isRegister ? 'newPassword' : 'password'}
            onSubmitEditing={submit}
            returnKeyType="go"
            style={styles.field}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            onPress={submit}
            disabled={busy}
            accessibilityRole="button"
            style={({ pressed }) => [styles.button, (pressed || busy) && styles.buttonPressed]}>
            {busy ? (
              <ActivityIndicator color={Colors.heart} />
            ) : (
              <Text style={styles.buttonText}>
                {isRegister ? 'CREATE ACCOUNT' : 'SIGN IN'}
              </Text>
            )}
          </Pressable>
        </View>

        <Pressable
          onPress={() => {
            setMode(isRegister ? 'signIn' : 'register');
            setError(null);
          }}
          style={styles.switch}>
          <Text style={Type.body}>
            {isRegister ? 'Already have an account? ' : 'New here? '}
            <Text style={styles.switchLink}>
              {isRegister ? 'Sign in' : 'Create a free account'}
            </Text>
          </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fill: { backgroundColor: Colors.linen },
  // flexGrow (not flex:1) so the sheet can measure content height — a formSheet
  // with flex:1 children resolves to zero height and renders blank.
  content: { flexGrow: 1, padding: Spacing.gutter, paddingTop: Spacing.lg, gap: Spacing.sm },
  heading: { marginTop: Spacing.xs },
  fields: { marginTop: Spacing.lg, gap: Spacing.sm },
  field: {
    backgroundColor: Colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.linenDark,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.md,
    height: 50,
    fontFamily: Type.quote.fontFamily,
    fontStyle: 'italic',
    fontSize: 16,
    color: Colors.textDark,
  },
  error: { ...Type.body, color: Colors.danger, fontSize: 13 },
  button: {
    backgroundColor: Colors.heartSoft,
    borderRadius: Radius.card,
    height: HitSlop + 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xs,
  },
  buttonPressed: { opacity: 0.6 },
  buttonText: { ...Type.label, color: Colors.heart, letterSpacing: 2.4 },
  switch: { marginTop: Spacing.lg, alignItems: 'center', minHeight: HitSlop, justifyContent: 'center' },
  switchLink: { color: Colors.textDark },
});
