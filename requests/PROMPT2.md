# Phase 2: Google Calendar Integration

## Overview

This phase implements OAuth 2.0 authentication with Google and integrates the Google Calendar API to fetch and create events. Users will be able to sign in with their Google account, view their calendar events, and add new events from the app.

---

## Prerequisites

Before starting this phase, you need:

1. **Google Cloud Project** with Calendar API enabled
2. **OAuth 2.0 Credentials** (Web, iOS, and Android client IDs)
3. **OAuth Consent Screen** configured with required scopes

### Google Cloud Setup Steps

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "GYLR" or select existing
3. Enable Google Calendar API:
   - APIs & Services → Library → Search "Google Calendar API" → Enable
4. Configure OAuth Consent Screen:
   - APIs & Services → OAuth consent screen
   - User Type: External
   - App name: "Get Your Life Right"
   - Scopes to add:
     - `https://www.googleapis.com/auth/calendar.readonly`
     - `https://www.googleapis.com/auth/calendar.events`
5. Create OAuth Credentials:
   - APIs & Services → Credentials → Create Credentials → OAuth client ID
   - **Web application**: For Expo Go development
     - Authorized redirect URIs: `https://auth.expo.io/@your-username/gylr`
   - **iOS**: Bundle ID `com.gylr.app`
   - **Android**: Package `com.gylr.app` + SHA-1 fingerprint

---

## Dependencies to Install

```bash
npm install expo-auth-session expo-crypto expo-web-browser
```

- `expo-auth-session`: OAuth 2.0 authentication flow
- `expo-crypto`: Required for PKCE code challenge
- `expo-web-browser`: Opens browser for Google sign-in

---

## Files to Create/Modify

### New Files

| File | Purpose |
|------|---------|
| `src/services/googleAuth.ts` | Google OAuth authentication service |
| `src/services/googleCalendar.ts` | Google Calendar API wrapper |
| `src/services/index.ts` | Service exports |
| `src/config/google.ts` | Google OAuth configuration |
| `src/screens/AuthScreen.tsx` | Login screen with Google Sign-In button |
| `src/components/GoogleSignInButton.tsx` | Styled sign-in button component |
| `src/hooks/useGoogleAuth.ts` | Custom hook for auth state |
| `src/utils/dateUtils.ts` | Date manipulation helpers |
| `.env` | Environment variables (from .env.example) |

### Files to Modify

| File | Changes |
|------|---------|
| `App.tsx` | Add auth gate logic |
| `src/store/settingsSlice.ts` | Add token storage actions |
| `src/store/eventsSlice.ts` | Add async thunks for fetching events |
| `src/screens/CalendarScreen.tsx` | Display fetched events |
| `src/types/index.ts` | Add Google API response types |

---

## Implementation Steps

### Step 1: Configuration Setup

**File: `src/config/google.ts`**

```typescript
// Google OAuth configuration
// Uses environment variables for client IDs
// Defines scopes for Calendar API access
// Configures redirect URI for Expo

export const googleConfig = {
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  scopes: [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events',
  ],
};
```

### Step 2: Google Auth Service

**File: `src/services/googleAuth.ts`**

Implement:
- `signInWithGoogle()` - Initiates OAuth flow, returns access token
- `refreshAccessToken(refreshToken)` - Refreshes expired tokens
- `signOut()` - Clears stored tokens
- `getStoredTokens()` - Retrieves tokens from AsyncStorage
- `storeTokens(tokens)` - Saves tokens to AsyncStorage

Key considerations:
- Use PKCE flow for security (expo-auth-session handles this)
- Store refresh token securely in AsyncStorage
- Handle token expiration gracefully

### Step 3: Google Calendar Service

**File: `src/services/googleCalendar.ts`**

Implement:
- `fetchEvents(accessToken, startDate, endDate)` - Get events in date range
- `createEvent(accessToken, eventData)` - Create new calendar event
- `updateEvent(accessToken, eventId, eventData)` - Modify existing event
- `deleteEvent(accessToken, eventId)` - Remove event

API Endpoints:
- GET `https://www.googleapis.com/calendar/v3/calendars/primary/events`
- POST `https://www.googleapis.com/calendar/v3/calendars/primary/events`
- PUT `https://www.googleapis.com/calendar/v3/calendars/primary/events/{eventId}`
- DELETE `https://www.googleapis.com/calendar/v3/calendars/primary/events/{eventId}`

### Step 4: Auth Screen

**File: `src/screens/AuthScreen.tsx`**

UI Elements:
- App logo/title
- "Sign in with Google" button (pixel art styled)
- Brief description of what the app does
- Privacy policy link (placeholder)

Behavior:
- On button press, initiate Google OAuth flow
- On success, store tokens and update Redux state
- On failure, show error message

### Step 5: Auth Gate in App.tsx

**File: `App.tsx`**

Logic:
```
if (!isAuthenticated) {
  show AuthScreen
} else {
  show TabNavigator
}
```

On app start:
1. Check AsyncStorage for existing tokens
2. If tokens exist, validate them (or refresh if expired)
3. Update Redux `isAuthenticated` state

### Step 6: Calendar Screen Integration

**File: `src/screens/CalendarScreen.tsx`**

Features:
- Fetch events on mount (and on pull-to-refresh)
- Display events in a list/agenda view
- Show loading spinner during fetch
- Show error state if fetch fails
- Show empty state if no events

### Step 7: Redux Integration

**File: `src/store/eventsSlice.ts`**

Add async thunks:
- `fetchCalendarEvents` - Fetches from Google Calendar API
- `createCalendarEvent` - Creates event via API
- Handle loading/error states

**File: `src/store/settingsSlice.ts`**

Add:
- `accessToken` and `refreshToken` to state
- Actions to store/clear tokens

---

## Type Definitions

### Google Calendar API Response

```typescript
interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;  // For timed events
    date?: string;      // For all-day events
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  status: 'confirmed' | 'tentative' | 'cancelled';
}

interface GoogleCalendarListResponse {
  kind: string;
  items: GoogleCalendarEvent[];
  nextPageToken?: string;
}
```

### Auth Tokens

```typescript
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;  // Unix timestamp
}
```

---

## Validation Strategies

### Unit Tests

| Test | Description |
|------|-------------|
| `googleCalendar.test.ts` | Mock API responses, test event parsing |
| `googleAuth.test.ts` | Test token storage/retrieval |
| `dateUtils.test.ts` | Test date formatting functions |

### Integration Tests

| Test | Description |
|------|-------------|
| Auth flow | Sign in → tokens stored → authenticated state |
| Event fetch | Authenticated → fetch events → displayed in list |
| Token refresh | Expired token → auto refresh → new token stored |

### Manual Testing Checklist

- [ ] **Sign In Flow**
  - [ ] Tap "Sign in with Google" opens browser/webview
  - [ ] Google consent screen shows correct app name and scopes
  - [ ] After approval, redirects back to app
  - [ ] User email displays in app (or settings)
  - [ ] Auth state persists after app restart

- [ ] **Event Fetching**
  - [ ] Events load on Calendar screen
  - [ ] Loading spinner shows during fetch
  - [ ] Pull-to-refresh triggers new fetch
  - [ ] Events display correct title and time
  - [ ] All-day events handled correctly
  - [ ] Empty state shows when no events

- [ ] **Error Handling**
  - [ ] Network error shows appropriate message
  - [ ] Invalid token triggers re-auth or refresh
  - [ ] API rate limit handled gracefully

- [ ] **Sign Out**
  - [ ] Sign out clears tokens
  - [ ] Returns to Auth screen
  - [ ] Events cleared from state

---

## Environment Variables

Create `.env` file in project root:

```
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_web_client_id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your_ios_client_id.apps.googleusercontent.com
EXPO_PUBLIC_ANTHROPIC_API_KEY=your_claude_api_key
```

**Important**: Never commit `.env` to git. It's already in `.gitignore`.

---

## API Rate Limits

Google Calendar API quotas (free tier):
- 1,000,000 queries per day
- 100 queries per 100 seconds per user

For our use case, this is more than sufficient.

---

## Security Considerations

1. **Token Storage**: Use AsyncStorage (encrypted on iOS, Keystore on Android in production)
2. **PKCE Flow**: expo-auth-session uses PKCE by default for added security
3. **Scope Minimization**: Only request necessary scopes (readonly + events)
4. **Token Refresh**: Implement automatic token refresh before expiration
5. **Secure Transport**: All API calls over HTTPS

---

## Rollback Plan

If Phase 2 implementation causes issues:

1. Revert to Phase 1 state by checking out the commit before Phase 2
2. The app will show placeholder screens without Google integration
3. No data loss as we're adding new functionality, not modifying core logic

---

## Session Recovery Prompt

If starting a new session, use this prompt:

> I'm continuing work on "Get Your Life Right" (GYLR). I completed Phase 1 (project setup, navigation, Redux store) and am now working on Phase 2: Google Calendar Integration.
>
> Please read:
> - `requests/PROMPTS1.md` for the full implementation plan
> - `requests/PROMPT2.md` for Phase 2 details
> - `CLAUDE.md` for project conventions
>
> Current status: [describe what's done/remaining]
>
> Continue from where we left off.

---

## Estimated File Count

- **New files**: 9
- **Modified files**: 5
- **Total changes**: 14 files

---

## Success Criteria

Phase 2 is complete when:

1. ✅ User can sign in with Google account
2. ✅ Access token is stored and persists across app restarts
3. ✅ Calendar events are fetched and displayed
4. ✅ Pull-to-refresh works on Calendar screen
5. ✅ User can sign out
6. ✅ Error states are handled gracefully
7. ✅ All unit tests pass
8. ✅ TypeScript compiles without errors

---

*Document Version: 1.0*
*Phase: 2 of 10*
*Depends on: Phase 1 (Complete)*
