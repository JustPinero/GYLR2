import { makeRedirectUri } from 'expo-auth-session';
import { Platform } from 'react-native';

// Google OAuth 2.0 Configuration
export const googleConfig = {
  // Client IDs from environment variables
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '',
  webClientSecret: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_SECRET ?? '',
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

// Get the reversed client ID for iOS URL scheme
// iOS client ID format: XXX.apps.googleusercontent.com
// Reversed format: com.googleusercontent.apps.XXX
function getIosReversedClientId(): string {
  const iosClientId = googleConfig.iosClientId;
  if (!iosClientId) return '';

  // Extract the unique part before .apps.googleusercontent.com
  const match = iosClientId.match(/^(.+)\.apps\.googleusercontent\.com$/);
  if (match && match[1]) {
    return `com.googleusercontent.apps.${match[1]}`;
  }
  return '';
}

// Generate redirect URI for Expo
// For iOS: uses the reversed client ID as URL scheme (required by Google)
// For web: uses localhost with path
export function getRedirectUri(): string {
  let uri: string;

  if (Platform.OS === 'ios') {
    const reversedClientId = getIosReversedClientId();
    uri = `${reversedClientId}:/oauth2redirect/google`;
  } else {
    uri = makeRedirectUri({
      scheme: 'gylr',
      path: 'oauth',
    });
  }

  // Log the redirect URI to help with debugging
  console.log('OAuth Redirect URI:', uri);

  return uri;
}

// Google Calendar API base URL
export const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';
