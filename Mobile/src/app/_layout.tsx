import { ThemeProvider, DefaultTheme } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import AppTabs from '@/components/app-tabs';
import { Colors } from '@/constants/theme';

/**
 * Luminary's identity is a light linen ground, so the app commits to a light
 * appearance rather than following the system theme. A dark version is a design
 * project of its own, not a port — see the design spec.
 */
const LuminaryTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.linen,
    card: Colors.linen,
    border: Colors.linenDark,
    text: Colors.textDark,
    primary: Colors.heart,
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={LuminaryTheme}>
      <StatusBar style="dark" />
      <AppTabs />
    </ThemeProvider>
  );
}
