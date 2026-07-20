/**
 * Luminary Mom design tokens.
 *
 * Ported 1:1 from Frontend/luminary-mom-frontend/tailwind.config.js — the web app
 * and the iPhone app must stay visually identical, so this file is the single
 * source of truth on native. If a color changes here, change it there too.
 */

import { Platform } from 'react-native';

export const Colors = {
  /** Page ground */
  linen: '#F0EAE0',
  /** Hairline rules, dividers, input borders */
  linenDark: '#E4DDD2',

  /** Card fills — rotated across feeds and the loves list */
  lavender: '#DDD5F0',
  lavenderDeep: '#B8AEDE',
  blush: '#E8D5CB',
  blushDeep: '#D4B9AC',
  sage: '#D9E7D2',
  sageDeep: '#B8CDAE',

  /** Type */
  textDark: '#2C2520',
  textMid: '#6B5D55',
  textLight: '#74655B',

  /** The heart — the one accent in the whole app */
  heart: '#D4A0A0',
  heartSoft: '#FBE8EC',

  /** Destructive (delete account, remove quote) */
  danger: '#B3706E',

  white: '#FFFFFF',
} as const;

export type ColorName = keyof typeof Colors;

/**
 * Georgia ships with iOS, so the serif voice needs no bundled font and has no
 * silent-fallback risk. Tailwind's `font-serif` already resolves to it on web,
 * which is why the two platforms match without any work.
 */
export const Fonts = Platform.select({
  ios: { serif: 'Georgia', sans: 'system-ui' },
  default: { serif: 'serif', sans: 'System' },
})!;

/** Type scale in points. Mirrors the scale documented in the design spec. */
export const Type = {
  display: { fontFamily: Fonts.serif, fontStyle: 'italic', fontSize: 38, lineHeight: 43, color: Colors.textDark },
  title: { fontFamily: Fonts.serif, fontStyle: 'italic', fontSize: 27, lineHeight: 32, color: Colors.textDark },
  quote: { fontFamily: Fonts.serif, fontStyle: 'italic', fontSize: 21, lineHeight: 30, color: Colors.textDark },
  quoteSmall: { fontFamily: Fonts.serif, fontStyle: 'italic', fontSize: 19, lineHeight: 28, color: Colors.textDark },
  wordmark: { fontFamily: Fonts.serif, fontStyle: 'italic', fontSize: 21, color: Colors.textDark },
  body: { fontFamily: Fonts.sans, fontSize: 15, lineHeight: 25, color: Colors.textMid },
  /** Uppercase eyebrows and meta rows. Always pair with `label` casing at the call site. */
  label: { fontFamily: Fonts.sans, fontSize: 10, letterSpacing: 2, color: Colors.textLight },
  attrib: { fontFamily: Fonts.sans, fontSize: 10, letterSpacing: 1.8, color: Colors.textMid },
} as const;

export const Spacing = {
  /** Screen gutter — 22pt each side */
  gutter: 22,
  xs: 4,
  sm: 8,
  md: 14,
  lg: 22,
  xl: 34,
  xxl: 48,
} as const;

/** `rounded-sm` on the web. Deliberately sharp — softness comes from color, not corners. */
export const Radius = { card: 3, sheet: 20 } as const;

/** iOS minimum touch target. Every interactive element honors this. */
export const HitSlop = 44;

/** Matches the 200ms ease-out used across the web app. */
export const Motion = { duration: 200 } as const;
