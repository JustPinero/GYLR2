# Phase 4: Calendar Tab UI Enhancement

## Overview

This phase enhances the Calendar tab with a polished agenda view, time period selector, and the ability to create new events. We'll add visual improvements with pixel art styling and better organization of events by date.

---

## Goals

1. **Agenda View** - Group events by date with section headers
2. **Time Period Selector** - Switch between day/week/month/year views
3. **Add Event Flow** - FAB button + creation form + Google Calendar sync
4. **Visual Polish** - Pixel art styling, animations, empty states
5. **Sign Out Option** - Allow users to disconnect their account

---

## Dependencies

No new dependencies required. Uses existing:
- React Native built-in components
- Redux Toolkit
- Google Calendar API (already integrated)

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/TimePeriodSelector.tsx` | Day/Week/Month/Year toggle buttons |
| `src/components/DateSectionHeader.tsx` | Section header for grouped events |
| `src/components/AddEventModal.tsx` | Modal form for creating new events |
| `src/components/FloatingActionButton.tsx` | FAB component for add action |
| `src/components/EventForm.tsx` | Form fields for event creation |
| `src/screens/SettingsScreen.tsx` | Settings with sign out option |

## Files to Modify

| File | Changes |
|------|---------|
| `src/screens/CalendarScreen.tsx` | Add time selector, grouped list, FAB |
| `src/store/eventsSlice.ts` | Add createEvent async thunk |
| `src/navigation/TabNavigator.tsx` | Add settings button to header |
| `src/constants/colors.ts` | Add any missing colors |

---

## Implementation Steps

### Step 1: Time Period Selector Component

**File: `src/components/TimePeriodSelector.tsx`**

A row of toggle buttons for selecting the time period.

```
┌─────┬──────┬───────┬──────┐
│ Day │ Week │ Month │ Year │
└─────┴──────┴───────┴──────┘
```

Props:
```typescript
interface TimePeriodSelectorProps {
  selected: TimePeriod;
  onSelect: (period: TimePeriod) => void;
}
```

Behavior:
- Highlight selected period with accent color
- Trigger events refresh when period changes
- Pixel art button styling

### Step 2: Date Section Header

**File: `src/components/DateSectionHeader.tsx`**

Header showing date for grouped events.

```
┌─────────────────────────────┐
│ 📅 Monday, January 15      │
└─────────────────────────────┘
```

Props:
```typescript
interface DateSectionHeaderProps {
  date: Date;
  eventCount: number;
  isToday?: boolean;
}
```

### Step 3: Floating Action Button

**File: `src/components/FloatingActionButton.tsx`**

A pixel art styled FAB for adding new events.

Props:
```typescript
interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: string;
  label?: string;
}
```

Positioning:
- Bottom right corner
- Above tab bar
- Pixel art shadow effect

### Step 4: Add Event Modal

**File: `src/components/AddEventModal.tsx`**

Modal containing the event creation form.

UI Layout:
```
┌─────────────────────────────────┐
│         Add New Event           │
│─────────────────────────────────│
│  Title: [________________]      │
│                                 │
│  Date:  [  Jan 15, 2024  ]     │
│  Start: [    10:00 AM    ]     │
│  End:   [    11:00 AM    ]     │
│                                 │
│  ☐ All day event                │
│                                 │
│  Category: [  Select...  ]      │
│                                 │
│  Description (optional):        │
│  [________________________]     │
│  [________________________]     │
│                                 │
│  [ Cancel ]    [ Add Event ]    │
└─────────────────────────────────┘
```

### Step 5: Event Form Component

**File: `src/components/EventForm.tsx`**

Reusable form fields for event data.

Fields:
- Title (required, text input)
- Date (date picker)
- Start time (time picker)
- End time (time picker)
- All day toggle
- Category selector
- Description (optional, multiline)

Validation:
- Title is required
- End time must be after start time
- Category must be selected (not uncategorized)

### Step 6: Update Calendar Screen

**File: `src/screens/CalendarScreen.tsx`**

Changes:
1. Add TimePeriodSelector below header
2. Group events by date using SectionList
3. Add FloatingActionButton
4. Show AddEventModal on FAB press
5. Handle event creation

Data transformation:
```typescript
// Transform flat event list to sections
interface EventSection {
  date: string;  // "2024-01-15"
  data: CategorizedEvent[];
}
```

### Step 7: Create Event Async Thunk

**File: `src/store/eventsSlice.ts`**

Add thunk for creating events via Google Calendar API:

```typescript
export const createCalendarEvent = createAsyncThunk<
  CategorizedEvent,
  { accessToken: string; eventData: CreateEventPayload; category: Category },
  { rejectValue: string }
>(...);
```

### Step 8: Settings Screen

**File: `src/screens/SettingsScreen.tsx`**

Basic settings screen with:
- User email display
- Sign out button
- App version
- Clear category mappings option

Add to tab navigator or as modal from header button.

---

## UI Specifications

### Time Period Selector

| State | Background | Text | Border |
|-------|------------|------|--------|
| Selected | accent (gold) | dark | darker gold |
| Unselected | bgSecondary | textMuted | border |

### Floating Action Button

```
Size: 56x56
Icon: + (plus)
Colors:
  - Background: accent (gold)
  - Icon: bgPrimary (dark)
  - Border: darker gold
  - Shadow: 4px offset, 30% opacity
```

### Event Sections

```
┌─────────────────────────────────┐
│ 📅 Today - Monday, Jan 15      │  ← DateSectionHeader
├─────────────────────────────────┤
│ ┌───┐ Team Standup             │
│ │💼│ 9:00 AM - 9:30 AM         │  ← EventCard
│ └───┘ 30m                       │
├─────────────────────────────────┤
│ ┌───┐ Gym Session              │
│ │💪│ 12:00 PM - 1:00 PM        │  ← EventCard
│ └───┘ 1h                        │
└─────────────────────────────────┘
```

---

## Data Flow

### Creating an Event

```
1. User taps FAB
   ↓
2. AddEventModal opens
   ↓
3. User fills form and selects category
   ↓
4. User taps "Add Event"
   ↓
5. Validate form
   ↓
6. dispatch(createCalendarEvent({ accessToken, eventData, category }))
   ↓
7. POST to Google Calendar API
   ↓
8. Add new event to Redux state with category
   ↓
9. If "remember" checked, save category mapping
   ↓
10. Close modal, show success toast
```

### Changing Time Period

```
1. User taps different period (e.g., "Month")
   ↓
2. dispatch(setTimePeriod('month'))
   ↓
3. useEffect triggers fetchCalendarEvents with new period
   ↓
4. UI updates with events from new date range
```

---

## Type Definitions

### Event Section (for SectionList)

```typescript
interface EventSection {
  date: string;        // "2024-01-15" (for key)
  displayDate: Date;   // For formatting
  isToday: boolean;
  data: CategorizedEvent[];
}
```

### Event Form Data

```typescript
interface EventFormData {
  title: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  isAllDay: boolean;
  category: Category;
  description?: string;
}
```

---

## Grouping Events by Date

```typescript
function groupEventsByDate(events: CategorizedEvent[]): EventSection[] {
  const groups = new Map<string, CategorizedEvent[]>();

  events.forEach(event => {
    const dateKey = event.startTime.toISOString().split('T')[0];
    const existing = groups.get(dateKey) ?? [];
    groups.set(dateKey, [...existing, event]);
  });

  return Array.from(groups.entries())
    .map(([dateKey, data]) => ({
      date: dateKey,
      displayDate: new Date(dateKey),
      isToday: isToday(new Date(dateKey)),
      data: data.sort((a, b) => a.startTime.getTime() - b.startTime.getTime()),
    }))
    .sort((a, b) => a.displayDate.getTime() - b.displayDate.getTime());
}
```

---

## Validation Rules

### Event Form

| Field | Rule | Error Message |
|-------|------|---------------|
| Title | Required, min 1 char | "Title is required" |
| Date | Required | "Date is required" |
| Start Time | Required if not all-day | "Start time is required" |
| End Time | Must be after start | "End time must be after start" |
| Category | Not UNCATEGORIZED | "Please select a category" |

---

## Date/Time Pickers

For MVP, use simple text inputs or React Native's built-in components:

**Option A: Text inputs with format hints**
```
Date: [ MM/DD/YYYY ]
Time: [ HH:MM AM/PM ]
```

**Option B: Native pickers (recommended)**
- iOS: DateTimePicker from @react-native-community/datetimepicker
- Android: Same library, different UI

For now, we can use basic TextInputs with manual parsing, then upgrade to native pickers in a future phase.

---

## Accessibility

- FAB has accessible label "Add new event"
- Time period buttons have role="radio" equivalent
- Form fields have proper labels
- Error messages announced to screen readers

---

## Animation Ideas

- FAB scales on press
- Modal slides up from bottom
- Section headers sticky on scroll
- Events fade in when loaded

---

## Validation Strategies

### Unit Tests

| Test | Description |
|------|-------------|
| `groupEventsByDate.test.ts` | Test event grouping logic |
| `EventForm.test.tsx` | Test form validation |
| `TimePeriodSelector.test.tsx` | Test period selection |

### Manual Testing Checklist

- [ ] **Time Period Selector**
  - [ ] Day shows only today's events
  - [ ] Week shows current week
  - [ ] Month shows current month
  - [ ] Year shows current year
  - [ ] Switching periods refetches events
  - [ ] Selected state is visually clear

- [ ] **Event Grouping**
  - [ ] Events grouped by date
  - [ ] "Today" label shows for current date
  - [ ] Events sorted by time within each day
  - [ ] Empty dates not shown

- [ ] **Add Event Flow**
  - [ ] FAB visible and tappable
  - [ ] Modal opens on FAB press
  - [ ] All form fields work
  - [ ] Validation prevents invalid submission
  - [ ] Event appears after creation
  - [ ] Google Calendar synced
  - [ ] Category applied correctly

- [ ] **Sign Out**
  - [ ] Sign out clears auth state
  - [ ] Returns to login screen
  - [ ] Events cleared from state

---

## Error Handling

| Scenario | Handling |
|----------|----------|
| Event creation fails | Show error toast, keep modal open |
| Network error | Show retry option |
| Invalid form data | Highlight fields, show messages |
| Google API error | Parse error, show user-friendly message |

---

## Success Criteria

Phase 4 is complete when:

1. ✅ Time period selector works (day/week/month/year)
2. ✅ Events grouped by date with section headers
3. ✅ FAB visible and opens add event modal
4. ✅ Event creation form validates input
5. ✅ New events sync to Google Calendar
6. ✅ New events appear in list with correct category
7. ✅ Sign out functionality works
8. ✅ All visual elements have pixel art styling
9. ✅ TypeScript compiles without errors

---

## Session Recovery Prompt

If starting a new session, use this prompt:

> I'm continuing work on "Get Your Life Right" (GYLR). I completed:
> - Phase 1: Project setup
> - Phase 2: Google Calendar integration
> - Phase 3: Event categorization system
>
> Now working on Phase 4: Calendar Tab UI Enhancement.
>
> Please read:
> - `requests/PROMPTS1.md` for the full implementation plan
> - `requests/PROMPT4.md` for Phase 4 details
> - `CLAUDE.md` for project conventions
>
> Current status: [describe what's done/remaining]
>
> Continue from where we left off.

---

## Estimated Effort

- **New files**: 6
- **Modified files**: 4
- **Total changes**: 10 files

---

## Dependencies on Other Phases

- **Requires Phase 2**: Google Calendar API for event creation
- **Requires Phase 3**: Category picker for new events
- **Leads into Phase 5**: Life Panel with pie chart

---

*Document Version: 1.0*
*Phase: 4 of 10*
*Depends on: Phase 3 (Complete)*
