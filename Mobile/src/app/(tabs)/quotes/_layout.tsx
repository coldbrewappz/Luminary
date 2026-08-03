import { Stack } from 'expo-router';

/**
 * The Quotes tab is its own little stack: the category grid (index) and the
 * feed you drill into. Keeping the stack *inside* the tab means the bottom tab
 * bar stays visible on the feed, and the iOS swipe-back gesture works for free.
 *
 * Headers are off because our Screen component draws its own nav bar.
 */
export default function QuotesStackLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
