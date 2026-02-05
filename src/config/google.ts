import { makeRedirectUri } from 'expo-auth-session';

// Google OAuth 2.0 Configuration
export const googleConfig = {
  // Client IDs from environment variables
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '',
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '',

  // OAuth scopes for Google Calendar access
  scopes: [
    'openid',
    'profile',
    'email',
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events',
  ],

  // Google OAuth endpoints
  endpoints: {
    authorization: 'https://accounts.google.com/o/oauth2/v2/auth',
    token: 'https://oauth2.googleapis.com/token',
    revocation: 'https://oauth2.googleapis.com/revoke',
  },
};

// Generate redirect URI for Expo
export function getRedirectUri(): string {
  return makeRedirectUri({
    scheme: 'gylr',
    path: 'oauth',
  });
}

// Google Calendar API base URL
export const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';
