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
- Expo CLI (`npm install -g expo-cli`)
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

   Copy the example environment file and add your API keys:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your credentials:
   ```
   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_google_client_id
   EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your_ios_client_id
   EXPO_PUBLIC_ANTHROPIC_API_KEY=your_claude_api_key
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on your device**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app for physical device

### Setting Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google Calendar API**
4. Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client ID**
5. For Web application, add authorized redirect URI: `https://auth.expo.io/@your-username/gylr`
6. For iOS, create an iOS client ID with your bundle identifier
7. Copy the client IDs to your `.env` file

### Setting Up Claude API

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an API key
3. Add it to your `.env` file as `EXPO_PUBLIC_ANTHROPIC_API_KEY`

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
│   ├── constants/          # Colors, fonts, prompts
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── assets/                 # Images, fonts, icons
├── docs/                   # Documentation
│   └── privacy-policy.md
└── requests/               # Implementation plans
```

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation (Bottom Tabs)
- **Storage**: AsyncStorage
- **Charts**: react-native-svg (custom donut chart)
- **Authentication**: expo-auth-session (Google OAuth)
- **AI**: Anthropic Claude API

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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Visual style inspired by [Game Dev Story](https://kairosoft.net/)
- AI roasts powered by [Claude](https://www.anthropic.com/claude) by Anthropic
- Built with [Expo](https://expo.dev/) and [React Native](https://reactnative.dev/)

---

**Disclaimer**: The AI-generated roasts are meant for entertainment purposes only. Please don't take them as actual life advice!
