import * as Haptics from 'expo-haptics';

/**
 * The app's haptic vocabulary, kept deliberately small (see the "subtle &
 * minimal" design choice): a gentle tap only on meaningful moments — saving,
 * removing, adding your own words — never on routine taps or navigation.
 *
 * Each call swallows its own errors: haptics are a nicety, and they simply
 * don't exist on the iOS Simulator or some devices, so a failure must never
 * bubble up into the action it accompanies.
 */
export const haptics = {
  /** A quote was saved to the collection. */
  save: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}),
  /** A quote was removed from the collection. */
  remove: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}),
  /** The mom's own words were added — a small moment worth a warmer buzz. */
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}),
  /** The collection is full — a gentle "not this time". */
  warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {}),
};
