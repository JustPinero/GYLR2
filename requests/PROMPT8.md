# Phase 8: Polish, UX & App Store Preparation

## Overview

This final phase focuses on polishing the user experience and preparing the app for deployment to the Apple App Store and Google Play Store. This includes onboarding, haptic feedback, improved error states, and all app store assets.

---

## Prerequisites

- Phase 7 completed (Pixel Art Styling & Settings)
- All core features functional
- Google OAuth working
- Claude API integration working

---

## Part A: Polish & UX

### Task 1: Create Onboarding Flow

Create a first-launch onboarding experience to introduce the app.

**Screens:**
1. **Welcome** - App name, tagline, pixel art mascot
2. **How It Works** - Connect calendar → Categorize events → Get roasted
3. **Meet Your Judge** - Preview of the judge personalities
4. **Get Started** - Google Sign In button

**Implementation:**
- Use `@react-native-async-storage/async-storage` to track if onboarded
- Create `src/screens/OnboardingScreen.tsx`
- Horizontal swipeable pages with dot indicators
- Skip button available on all screens
- Store `@gylr/has_onboarded` flag

**Visual Style:**
- Full-screen pages with pixel art background
- Large centered illustrations/emojis
- Minimal text, clear messaging
- Progress dots at bottom

---

### Task 2: Add Haptic Feedback

Add tactile feedback for key interactions.

**Install:**
```bash
npx expo install expo-haptics
```

**Haptic Points:**
| Action | Haptic Type |
|--------|-------------|
| Category selection | `selectionAsync()` |
| Button press | `impactAsync(ImpactFeedbackStyle.Light)` |
| Judgment received | `notificationAsync(NotificationFeedbackType.Success)` |
| Error | `notificationAsync(NotificationFeedbackType.Error)` |
| Pull to refresh complete | `impactAsync(ImpactFeedbackStyle.Medium)` |

**Implementation:**
- Create `src/utils/haptics.ts` utility
- Wrap common haptic patterns
- Add to PixelButton, CategoryPicker, JudgmentCard

---

### Task 3: Improve Empty States

Enhance empty state displays throughout the app.

**Calendar Screen - No Events:**
```
┌─────────────────────────────┐
│                             │
│           📅               │
│                             │
│    No Events Today          │
│                             │
│  Your calendar is clear!    │
│  Enjoy your free time or    │
│  add a new event.           │
│                             │
│     [Add Event]             │
│                             │
└─────────────────────────────┘
```

**Life Panel - No Categorized Events:**
Already implemented, but enhance with animation.

**Settings - Not Signed In:**
Should not be reachable (auth gate), but add fallback.

---

### Task 4: Enhanced Error Handling UI

Create consistent error display components.

**Create `src/components/ErrorBanner.tsx`:**
- Dismissible banner for non-blocking errors
- Red/warning styling
- Retry button where applicable

**Error Scenarios:**
| Scenario | Display | Action |
|----------|---------|--------|
| Network offline | Banner | "Check connection" |
| Calendar sync failed | Banner + Retry | Retry button |
| Claude API error | In JudgmentCard | Already handled |
| Token expired | Auto-refresh or re-auth | Redirect to login |

**Create `src/components/OfflineBanner.tsx`:**
- Persistent banner when no network
- Use `@react-native-community/netinfo`

---

### Task 5: Loading States Polish

Improve loading experiences throughout.

**Skeleton Loaders:**
- Create `src/components/SkeletonLoader.tsx`
- Use for calendar events while loading
- Animated shimmer effect

**Pull-to-Refresh:**
- Already implemented, add haptic feedback
- Show last sync time

---

## Part B: App Store Preparation

### Task 6: Configure App Icons

Create pixel art app icons in required sizes.

**Icon Requirements:**
- iOS: 1024x1024 (App Store), multiple sizes for device
- Android: 512x512 (Play Store), adaptive icon layers

**Design Concept:**
- Pixel art style clock or calendar
- Category colors represented
- Clear at small sizes
- No text (Apple guideline)

**Implementation:**
- Add icons to `assets/` folder
- Configure in `app.json`:
```json
{
  "expo": {
    "icon": "./assets/icon.png",
    "ios": {
      "icon": "./assets/icon-ios.png"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#2C2137"
      }
    }
  }
}
```

---

### Task 7: Configure Splash Screen

Design and implement the app splash screen.

**Design:**
- App name "GYLR" in pixel font
- Subtle animation (optional)
- Match app background color (#2C2137)

**Configuration in `app.json`:**
```json
{
  "expo": {
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#2C2137"
    }
  }
}
```

---

### Task 8: Update app.json for Production

Complete app configuration for store submission.

**Required Fields:**
```json
{
  "expo": {
    "name": "Get Your Life Right",
    "slug": "gylr",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "scheme": "gylr",
    "userInterfaceStyle": "dark",
    "splash": { ... },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.yourname.gylr",
      "buildNumber": "1",
      "infoPlist": {
        "NSCalendarsUsageDescription": "GYLR needs calendar access to categorize your events and show time allocation."
      }
    },
    "android": {
      "adaptiveIcon": { ... },
      "package": "com.yourname.gylr",
      "versionCode": 1,
      "permissions": ["android.permission.INTERNET"]
    },
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

---

### Task 9: Write App Store Metadata

**App Name:** Get Your Life Right (GYLR)

**Subtitle (iOS):** AI-Powered Life Balance Roasts

**Short Description (Android):**
Track your time. Get roasted by AI. Fix your life (maybe).

**Full Description:**
```
Ever wonder where all your time goes? GYLR connects to your Google Calendar and shows you exactly how you're spending your life - then judges you for it.

FEATURES:
• Sync with Google Calendar automatically
• Categorize events: Work, Play, Health, Romance, Study
• Beautiful pie chart showing your time allocation
• AI-generated comedic roasts about your life choices
• Choose your judge: Sarcastic Friend, Cruel Comedian, or Disappointed Parent
• Pixel art retro aesthetic

HOW IT WORKS:
1. Connect your Google Calendar
2. Categorize your events (we'll learn your preferences)
3. View your time breakdown by day, week, month, or year
4. Tap "Get Roasted" for AI-powered judgment

Built with love and sarcasm. Your data stays on your device.
Roasts powered by Claude AI.
```

**Keywords (iOS):**
time tracking, calendar, productivity, humor, AI, life balance, schedule, pixel art

**Category:**
- iOS: Productivity
- Android: Productivity

---

### Task 10: Set Up EAS Build

Configure Expo Application Services for building.

**Install EAS CLI:**
```bash
npm install -g eas-cli
eas login
eas build:configure
```

**Create `eas.json`:**
```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

**Build Commands:**
```bash
# Development build
eas build --profile development --platform ios
eas build --profile development --platform android

# Production build
eas build --profile production --platform all
```

---

### Task 11: Privacy Policy & Terms

Create basic legal documents (required for app stores).

**Privacy Policy must include:**
- What data is collected (calendar events, email)
- How data is used (local categorization, AI roasts)
- Data storage (local only, not uploaded except to Claude)
- Third-party services (Google, Anthropic)
- Contact information

**Create:**
- `docs/privacy-policy.md`
- Host on GitHub Pages or similar
- Link in app Settings and store listing

---

### Task 12: Create Store Screenshots

Design screenshots for both app stores.

**Required:**
- iOS: 6.5" (iPhone 14 Pro Max), 5.5" (iPhone 8 Plus)
- Android: Phone and 7" tablet

**Screenshot Concepts:**
1. Calendar view with categorized events
2. Life Panel with pie chart
3. Judgment card with roast
4. Personality picker in settings
5. Category selection modal

**Tips:**
- Use device frames
- Add captions highlighting features
- Consistent pixel art styling
- Show real-looking data (not lorem ipsum)

---

## File Structure Additions

```
GYLR2/
├── assets/
│   ├── icon.png              # App icon (1024x1024)
│   ├── icon-ios.png          # iOS specific icon
│   ├── adaptive-icon.png     # Android foreground
│   ├── splash.png            # Splash screen
│   └── onboarding/           # Onboarding illustrations
├── docs/
│   ├── privacy-policy.md
│   └── terms-of-service.md
├── eas.json                  # EAS Build config
└── src/
    ├── screens/
    │   └── OnboardingScreen.tsx
    ├── components/
    │   ├── ErrorBanner.tsx
    │   ├── OfflineBanner.tsx
    │   └── SkeletonLoader.tsx
    └── utils/
        └── haptics.ts
```

---

## Testing Checklist

### Functionality
- [ ] Onboarding shows only on first launch
- [ ] Haptic feedback works on supported devices
- [ ] Empty states display correctly
- [ ] Error banners appear and dismiss
- [ ] Offline state is detected and shown

### App Store
- [ ] App icon displays correctly
- [ ] Splash screen shows and transitions smoothly
- [ ] App builds successfully for iOS
- [ ] App builds successfully for Android
- [ ] No console errors in production build

### User Experience
- [ ] All text is readable
- [ ] Touch targets are minimum 44pt
- [ ] Dark mode looks consistent
- [ ] No layout issues on different screen sizes

---

## Pre-Submission Checklist

### Apple App Store
- [ ] Apple Developer account ($99/year)
- [ ] App Store Connect listing created
- [ ] Screenshots uploaded
- [ ] Privacy policy URL added
- [ ] Build uploaded via EAS Submit
- [ ] App Review information filled out

### Google Play Store
- [ ] Google Play Developer account ($25 one-time)
- [ ] Play Console listing created
- [ ] Screenshots and feature graphic uploaded
- [ ] Privacy policy URL added
- [ ] Content rating questionnaire completed
- [ ] AAB uploaded via EAS Submit

---

## Success Criteria

1. First-time users see onboarding flow
2. Haptic feedback enhances interactions
3. Empty and error states are user-friendly
4. App icon and splash screen match brand
5. App builds successfully for both platforms
6. Store listings are complete and compelling
7. Privacy policy is accessible
8. App ready for TestFlight/Internal Testing
