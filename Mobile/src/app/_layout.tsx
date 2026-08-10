import { ThemeProvider, DefaultTheme, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from '@/context/auth';
import { LovesProvider } from '@/context/loves';
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
    <AuthProvider>
      <LovesProvider>
        <ThemeProvider value={LuminaryTheme}>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            {/*
              Presented over whatever she was doing, so the quote that triggered
              the prompt stays visible behind the scrim and she never loses her
              place — unlike the web, where /login is a separate page.
            */}
            <Stack.Screen
              name="sign-in"
              options={{
                presentation: 'formSheet',
                sheetGrabberVisible: true,
                // A formSheet needs an explicit detent or it opens at zero height
                // and renders blank. 0.9 leaves a sliver of the screen behind
                // visible, keeping the "sheet over content" feel from the design.
                sheetAllowedDetents: [0.9],
                contentStyle: { backgroundColor: Colors.linen },
              }}
            />
            {/* Write-your-own, presented the same way as sign-in. */}
            <Stack.Screen
              name="write"
              options={{
                presentation: 'formSheet',
                sheetGrabberVisible: true,
                sheetAllowedDetents: [0.6],
                contentStyle: { backgroundColor: Colors.linen },
              }}
            />
            {/* About — a normal pushed card (slides in, swipe-back), from the You tab. */}
            <Stack.Screen name="about" />
          </Stack>
        </ThemeProvider>
      </LovesProvider>
    </AuthProvider>
  );
}
