import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { googleConfig, getRedirectUri } from '../config/google';
import { AuthTokens, GoogleUserInfo } from '../types';

// Complete any pending auth sessions
WebBrowser.maybeCompleteAuthSession();

// Storage keys
const STORAGE_KEYS = {
  AUTH_TOKENS: '@gylr/auth_tokens',
  USER_INFO: '@gylr/user_info',
} as const;

// Discovery document for Google OAuth
const discovery: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: googleConfig.endpoints.authorization,
  tokenEndpoint: googleConfig.endpoints.token,
  revocationEndpoint: googleConfig.endpoints.revocation,
};

/**
 * Create auth request configuration
 */
function createAuthRequest(): AuthSession.AuthRequest {
  return new AuthSession.AuthRequest({
    clientId: googleConfig.webClientId,
    scopes: googleConfig.scopes,
    redirectUri: getRedirectUri(),
    usePKCE: true,
    extraParams: {
      access_type: 'offline',
      prompt: 'consent',
    },
  });
}

/**
 * Sign in with Google OAuth
 * Returns tokens on success, null on failure/cancel
 */
export async function signInWithGoogle(): Promise<AuthTokens | null> {
  try {
    const request = createAuthRequest();
    const result = await request.promptAsync(discovery);

    if (result.type !== 'success' || !result.params['code']) {
      return null;
    }

    // Exchange code for tokens
    const tokenResponse = await AuthSession.exchangeCodeAsync(
      {
        clientId: googleConfig.webClientId,
        code: result.params['code'],
        redirectUri: getRedirectUri(),
        extraParams: {
          code_verifier: request.codeVerifier ?? '',
        },
      },
      discovery
    );

    const tokens: AuthTokens = {
      accessToken: tokenResponse.accessToken,
      refreshToken: tokenResponse.refreshToken,
      expiresAt: tokenResponse.expiresIn
        ? Date.now() + tokenResponse.expiresIn * 1000
        : Date.now() + 3600 * 1000,
      idToken: tokenResponse.idToken,
    };

    // Store tokens
    await storeTokens(tokens);

    // Fetch and store user info
    await fetchAndStoreUserInfo(tokens.accessToken);

    return tokens;
  } catch (error) {
    console.error('Google sign in error:', error);
    return null;
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(
  refreshToken: string
): Promise<AuthTokens | null> {
  try {
    const tokenResponse = await AuthSession.refreshAsync(
      {
        clientId: googleConfig.webClientId,
        refreshToken,
      },
      discovery
    );

    const tokens: AuthTokens = {
      accessToken: tokenResponse.accessToken,
      refreshToken: tokenResponse.refreshToken ?? refreshToken,
      expiresAt: tokenResponse.expiresIn
        ? Date.now() + tokenResponse.expiresIn * 1000
        : Date.now() + 3600 * 1000,
      idToken: tokenResponse.idToken,
    };

    await storeTokens(tokens);
    return tokens;
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}

/**
 * Store auth tokens in AsyncStorage
 */
export async function storeTokens(tokens: AuthTokens): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKENS, JSON.stringify(tokens));
}

/**
 * Retrieve stored auth tokens
 */
export async function getStoredTokens(): Promise<AuthTokens | null> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKENS);
    if (!stored) return null;
    return JSON.parse(stored) as AuthTokens;
  } catch {
    return null;
  }
}

/**
 * Check if tokens are expired (with 5 minute buffer)
 */
export function isTokenExpired(tokens: AuthTokens): boolean {
  const bufferMs = 5 * 60 * 1000; // 5 minutes
  return Date.now() >= tokens.expiresAt - bufferMs;
}

/**
 * Get valid access token, refreshing if needed
 */
export async function getValidAccessToken(): Promise<string | null> {
  const tokens = await getStoredTokens();
  if (!tokens) return null;

  if (!isTokenExpired(tokens)) {
    return tokens.accessToken;
  }

  // Token expired, try to refresh
  if (tokens.refreshToken) {
    const newTokens = await refreshAccessToken(tokens.refreshToken);
    return newTokens?.accessToken ?? null;
  }

  return null;
}

/**
 * Fetch user info from Google and store it
 */
async function fetchAndStoreUserInfo(accessToken: string): Promise<GoogleUserInfo | null> {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) return null;

    const userInfo = (await response.json()) as GoogleUserInfo;
    await AsyncStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
    return userInfo;
  } catch {
    return null;
  }
}

/**
 * Get stored user info
 */
export async function getStoredUserInfo(): Promise<GoogleUserInfo | null> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.USER_INFO);
    if (!stored) return null;
    return JSON.parse(stored) as GoogleUserInfo;
  } catch {
    return null;
  }
}

/**
 * Sign out - clear all stored auth data
 */
export async function signOut(): Promise<void> {
  try {
    // Revoke token if we have one
    const tokens = await getStoredTokens();
    if (tokens?.accessToken) {
      await AuthSession.revokeAsync(
        { token: tokens.accessToken },
        discovery
      );
    }
  } catch {
    // Ignore revocation errors
  }

  // Clear stored data
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.AUTH_TOKENS,
    STORAGE_KEYS.USER_INFO,
  ]);
}
