# CLAUDE.md - Get Your Life Right (GYLR)

## Project Overview

A React Native mobile app that connects to Google Calendar, categorizes events, and delivers AI-generated comedic judgments about how users spend their time. Pixel art aesthetic inspired by Game Dev Story.

## Tech Stack

- **Framework**: React Native with Expo (managed workflow)
- **Language**: TypeScript (strict mode)
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation (bottom tabs)
- **Storage**: AsyncStorage for local persistence
- **APIs**: Google Calendar API, Anthropic Claude API
- **Charts**: react-native-chart-kit or victory-native
- **Testing**: Jest + React Testing Library

## Code Style Rules

### TypeScript Standards
- **No `any` types** - Use `unknown` and type guards when type is truly unknown
- **Explicit return types** on all functions
- **Strict null checks** enabled - handle undefined/null explicitly
- **Interface over type** for object shapes (use `type` for unions/intersections)
- **Enums** for fixed sets of values (e.g., Categories)

### Component Patterns
- **Functional components only** - no class components
- **Custom hooks** for reusable logic (prefix with `use`)
- **Named exports** for components (not default exports)
- **Props interface** defined above component: `interface ComponentNameProps {}`
- **Destructure props** in function signature

```typescript
// Good
interface EventCardProps {
  event: CategorizedEvent;
  onCategoryChange: (category: Category) => void;
}

export function EventCard({ event, onCategoryChange }: EventCardProps): JSX.Element {
  // ...
}
```

### File Organization
- **One component per file** - file name matches component name (PascalCase)
- **Index files** only for barrel exports, no logic
- **Colocation** - keep styles, tests, and types near their component when specific to it
- **Shared types** go in `/types` directory

### Naming Conventions
- **Components**: PascalCase (`EventCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useCalendarEvents.ts`)
- **Utils/Services**: camelCase (`googleCalendar.ts`)
- **Constants**: SCREAMING_SNAKE_CASE for values, camelCase for objects
- **Types/Interfaces**: PascalCase (`CategorizedEvent`)
- **Enums**: PascalCase name, PascalCase or UPPER_CASE members

### Code Quality
- **Self-documenting code** - clear variable/function names over comments
- **Comments only for** complex business logic or non-obvious decisions
- **Early returns** over nested conditionals
- **Const by default** - use `let` only when reassignment needed
- **Avoid magic numbers** - use named constants
- **Error boundaries** for component trees that may fail

### Redux Patterns
- Use **Redux Toolkit** (createSlice, createAsyncThunk)
- **Slice per domain** (events, categories, settings)
- **Selectors** for derived state
- **No direct state mutation** outside of RTK slices

## Testing Requirements

- **Unit tests** for utilities and services
- **Component tests** for interactive components using RTL
- **Test file naming**: `ComponentName.test.tsx` or `utilName.test.ts`
- **Coverage target**: Aim for critical paths, not 100%
- **Mock external APIs** (Google Calendar, Claude)

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## Git Conventions

- **Branch naming**: `feature/description`, `fix/description`, `chore/description`
- **Commit messages**: Imperative mood, concise ("Add event categorization modal")
- **No secrets in commits** - use `.env` files (gitignored)

## Project Structure

```
GYLR2/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab screens
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
├── services/              # API integrations
├── store/                 # Redux slices and store
├── hooks/                 # Custom React hooks
├── utils/                 # Pure utility functions
├── types/                 # Shared TypeScript types
├── constants/             # App-wide constants
├── assets/                # Images, fonts, sprites
└── config/                # Configuration files
```

## Environment Setup

### Required Environment Variables
Create `.env` file in project root (never commit this):

```
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_web_client_id
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your_ios_client_id
EXPO_PUBLIC_ANTHROPIC_API_KEY=your_claude_api_key
```

### Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project named "GYLR" (or similar)
3. Enable the **Google Calendar API**:
   - Navigate to APIs & Services > Library
   - Search "Google Calendar API" and enable it
4. Configure OAuth Consent Screen:
   - Go to APIs & Services > OAuth consent screen
   - Select "External" user type
   - Fill in app name: "Get Your Life Right"
   - Add scopes: `https://www.googleapis.com/auth/calendar.readonly`, `https://www.googleapis.com/auth/calendar.events`
5. Create OAuth 2.0 Credentials:
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "OAuth client ID"
   - Create **Web application** client (for Expo)
   - Create **iOS** client (bundle ID: `com.yourname.gylr`)
   - Create **Android** client (package name + SHA-1 fingerprint)
6. Copy the client IDs to your `.env` file

### Anthropic API Setup

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an account or sign in
3. Navigate to API Keys
4. Create a new API key
5. Copy to your `.env` file as `EXPO_PUBLIC_ANTHROPIC_API_KEY`

**Note**: For production, API calls to Claude should go through a backend to protect your API key. For MVP, we'll call directly from the app.

## Commands

```bash
# Install dependencies
npm install

# Start Expo dev server
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android

# Run tests
npm test

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Build for production
eas build --platform ios
eas build --platform android
```

## Key Implementation Notes

### Categories
The five event categories are fixed:
- `WORK` - Career, meetings, deadlines
- `PLAY` - Entertainment, hobbies, social
- `HEALTH` - Exercise, medical, self-care
- `ROMANCE` - Dates, partner time
- `STUDY` - Learning, courses, reading

### Auto-Categorization
Events are auto-categorized by keyword matching on event title. Users confirm/override on first occurrence. Choices are persisted and applied to future similar events.

### AI Personality
Default: "Sarcastic Friend" - witty, playful jabs. Future feature will allow selecting different judge personalities.

### Pixel Art Style
- Use pixel art color palette defined in `constants/colors.ts`
- Pixel fonts (e.g., Press Start 2P)
- Sprite-based character for the "judge"
- Retro UI elements (buttons, borders)

## Common Patterns

### Async Operations
```typescript
// Use createAsyncThunk for API calls
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (params: FetchEventsParams, { rejectWithValue }) => {
    try {
      const events = await googleCalendarService.getEvents(params);
      return events;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
```

### Error Handling
```typescript
// Type-safe error extraction
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}
```

### Component with Loading/Error States
```typescript
export function EventList(): JSX.Element {
  const { events, loading, error } = useAppSelector(selectEventsState);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (events.length === 0) return <EmptyState />;

  return (
    <FlatList
      data={events}
      renderItem={({ item }) => <EventCard event={item} />}
      keyExtractor={(item) => item.id}
    />
  );
}
```
