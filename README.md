# Get Your Life Right (GYLR)

A React Native mobile app that connects to your Google Calendar, categorizes your events, and delivers AI-powered comedic judgments about how you spend your time.

<!-- Screenshots will go here -->
<!-- ![App Screenshots](./public/screenshots-banner.png) -->

## Features

- **Google Calendar Sync** - Connect your Google account and automatically import your calendar events
- **Smart Categorization** - Organize events into 5 life categories: Work, Play, Health, Romance, Study
- **Time Visualization** - Beautiful donut chart showing your time allocation
- **AI-Powered Roasts** - Get witty, personalized commentary about your life choices from Claude AI
- **Multiple Personalities** - Choose your judge: Sarcastic Friend, Cruel Comedian, or Disappointed Parent
- **Pixel Art Style** - Retro Game Dev Story-inspired visual design
- **Flexible Time Periods** - View your stats by day, week, month, or year

## Screenshots

<!-- Add your screenshots here -->
<!--
| Calendar | Life Panel | Settings |
|----------|------------|----------|
| ![Calendar](./public/screenshot-calendar.png) | ![Life Panel](./public/screenshot-life.png) | ![Settings](./public/screenshot-settings.png) |
-->

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- iOS Simulator (Mac) or Android Emulator
- Google Cloud Console project with Calendar API enabled
- Anthropic API key for Claude

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gylr.git
   cd gylr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your credentials (see setup sections below for how to obtain these):
   ```
   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_web_client_id
   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_SECRET=your_web_client_secret
   EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your_ios_client_id
   EXPO_PUBLIC_ANTHROPIC_API_KEY=your_claude_api_key
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

### Setting Up Google OAuth

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the **Google Calendar API** (APIs & Services > Library)

2. **Configure OAuth Consent Screen**
   - Go to APIs & Services > OAuth consent screen
   - Choose "External" user type
   - Fill in app name, support email, and developer email
   - Add scopes: `email`, `profile`, `openid`, and Google Calendar scopes
   - Add your email as a test user (required while app is in testing mode)

3. **Create OAuth Credentials**

   **For Web (required for web testing):**
   - Go to Credentials > Create Credentials > OAuth client ID
   - Application type: **Web application**
   - Add authorized redirect URI: `http://localhost:8081/oauth`
   - Copy the **Client ID** and **Client Secret** to your `.env`

   **For iOS (required for iOS builds):**
   - Go to Credentials > Create Credentials > OAuth client ID
   - Application type: **iOS**
   - Bundle ID: `com.gylr.app`
   - Copy the **Client ID** to your `.env`

### Setting Up Claude API

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an API key
3. Add it to your `.env` file as `EXPO_PUBLIC_ANTHROPIC_API_KEY`

### Running the App

**For Web (quickest for testing):**
```bash
npx expo start --web
```

**For iOS Simulator (requires development build):**

Due to OAuth requirements, you need a development build for iOS:
```bash
# Install EAS CLI
npm install -g eas-cli
eas login

# Build development client for iOS simulator
eas build --profile development --platform ios

# Download and install the build, then run:
npx expo start --dev-client
```

**For Android:**
```bash
npx expo start --android
```

## How to Use

### 1. Sign In
Launch the app and sign in with your Google account. Grant calendar access when prompted.

### 2. View Your Calendar
The Calendar tab shows all your events. Events are color-coded by category once categorized.

### 3. Categorize Events
Tap any event to assign it to a category:
- **Work** - Career, meetings, deadlines
- **Play** - Entertainment, hobbies, social
- **Health** - Exercise, medical, self-care
- **Romance** - Dates, partner time
- **Study** - Learning, courses, reading

The app learns your preferences and will suggest categories for similar events.

### 4. View Your Life Panel
Switch to the Life tab to see:
- A donut chart of your time allocation
- Breakdown by category with percentages
- Summary statistics

### 5. Get Roasted
Tap "Get Roasted" to receive an AI-generated comedic judgment about how you spend your time. Choose your judge personality in Settings for different roast styles.

### 6. Customize Settings
In the Settings tab you can:
- Change your judge personality
- Clear category mappings
- Clear judgment cache
- Sign out

## Project Structure

```
GYLR2/
├── App.tsx                 # App entry point
├── app.json                # Expo static configuration
├── app.config.js           # Expo dynamic configuration
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── PixelButton.tsx
│   │   ├── PixelCard.tsx
│   │   ├── CategoryBadge.tsx
│   │   ├── CategoryPicker.tsx
│   │   ├── TimeAllocationChart.tsx
│   │   ├── JudgmentCard.tsx
│   │   └── ...
│   ├── screens/            # App screens
│   │   ├── AuthScreen.tsx
│   │   ├── CalendarScreen.tsx
│   │   ├── LifeScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── OnboardingScreen.tsx
│   ├── navigation/         # Navigation configuration
│   ├── store/              # Redux state management
│   │   ├── eventsSlice.ts
│   │   ├── categoriesSlice.ts
│   │   ├── settingsSlice.ts
│   │   └── judgmentSlice.ts
│   ├── services/           # API and external services
│   │   ├── googleAuth.ts
│   │   ├── googleCalendar.ts
│   │   ├── categorization.ts
│   │   └── claude.ts
│   ├── hooks/              # Custom React hooks
│   ├── config/             # App configuration
│   ├── constants/          # Colors, fonts, prompts
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── assets/                 # Images, fonts, icons
└── docs/                   # Documentation
    └── privacy-policy.md
```

## Tech Stack

- **Framework**: React Native with Expo (SDK 54)
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation (Bottom Tabs)
- **Storage**: AsyncStorage
- **Charts**: react-native-svg (custom donut chart)
- **Authentication**: expo-auth-session (Google OAuth)
- **AI**: Anthropic Claude API (claude-3-haiku)
- **Haptics**: expo-haptics

## Building for Production

### Install EAS CLI
```bash
npm install -g eas-cli
eas login
```

### Build for iOS
```bash
# Development build (simulator)
eas build --profile development --platform ios

# Production build
eas build --profile production --platform ios
```

### Build for Android
```bash
# Development build
eas build --profile development --platform android

# Production build (AAB for Play Store)
eas build --profile production --platform android
```

### Submit to App Stores
```bash
# Submit to App Store
eas submit --platform ios

# Submit to Google Play
eas submit --platform android
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | Google OAuth Web Client ID | Yes |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_SECRET` | Google OAuth Web Client Secret | Yes (for web) |
| `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` | Google OAuth iOS Client ID | Yes (for iOS) |
| `EXPO_PUBLIC_ANTHROPIC_API_KEY` | Anthropic Claude API Key | Yes |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Privacy

GYLR respects your privacy:
- All calendar data is processed locally on your device
- Only aggregated time percentages are sent to Claude AI for roasts
- No personal event details are stored on external servers
- See our full [Privacy Policy](./docs/privacy-policy.md)

## Troubleshooting

### OAuth Error 400: redirect_uri_mismatch
Make sure the redirect URI in your Google Console matches exactly:
- Web: `http://localhost:8081/oauth`
- iOS: Uses reversed client ID scheme (handled automatically)

### OAuth Error 403: access_denied
Add your email as a test user in Google Console > OAuth consent screen > Test users

### CORS errors on web
The Claude API doesn't support browser requests directly. AI roasts work on iOS/Android builds but not on web.

### Build fails with expo-dev-client error
Run `npx expo install expo-dev-client` before building.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Visual style inspired by [Game Dev Story](https://kairosoft.net/)
- AI roasts powered by [Claude](https://www.anthropic.com/claude) by Anthropic
- Built with [Expo](https://expo.dev/) and [React Native](https://reactnative.dev/)

---

**Disclaimer**: The AI-generated roasts are meant for entertainment purposes only. Please don't take them as actual life advice!
