import * as Notifications from 'expo-notifications';

/**
 * The daily reminder — a single repeating local notification that nudges her to
 * open the app each morning. It's scheduled on the device (no server, no push),
 * and iOS keeps it repeating until we cancel it, so we only schedule/cancel when
 * she toggles it or changes the time.
 *
 * The copy stays the same each day (see the reminder design): a local repeating
 * notification can't show a different quote per day, so it's a gentle nudge that
 * opens the app to Today, where the real daily quote lives.
 */
const REMINDER_ID = 'daily-reminder';
const TITLE = 'Good morning, mama';
const BODY = 'Today’s light is ready for you.';

// If the app happens to be open when it fires, still show the banner.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/** Ask for notification permission if we don't already have it. Returns whether it's granted. */
export async function ensureNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false; // she said no before — can't re-prompt
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

/** Schedule (or reschedule) the daily reminder for the given local time. */
export async function scheduleDailyReminder(hour: number, minute: number): Promise<void> {
  await cancelDailyReminder();
  await Notifications.scheduleNotificationAsync({
    identifier: REMINDER_ID,
    content: { title: TITLE, body: BODY },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute },
  });
}

/** Turn the daily reminder off. */
export async function cancelDailyReminder(): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(REMINDER_ID);
  } catch {
    // Wasn't scheduled — nothing to cancel.
  }
}

/** True if the reminder is currently scheduled with iOS (used to reconcile on launch). */
export async function isReminderScheduled(): Promise<boolean> {
  const all = await Notifications.getAllScheduledNotificationsAsync();
  return all.some((n) => n.identifier === REMINDER_ID);
}
