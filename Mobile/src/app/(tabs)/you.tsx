import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { ReactNode, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, Pressable, Share, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Label, Screen } from '@/components/screen';
import { Colors, HitSlop, Radius, Spacing, TabBarClearance, Type } from '@/constants/theme';
import { useAuth } from '@/context/auth';
import { useLoves } from '@/context/loves';
import {
  cancelDailyReminder,
  ensureNotificationPermission,
  isReminderScheduled,
  scheduleDailyReminder,
} from '@/lib/notifications';

// Brand mark, shared with the Today header.
const LOGO = require('../../../assets/images/icon.png');

/**
 * The You tab: account home. Share is the first thing (its own CTA card), then
 * a warm banner and grouped settings.
 *
 * Some rows need backend that doesn't exist yet — Change Password, Privacy
 * Policy, and Delete Account all land in Phase 17 (Delete Account also needs
 * DELETE /api/auth/me, which Apple requires). Those show a "coming soon" note
 * for now. Notifications is reserved for a later daily-reminder feature.
 */
export default function YouScreen() {
  const insets = useSafeAreaInsets();
  const { user, loading, logout, authFetch } = useAuth();
  const { total } = useLoves();

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

  // Signed out — invite them in.
  if (!user) {
    return (
      <Screen title="You">
        <View style={styles.signedOut}>
          <Text style={Type.quoteSmall}>Your collection is waiting.</Text>
          <Text style={[Type.body, styles.signedOutBody]}>
            Sign in to save the quotes you love and write your own.
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

  const savedLabel = `${total} ${total === 1 ? 'light' : 'lights'} saved`;

  async function onShare() {
    try {
      await Share.share({
        message: 'Luminary Mom — a little light for the postpartum journey. 💛',
        url: 'https://luminarymoms.vercel.app',
      });
    } catch {
      // User dismissed the share sheet — nothing to do.
    }
  }

  function comingSoon(feature: string) {
    Alert.alert(feature, 'This is coming soon — it will be ready before launch.');
  }

  function confirmSignOut() {
    Alert.alert('Sign out?', 'You can sign back in any time.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => logout() },
    ]);
  }

  function confirmDeleteAccount() {
    Alert.alert(
      'Delete account?',
      'This permanently deletes your account and everything you’ve saved. This can’t be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await authFetch('/api/auth/me', { method: 'DELETE' });
              if (res.ok) {
                await logout(); // clears the session → drops back to signed-out
              } else {
                Alert.alert('Something went wrong', 'We couldn’t delete your account. Please try again.');
              }
            } catch {
              Alert.alert('Something went wrong', 'We couldn’t delete your account. Please try again.');
            }
          },
        },
      ]
    );
  }

  return (
    <Screen title="You" contentStyle={{ paddingBottom: insets.bottom + TabBarClearance }}>
      {/* Greeting banner */}
      <View style={styles.banner}>
        <Image source={LOGO} style={styles.bannerLogo} accessible={false} />
        <Text style={styles.greeting}>Hello, Mamma</Text>
        <Label style={styles.bannerEyebrow}>Your account</Label>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* Share — sits right under the greeting. */}
      <Pressable
        onPress={onShare}
        accessibilityRole="button"
        style={({ pressed }) => [styles.shareCard, pressed && styles.pressed]}>
        <View style={styles.shareText}>
          <Text style={styles.shareTitle}>Share Luminary Mom</Text>
          <Text style={styles.shareSubtitle}>Send a little light to a friend</Text>
        </View>
        <Text style={styles.shareArrow}>↗</Text>
      </Pressable>

      <Section label="My collection">
        <Row
          icon="♡"
          title="Saved Quotes"
          subtitle={savedLabel}
          chevron
          onPress={() => router.push('/loves')}
        />
      </Section>

      <Section label="Notifications">
        <DailyReminder />
      </Section>

      <Section label="Display">
        <Row title="Dark mode" subtitle="Coming soon" muted />
      </Section>

      <Section label="About">
        <Row title="About Luminary Mom" chevron onPress={() => router.push('/about')} />
        <View style={styles.rowDivider} />
        <Row
          title="Privacy Policy"
          chevron
          onPress={() => Linking.openURL('https://luminarymom.com/privacy')}
        />
      </Section>

      <Section label="Account settings">
        <Row title="Change Password" chevron onPress={() => comingSoon('Change Password')} />
        <View style={styles.rowDivider} />
        <Row title="Sign Out" onPress={confirmSignOut} />
      </Section>

      <Section label="Account management">
        <Row title="Delete Account" destructive onPress={confirmDeleteAccount} />
      </Section>

      <Text style={styles.version}>Luminary Mom · 1.0</Text>
    </Screen>
  );
}

/** A titled group with a rule above it, matching the sectioned design. */
function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.rule} />
      <Label style={styles.sectionLabel}>{label}</Label>
      {children}
    </View>
  );
}

/** One settings row: optional leading icon, a title, optional subtitle, optional chevron. */
function Row({
  icon,
  title,
  subtitle,
  chevron,
  destructive,
  muted,
  onPress,
}: {
  icon?: string;
  title: string;
  subtitle?: string;
  chevron?: boolean;
  destructive?: boolean;
  muted?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, pressed && onPress && styles.pressed]}>
      {icon ? <Text style={styles.rowIcon}>{icon}</Text> : null}
      <View style={styles.rowMiddle}>
        <Text style={[styles.rowTitle, destructive && styles.rowDestructive, muted && styles.rowMuted]}>
          {title}
        </Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      {chevron ? <Text style={styles.chevron}>›</Text> : null}
    </Pressable>
  );
}

const REMINDER_ON_KEY = 'reminderEnabled';
const REMINDER_TIME_KEY = 'reminderTime'; // "hour:minute", 24h

/** A Date set to today at the given time — the shape DateTimePicker wants. */
function timeAt(hour: number, minute: number): Date {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d;
}

/**
 * The daily-reminder controls: a switch, and — when it's on — a native time
 * picker. Its own little component so its hooks sit below YouScreen's early
 * returns (signed-out / loading), which can't hold hooks after them.
 */
function DailyReminder() {
  const [ready, setReady] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState(() => timeAt(8, 0));

  // Load the saved setting, and re-arm the schedule if iOS somehow lost it.
  useEffect(() => {
    (async () => {
      try {
        let hour = 8;
        let minute = 0;
        const savedTime = await SecureStore.getItemAsync(REMINDER_TIME_KEY);
        if (savedTime) {
          [hour, minute] = savedTime.split(':').map(Number);
          setTime(timeAt(hour, minute));
        }
        const on = (await SecureStore.getItemAsync(REMINDER_ON_KEY)) === 'true';
        setEnabled(on);
        if (on && !(await isReminderScheduled())) {
          await scheduleDailyReminder(hour, minute);
        }
      } catch {
        // Defaults (off, 8:00) are fine.
      } finally {
        setReady(true);
      }
    })();
  }, []);

  async function onToggle(next: boolean) {
    if (next) {
      const granted = await ensureNotificationPermission();
      if (!granted) {
        Alert.alert(
          'Notifications are off',
          'To get your daily reminder, turn on notifications for Luminary Mom in Settings.'
        );
        return; // leave the switch off
      }
      await scheduleDailyReminder(time.getHours(), time.getMinutes());
      await SecureStore.setItemAsync(REMINDER_ON_KEY, 'true');
      setEnabled(true);
    } else {
      await cancelDailyReminder();
      await SecureStore.setItemAsync(REMINDER_ON_KEY, 'false');
      setEnabled(false);
    }
  }

  async function onChangeTime(_event: DateTimePickerEvent, picked?: Date) {
    if (!picked) return;
    setTime(picked);
    await SecureStore.setItemAsync(REMINDER_TIME_KEY, `${picked.getHours()}:${picked.getMinutes()}`);
    if (enabled) await scheduleDailyReminder(picked.getHours(), picked.getMinutes());
  }

  // Wait until we know the saved state so the switch doesn't flash the wrong way.
  if (!ready) return null;

  return (
    <>
      <View style={styles.row}>
        <View style={styles.rowMiddle}>
          <Text style={styles.rowTitle}>Daily reminder</Text>
          <Text style={styles.rowSubtitle}>A quote each morning</Text>
        </View>
        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ true: Colors.heart, false: '#CFC7BA' }}
          ios_backgroundColor="#CFC7BA"
        />
      </View>
      {enabled ? (
        <>
          <View style={styles.rowDivider} />
          <View style={styles.row}>
            <View style={styles.rowMiddle}>
              <Text style={styles.rowTitle}>Time</Text>
            </View>
            <DateTimePicker value={time} mode="time" onChange={onChangeTime} accentColor={Colors.heart} />
          </View>
        </>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  centerBlock: { paddingTop: Spacing.xxl, alignItems: 'center' },

  // --- signed out ---
  signedOut: { padding: Spacing.gutter, paddingTop: Spacing.xxl, alignItems: 'center', gap: Spacing.sm },
  signedOutBody: { textAlign: 'center' },
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

  // --- banner ---
  banner: {
    margin: Spacing.gutter,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.blush,
    borderRadius: Radius.card,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    gap: 6,
  },
  bannerLogo: { width: 60, height: 60, borderRadius: 13, marginBottom: 2 },
  greeting: { ...Type.title, fontSize: 26 },
  bannerEyebrow: { marginTop: Spacing.sm, fontSize: 10 },
  email: { ...Type.body, fontSize: 15, color: Colors.textMid },

  // --- share CTA (under the banner) ---
  shareCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lavender,
    borderRadius: Radius.card,
    marginHorizontal: Spacing.gutter,
    marginTop: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  shareText: { flex: 1, gap: 2 },
  shareTitle: { fontFamily: Type.quote.fontFamily, fontStyle: 'italic', fontSize: 18, color: Colors.textDark },
  shareSubtitle: { ...Type.body, fontSize: 13, color: Colors.textMid },
  shareArrow: { fontSize: 22, color: Colors.textMid },

  // --- sections ---
  section: { paddingHorizontal: Spacing.gutter },
  rule: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.linenDark, marginTop: Spacing.lg },
  sectionLabel: { marginTop: Spacing.lg, marginBottom: Spacing.xs },

  // --- rows ---
  row: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  rowIcon: { fontSize: 18, color: Colors.heart, width: 22 },
  rowMiddle: { flex: 1, gap: 2 },
  rowTitle: { ...Type.body, fontSize: 16, color: Colors.textDark },
  rowSubtitle: { ...Type.body, fontSize: 13, color: Colors.textLight },
  rowDestructive: { color: Colors.danger },
  rowMuted: { color: Colors.textLight },
  chevron: { fontSize: 24, color: Colors.textLight, marginTop: -2 },
  rowDivider: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.linenDark, marginLeft: 34 },

  version: {
    ...Type.body,
    fontSize: 11,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: Spacing.xxl,
    letterSpacing: 0.5,
  },

  pressed: { opacity: 0.5 },
});
