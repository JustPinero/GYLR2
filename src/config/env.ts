// Environment variable access
// In Expo, environment variables must be prefixed with EXPO_PUBLIC_

export const ANTHROPIC_API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '';

export const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';
export const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '';

// Validate required environment variables
export function validateEnv(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  if (!ANTHROPIC_API_KEY) {
    missing.push('EXPO_PUBLIC_ANTHROPIC_API_KEY');
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

// Check if Claude API is configured
export function isClaudeConfigured(): boolean {
  return ANTHROPIC_API_KEY.length > 0 && ANTHROPIC_API_KEY !== 'your_claude_api_key_here';
}
