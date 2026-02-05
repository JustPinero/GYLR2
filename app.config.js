// Dynamic Expo configuration
// This file extends app.json and adds dynamic values from environment variables

const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '';

// Extract reversed client ID for URL scheme (required for Google OAuth on iOS)
// iOS client ID format: XXX.apps.googleusercontent.com
// Reversed format: com.googleusercontent.apps.XXX
function getReversedClientId(clientId) {
  if (!clientId) return null;
  const match = clientId.match(/^(.+)\.apps\.googleusercontent\.com$/);
  if (match && match[1]) {
    return `com.googleusercontent.apps.${match[1]}`;
  }
  return null;
}

const reversedClientId = getReversedClientId(iosClientId);

// Build the scheme array
const schemes = ['gylr'];
if (reversedClientId) {
  schemes.push(reversedClientId);
}

module.exports = ({ config }) => {
  return {
    ...config,
    scheme: schemes,
  };
};
