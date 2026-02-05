# Get Your Life Right (GYLR) - Implementation Plan

## Project Overview

**App Name**: Get Your Life Right (GYLR)
**Platform**: React Native (iOS & Android)
**Language**: TypeScript
**Art Style**: Pixel art (Game Dev Story inspired)
**Architecture**: Client-only with local storage

A mobile app that connects to your Google Calendar, categorizes your events, and delivers AI-generated comedic judgments about how you spend your time.

---

## Core Features

### 1. Google Calendar Integration
- OAuth 2.0 authentication for Google Calendar API
- Read access to fetch user's calendar events
- Write access to create/edit calendar events
- Support for single Google account (multi-account as future enhancement)

### 2. Event Categorization System
**Categories:**
- **Work** - Career, meetings, deadlines
- **Play** - Entertainment, hobbies, social
- **Health** - Exercise, medical, self-care
- **Romance** - Dates, partner time
- **Study** - Learning, courses, reading

**Auto-Categorization Rules:**
- Keyword matching for smart defaults (e.g., "Gym" → Health, "Meeting" → Work)
- User confirmation/override on first categorization
- Persist choices to apply to similar future events
- Store categorizations in local storage (AsyncStorage)

### 3. Tab Navigation (2 Tabs)

#### Tab 1: Calendar
- Display synced Google Calendar events
- Color-coded by category
- Tap event to re-categorize
- Add new event button (writes to Google Calendar)
- Uncategorized events highlighted for action

#### Tab 2: Life Panel
- **Pie Chart**: Visual breakdown of time allocation by category
- **Time Period Selector**: Day / Week / Month / Year
- **Judgment Zone**: AI-generated comedic roast based on your time distribution
- **Refresh Button**: Get a new roast for the same data

### 4. AI-Powered Comedic Judgments
- **LLM Provider**: Claude API (Anthropic)
- **Default Personality**: Sarcastic Friend
- **Future Personalities** (TODO): Cruel Comedian, Disappointed Parent, Wholesome Coach, etc.
- **Context Sent to API**: Category percentages, time period, event counts
- **Response**: 2-3 sentences of witty commentary on user's life balance

---

## Technical Architecture

### Tech Stack
```
├── React Native (Expo or bare workflow)
├── TypeScript
├── React Navigation (Tab Navigator)
├── AsyncStorage (local persistence)
├── @react-native-google-signin/google-signin
├── Google Calendar API
├── Anthropic Claude API
├── react-native-chart-kit or victory-native (pie chart)
├── Redux Toolkit (state management)
```

### Project Structure
```
GYLR2/
├── app/
│   ├── (tabs)/
│   │   ├── calendar.tsx          # Calendar tab screen
│   │   └── life.tsx              # Life panel tab screen
│   ├── _layout.tsx               # Root layout with tab navigator
│   └── index.tsx                 # Entry point / Auth gate
├── components/
│   ├── CalendarView.tsx          # Calendar display component
│   ├── EventCard.tsx             # Individual event display
│   ├── CategoryPicker.tsx        # Category selection modal
│   ├── PieChart.tsx              # Time allocation chart
│   ├── JudgmentCard.tsx          # Displays the AI roast
│   ├── TimePeriodSelector.tsx    # Day/Week/Month/Year toggle
│   └── PixelButton.tsx           # Styled button component
├── services/
│   ├── googleCalendar.ts         # Google Calendar API wrapper
│   ├── claude.ts                 # Claude API integration
│   └── categorization.ts         # Auto-categorization logic
├── store/
│   ├── index.ts                  # Redux store setup
│   ├── eventsSlice.ts            # Events state management
│   ├── categoriesSlice.ts        # Category mappings state
│   └── settingsSlice.ts          # App settings state
├── utils/
│   ├── keywords.ts               # Keyword → Category mappings
│   ├── timeCalculations.ts       # Duration/percentage math
│   └── storage.ts                # AsyncStorage helpers
├── types/
│   ├── events.ts                 # Event type definitions
│   └── categories.ts             # Category enums/types
├── assets/
│   ├── fonts/                    # Pixel art fonts
│   ├── icons/                    # Category icons (pixel art)
│   └── sprites/                  # Character sprites for judge
├── constants/
│   ├── colors.ts                 # Pixel art color palette
│   └── prompts.ts                # Claude prompt templates
└── config/
    └── google.ts                 # Google OAuth config
```

---

## Implementation Phases

### Phase 1: Project Setup & Navigation
- [ ] Initialize React Native project with TypeScript
- [ ] Configure Expo or bare workflow
- [ ] Set up React Navigation with 2-tab bottom navigator
- [ ] Create basic screen shells for Calendar and Life tabs
- [ ] Establish project folder structure
- [ ] Configure ESLint and Prettier
- [ ] Set up Redux Toolkit store

### Phase 2: Google Calendar Integration
- [ ] Configure Google Cloud project with Calendar API
- [ ] Implement Google Sign-In with @react-native-google-signin
- [ ] Create googleCalendar.ts service with:
  - [ ] `fetchEvents(startDate, endDate)` - Get events
  - [ ] `createEvent(eventData)` - Add new event
  - [ ] `updateEvent(eventId, eventData)` - Modify event
- [ ] Build auth flow screen (login gate)
- [ ] Store refresh token securely

### Phase 3: Event Categorization System
- [ ] Define Category enum: WORK, PLAY, HEALTH, ROMANCE, STUDY
- [ ] Create keyword mapping dictionary for auto-categorization
- [ ] Build CategoryPicker modal component
- [ ] Implement categorization logic:
  - [ ] Check if event already categorized (stored)
  - [ ] If not, suggest category based on keywords
  - [ ] Prompt user to confirm/change
  - [ ] Persist to AsyncStorage
- [ ] Create eventsSlice for Redux state
- [ ] Build storage utility for category persistence

### Phase 4: Calendar Tab UI
- [ ] Create CalendarView component (agenda or month view)
- [ ] Build EventCard component with:
  - [ ] Event title and time
  - [ ] Category color indicator
  - [ ] Tap handler for re-categorization
- [ ] Add "New Event" FAB button
- [ ] Create event creation form
- [ ] Implement uncategorized event highlighting
- [ ] Add pull-to-refresh for syncing

### Phase 5: Life Panel - Pie Chart
- [ ] Install chart library (react-native-chart-kit or victory-native)
- [ ] Create PieChart component
- [ ] Build TimePeriodSelector (Day/Week/Month/Year buttons)
- [ ] Implement time calculation utilities:
  - [ ] Calculate total hours per category
  - [ ] Convert to percentages
  - [ ] Filter by selected time period
- [ ] Style pie chart with pixel art color palette
- [ ] Add legend with category icons

### Phase 6: Claude API Integration
- [ ] Set up Anthropic SDK or REST API calls
- [ ] Create claude.ts service
- [ ] Design prompt template for roasts:
  ```
  You are a sarcastic friend judging someone's life balance.
  Here's how they spent their time this [period]:
  - Work: X%
  - Play: Y%
  - Health: Z%
  - Romance: A%
  - Study: B%

  Give them 2-3 sentences of witty, sarcastic commentary.
  Be funny but not mean-spirited.
  ```
- [ ] Implement API call with error handling
- [ ] Add loading state during generation
- [ ] Cache recent roasts to reduce API calls

### Phase 7: Life Panel - Judgment Display
- [ ] Build JudgmentCard component
- [ ] Add pixel art character sprite for "judge"
- [ ] Implement "Get Roasted" button
- [ ] Display loading animation during API call
- [ ] Show generated roast with typing animation
- [ ] Add "Roast Me Again" refresh button
- [ ] Store personality selection for future multi-judge feature

### Phase 8: Pixel Art Styling
- [ ] Define color palette (Game Dev Story inspired)
  - Primary: Warm retro colors
  - Categories: Distinct, vibrant colors
- [ ] Create/source pixel art assets:
  - [ ] Category icons (5 icons)
  - [ ] Judge character sprite
  - [ ] UI elements (buttons, borders, backgrounds)
- [ ] Implement PixelButton component
- [ ] Add pixel font (Press Start 2P or similar)
- [ ] Style all screens with retro aesthetic
- [ ] Create pixel art loading animations

### Phase 9: Polish & UX
- [ ] Implement onboarding flow
- [ ] Add haptic feedback on interactions
- [ ] Create empty states (no events, no data)
- [ ] Error handling UI (API failures, auth issues)
- [ ] Implement "Remember Me" for categorizations
- [ ] Add settings screen (clear data, sign out)

### Phase 10: App Store Preparation
- [ ] Create app icons (pixel art style)
- [ ] Design splash screen
- [ ] Write App Store description
- [ ] Create screenshots for both stores
- [ ] Configure app.json / app.config.js for builds
- [ ] Set up EAS Build (if using Expo)
- [ ] Handle iOS/Android specific permissions
- [ ] Test on physical devices
- [ ] Submit to TestFlight and Google Play Beta

---

## API Contracts

### Google Calendar Event (Simplified)
```typescript
interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  isAllDay: boolean;
}
```

### Categorized Event
```typescript
interface CategorizedEvent extends CalendarEvent {
  category: Category;
  categoryConfirmed: boolean;
}

enum Category {
  WORK = 'work',
  PLAY = 'play',
  HEALTH = 'health',
  ROMANCE = 'romance',
  STUDY = 'study',
  UNCATEGORIZED = 'uncategorized',
}
```

### Time Allocation
```typescript
interface TimeAllocation {
  category: Category;
  totalMinutes: number;
  percentage: number;
  eventCount: number;
}
```

### Judgment Request
```typescript
interface JudgmentRequest {
  allocations: TimeAllocation[];
  timePeriod: 'day' | 'week' | 'month' | 'year';
  personality: 'sarcastic_friend'; // Expandable later
}
```

---

## Auto-Categorization Keywords

```typescript
const categoryKeywords: Record<Category, string[]> = {
  work: [
    'meeting', 'standup', 'sync', 'review', 'interview',
    'deadline', 'presentation', 'client', 'call', '1:1',
    'sprint', 'retro', 'planning', 'workshop', 'conference'
  ],
  play: [
    'party', 'game', 'movie', 'dinner', 'drinks', 'concert',
    'hangout', 'netflix', 'birthday', 'bbq', 'festival',
    'vacation', 'trip', 'bar', 'club', 'brunch'
  ],
  health: [
    'gym', 'workout', 'yoga', 'run', 'doctor', 'dentist',
    'therapy', 'meditation', 'physio', 'swim', 'hike',
    'cycling', 'fitness', 'checkup', 'massage'
  ],
  romance: [
    'date', 'anniversary', 'valentines', 'dinner with',
    'partner', 'boyfriend', 'girlfriend', 'spouse', 'bae'
  ],
  study: [
    'class', 'course', 'lecture', 'study', 'exam', 'test',
    'tutorial', 'homework', 'reading', 'learning', 'lesson',
    'workshop', 'bootcamp', 'training', 'certification'
  ],
};
```

---

## Sample Claude Prompts

### Sarcastic Friend
```
You are a sarcastic friend who loves to playfully roast your buddy about their life choices. You're like that friend who's supportive but can't help making jokes.

Your friend spent their [TIME_PERIOD] like this:
- Work: [X]%
- Play: [Y]%
- Health: [Z]%
- Romance: [A]%
- Study: [B]%

Give them 2-3 sentences of witty, sarcastic commentary about this distribution. Be funny and playful, not cruel. Reference specific percentages when it's funnier. If something is at 0%, definitely mention it.
```

### Future Personalities (TODO)
- **Cruel Comedian**: Brutal honesty, no filter
- **Disappointed Parent**: Guilt-trippy, "I'm not mad, just disappointed"
- **Wholesome Coach**: Encouraging but still teasing
- **Existential Philosopher**: Absurdist commentary on time

---

## Color Palette (Game Dev Story Inspired)

```typescript
const colors = {
  // Background
  bgPrimary: '#2C2137',      // Deep purple-gray
  bgSecondary: '#3D2944',    // Lighter purple-gray

  // Categories
  work: '#E85D75',           // Coral red
  play: '#50C878',           // Emerald green
  health: '#4ECDC4',         // Teal
  romance: '#FF6B9D',        // Pink
  study: '#9B59B6',          // Purple

  // UI
  textPrimary: '#FFFEF2',    // Cream white
  textSecondary: '#C9B8A8',  // Tan
  accent: '#FFD93D',         // Gold yellow
  border: '#5D4954',         // Muted purple

  // States
  success: '#7FCD91',        // Soft green
  error: '#E85D75',          // Coral red
  warning: '#FFB347',        // Orange
};
```

---

## Environment Variables

```
GOOGLE_WEB_CLIENT_ID=<from Google Cloud Console>
GOOGLE_IOS_CLIENT_ID=<from Google Cloud Console>
GOOGLE_ANDROID_CLIENT_ID=<from Google Cloud Console>
ANTHROPIC_API_KEY=<Claude API key>
```

---

## Future Enhancements (TODO)

- [ ] Multiple judge personalities (selectable character)
- [ ] Weekly/monthly roast digest notifications
- [ ] Share your roast to social media
- [ ] Achievements/badges for balanced weeks
- [ ] Multi-account Google Calendar support
- [ ] Widget for home screen (today's stats)
- [ ] Apple Watch / WearOS companion
- [ ] Streak tracking ("5 days with exercise!")
- [ ] Category goals setting
- [ ] Historical trends view

---

## Session Recovery Instructions

If starting a new session, use this prompt:

> I'm building "Get Your Life Right" (GYLR), a React Native + TypeScript mobile app that:
> 1. Connects to Google Calendar via OAuth
> 2. Lets users categorize events as: work, play, health, romance, or study
> 3. Has 2 tabs: Calendar view and Life panel
> 4. Life panel shows a pie chart of time allocation (selectable: day/week/month/year)
> 5. Uses Claude API to generate sarcastic roasts about the user's time distribution
> 6. Uses pixel art style inspired by Game Dev Story
> 7. Client-only architecture with local storage
>
> Please read `requests/PROMPTS1.md` for the full implementation plan and continue from where we left off.

---

## Commands Reference

```bash
# Start development
npx expo start

# Run on iOS
npx expo run:ios

# Run on Android
npx expo run:android

# Build for production (EAS)
eas build --platform ios
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

---

*Document Version: 1.0*
*Created: February 2026*
*App: Get Your Life Right (GYLR)*
