/**
 * API base URL.
 *
 * Mirrors Frontend/luminary-mom-frontend/src/config/api.js. Set
 * EXPO_PUBLIC_API_URL in .env to point at a deployed backend; the default is a
 * local Spring Boot server.
 *
 * Note on the simulator: localhost resolves to the Mac, so it works there. On a
 * physical device over Wi-Fi you need your Mac's LAN IP instead.
 */
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

/** Shapes returned by the Spring Boot API. Kept in sync with Backend/api Model/. */
export type Quote = {
  id: number;
  text: string;
  author: string;
  category: string;
};

export type SavedQuote = {
  id: number;
  quote: Quote;
};

export type PersonalQuote = {
  id: number;
  text: string;
};

export type CategoryId =
  | 'motherhood'
  | 'healing'
  | 'hope'
  | 'strength'
  | 'not-alone'
  | 'humor';

export const CATEGORIES: { id: CategoryId; name: string; emoji: string; theme: 'lavender' | 'blush' }[] = [
  { id: 'motherhood', name: 'Motherhood', emoji: '🌸', theme: 'lavender' },
  { id: 'healing', name: 'Healing', emoji: '🌿', theme: 'blush' },
  { id: 'hope', name: 'Hope', emoji: '☀️', theme: 'lavender' },
  { id: 'strength', name: 'Strength', emoji: '💪', theme: 'blush' },
  { id: 'not-alone', name: 'You Are Not Alone', emoji: '🤍', theme: 'lavender' },
  { id: 'humor', name: 'A Little Humor', emoji: '😄', theme: 'blush' },
];

/** Saved + personal quotes combined may not exceed this. Matches LovesContext. */
export const QUOTE_CAP = 20;
