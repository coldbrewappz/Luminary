import * as SecureStore from 'expo-secure-store';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { API_BASE_URL } from '@/config/api';

/**
 * Ported from Frontend/luminary-mom-frontend/src/context/AuthContext.jsx.
 *
 * The logic is the same; the storage is not. localStorage is synchronous, so on
 * the web the token is simply *there* on first render. SecureStore is async and
 * backed by the iOS Keychain, so there is a real gap between app launch and
 * knowing whether anyone is signed in. That gap is what `loading` covers, and
 * why callers must wait for it before deciding to show a signed-out state.
 */

const ACCESS_TOKEN = 'accessToken';
const REFRESH_TOKEN = 'refreshToken';
const USER_EMAIL = 'userEmail';

type User = { email: string };

type AuthValue = {
  user: User | null;
  token: string | null;
  /** True until the Keychain has been read. Don't render signed-out UI while true. */
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  /**
   * fetch() with the bearer token attached. On a 401 it refreshes once and
   * retries, so a mom signs in once rather than every time the 24h access
   * token lapses. Every authenticated call in later phases goes through this.
   */
  authFetch: (path: string, init?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthValue | null>(null);

type AuthResponse = { accessToken: string; refreshToken: string; email: string };

/** The API returns either a JSON body with `message`, or bare text. Handle both. */
async function readErrorMessage(response: Response, fallback: string) {
  const text = await response.text();
  try {
    return JSON.parse(text).message || fallback;
  } catch {
    return text || fallback;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * State updates are async, but authFetch may need the freshest token
   * mid-flight (right after a refresh). This ref is the synchronous copy.
   */
  const tokenRef = useRef<string | null>(null);
  const refreshRef = useRef<string | null>(null);

  const persist = useCallback(async (data: AuthResponse) => {
    tokenRef.current = data.accessToken;
    refreshRef.current = data.refreshToken;
    setToken(data.accessToken);
    setUser({ email: data.email });
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN, data.accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN, data.refreshToken),
      SecureStore.setItemAsync(USER_EMAIL, data.email),
    ]);
  }, []);

  const clear = useCallback(async () => {
    tokenRef.current = null;
    refreshRef.current = null;
    setToken(null);
    setUser(null);
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN),
      SecureStore.deleteItemAsync(REFRESH_TOKEN),
      SecureStore.deleteItemAsync(USER_EMAIL),
    ]);
  }, []);

  // Read the Keychain once on launch. The web version does this synchronously.
  useEffect(() => {
    (async () => {
      try {
        const [savedToken, savedRefresh, savedEmail] = await Promise.all([
          SecureStore.getItemAsync(ACCESS_TOKEN),
          SecureStore.getItemAsync(REFRESH_TOKEN),
          SecureStore.getItemAsync(USER_EMAIL),
        ]);
        if (savedToken && savedEmail) {
          tokenRef.current = savedToken;
          refreshRef.current = savedRefresh;
          setToken(savedToken);
          setUser({ email: savedEmail });
        }
      } catch (err) {
        // A corrupt Keychain entry shouldn't wedge the app on a blank screen.
        console.warn('Could not read saved session:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const authenticate = useCallback(
    async (path: 'login' | 'register', email: string, password: string, fallback: string) => {
      const response = await fetch(`${API_BASE_URL}/api/auth/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error(await readErrorMessage(response, fallback));
      await persist((await response.json()) as AuthResponse);
    },
    [persist],
  );

  const login = useCallback(
    (email: string, password: string) =>
      authenticate('login', email, password, 'Invalid email or password. Please try again.'),
    [authenticate],
  );

  const register = useCallback(
    (email: string, password: string) =>
      authenticate('register', email, password, 'Unable to create your account. Please try again.'),
    [authenticate],
  );

  /**
   * Swap the refresh token for a new pair. Returns the new access token, or
   * null if the refresh token is dead — in which case the session is cleared
   * and the mom has to sign in again.
   *
   * Note the odd request shape: the backend declares `@RequestBody String`,
   * so it wants the bare token as a plain-text body, not JSON. Phase 17
   * changes the endpoint to accept JSON; until then, match what it expects.
   */
  const refreshSession = useCallback(async () => {
    const refreshToken = refreshRef.current;
    if (!refreshToken) return null;
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: refreshToken,
      });
      if (!response.ok) {
        await clear();
        return null;
      }
      const data = (await response.json()) as AuthResponse;
      await persist(data);
      return data.accessToken;
    } catch {
      // Network failure is not the same as a rejected token — keep the session.
      return null;
    }
  }, [clear, persist]);

  const authFetch = useCallback(
    async (path: string, init: RequestInit = {}) => {
      const call = (bearer: string | null) =>
        fetch(`${API_BASE_URL}${path}`, {
          ...init,
          headers: {
            ...init.headers,
            ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
          },
        });

      const response = await call(tokenRef.current);
      // Spring Security returns 403 (not 401) for an expired or invalid token,
      // so treat both as "token no good" and try a refresh-and-retry once.
      if (response.status !== 401 && response.status !== 403) return response;

      const fresh = await refreshSession();
      return fresh ? call(fresh) : response;
    },
    [refreshSession],
  );

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout: clear, authFetch }),
    [user, token, loading, login, register, clear, authFetch],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}
