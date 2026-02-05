# Phase 3: Event Categorization System

## Overview

This phase implements the interactive categorization system that allows users to confirm or change event categories. The app will remember user choices and apply them to similar future events, creating a personalized categorization experience.

---

## Goals

1. **Category Picker Modal** - UI for selecting/changing event categories
2. **Tap-to-Categorize** - Tap any event to open the category picker
3. **Persistence** - Save category mappings to AsyncStorage
4. **Learning System** - Remember user choices for similar events
5. **Batch Actions** - Handle uncategorized events efficiently

---

## Dependencies

No new dependencies required. Uses existing:
- `@react-native-async-storage/async-storage`
- Redux Toolkit (already configured)

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/CategoryPicker.tsx` | Modal for selecting event category |
| `src/components/CategoryBadge.tsx` | Styled badge showing category |
| `src/components/UncategorizedBanner.tsx` | Banner prompting user to categorize |
| `src/services/categorization.ts` | Categorization logic and persistence |
| `src/hooks/useCategorization.ts` | Hook for categorization operations |

## Files to Modify

| File | Changes |
|------|---------|
| `src/screens/CalendarScreen.tsx` | Add tap handler, show uncategorized banner |
| `src/store/categoriesSlice.ts` | Add async thunks for persistence |
| `src/store/eventsSlice.ts` | Update category change logic |
| `src/components/index.ts` | Export new components |

---

## Implementation Steps

### Step 1: Categorization Service

**File: `src/services/categorization.ts`**

Responsibilities:
- Load/save category mappings from AsyncStorage
- Apply learned mappings to new events
- Suggest categories based on keywords + user history

```typescript
// Key functions to implement:
loadCategoryMappings(): Promise<CategoryMapping[]>
saveCategoryMapping(pattern: string, category: Category): Promise<void>
removeCategoryMapping(pattern: string): Promise<void>
suggestCategory(eventTitle: string, mappings: CategoryMapping[]): Category
```

**Learning Algorithm:**
1. When user confirms/changes category, extract key phrase from event title
2. Store mapping: `{ pattern: "team standup", category: "work" }`
3. On future events, check if title contains any stored patterns
4. User-defined mappings take priority over keyword defaults

### Step 2: Category Picker Modal

**File: `src/components/CategoryPicker.tsx`**

UI Elements:
- Modal overlay with pixel art styling
- Event title at top
- 5 category buttons (Work, Play, Health, Romance, Study)
- Each button shows icon + label + color
- "Remember this choice" toggle
- Cancel button

Behavior:
- Opens when user taps an event
- Highlights current category
- On select: updates event, optionally saves mapping, closes modal
- Animates in/out smoothly

**Props:**
```typescript
interface CategoryPickerProps {
  visible: boolean;
  event: CategorizedEvent | null;
  onSelect: (category: Category, remember: boolean) => void;
  onClose: () => void;
}
```

### Step 3: Category Badge Component

**File: `src/components/CategoryBadge.tsx`**

A reusable badge showing category with:
- Category color background
- Category icon/emoji
- Category label
- Optional "unconfirmed" indicator (?)

**Props:**
```typescript
interface CategoryBadgeProps {
  category: Category;
  confirmed?: boolean;
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
}
```

### Step 4: Uncategorized Banner

**File: `src/components/UncategorizedBanner.tsx`**

Shows when there are uncategorized events:
- "X events need categorization"
- Tap to cycle through uncategorized events
- Dismiss option

### Step 5: Update Calendar Screen

**File: `src/screens/CalendarScreen.tsx`**

Changes:
- Add `onPress` to EventCard
- State for selected event and modal visibility
- Show UncategorizedBanner if uncategorized events exist
- Handle category selection and persistence

### Step 6: Redux Persistence

**File: `src/store/categoriesSlice.ts`**

Add async thunks:
- `loadStoredMappings` - Load from AsyncStorage on app start
- `saveMapping` - Save new mapping to AsyncStorage
- `removeMapping` - Remove mapping from AsyncStorage

### Step 7: Categorization Hook

**File: `src/hooks/useCategorization.ts`**

Provides:
- Current category mappings
- Function to categorize an event
- Function to get suggested category
- Loading state

---

## UI/UX Specifications

### Category Picker Modal

```
┌─────────────────────────────────┐
│         Categorize Event        │
│─────────────────────────────────│
│  "Team Standup Meeting"         │
│                                 │
│  ┌─────────┐  ┌─────────┐      │
│  │ 💼 WORK │  │ 🎮 PLAY │      │
│  └─────────┘  └─────────┘      │
│  ┌─────────┐  ┌─────────┐      │
│  │ 💪 HEALTH│ │ 💕 ROMANCE│    │
│  └─────────┘  └─────────┘      │
│  ┌─────────┐                    │
│  │ 📚 STUDY│                    │
│  └─────────┘                    │
│                                 │
│  ☑ Remember for similar events │
│                                 │
│  [ Cancel ]                     │
└─────────────────────────────────┘
```

### Category Icons & Colors

| Category | Icon | Color | Hex |
|----------|------|-------|-----|
| Work | 💼 | Coral Red | #E85D75 |
| Play | 🎮 | Emerald | #50C878 |
| Health | 💪 | Teal | #4ECDC4 |
| Romance | 💕 | Pink | #FF6B9D |
| Study | 📚 | Purple | #9B59B6 |
| Uncategorized | ❓ | Gray | #6B6B6B |

### Uncategorized Banner

```
┌─────────────────────────────────┐
│ ⚠️ 5 events need categorization │
│           [ Categorize Now ]    │
└─────────────────────────────────┘
```

---

## Data Flow

### Categorizing an Event

```
1. User taps event
   ↓
2. CategoryPicker modal opens
   ↓
3. User selects category + "remember" toggle
   ↓
4. dispatch(updateEventCategory({ eventId, category }))
   ↓
5. If "remember" checked:
   - Extract pattern from event title
   - dispatch(saveMapping({ pattern, category }))
   - AsyncStorage updated
   ↓
6. Modal closes, event card updates
```

### Loading Mappings on App Start

```
1. App.tsx useEffect
   ↓
2. dispatch(loadStoredMappings())
   ↓
3. AsyncStorage.getItem('@gylr/category_mappings')
   ↓
4. Redux state updated
   ↓
5. When events fetched, mappings applied automatically
```

---

## Type Definitions

### Category Mapping (already exists, verify)

```typescript
interface CategoryMapping {
  pattern: string;      // e.g., "standup", "gym", "date night"
  category: Category;
  createdAt: string;    // ISO timestamp
}
```

### Categorization Result

```typescript
interface CategorizationResult {
  category: Category;
  source: 'user_mapping' | 'keyword' | 'default';
  confidence: 'high' | 'medium' | 'low';
}
```

---

## Storage Schema

### AsyncStorage Keys

```typescript
const STORAGE_KEYS = {
  CATEGORY_MAPPINGS: '@gylr/category_mappings',
  // Already defined in googleAuth.ts:
  // AUTH_TOKENS: '@gylr/auth_tokens',
  // USER_INFO: '@gylr/user_info',
};
```

### Mapping Storage Format

```json
{
  "mappings": [
    { "pattern": "standup", "category": "work", "createdAt": "2024-01-15T10:00:00Z" },
    { "pattern": "gym", "category": "health", "createdAt": "2024-01-15T10:05:00Z" },
    { "pattern": "dinner with sarah", "category": "romance", "createdAt": "2024-01-15T10:10:00Z" }
  ]
}
```

---

## Pattern Matching Strategy

### Extracting Patterns

When user categorizes "Weekly Team Standup Meeting" as Work:

1. **Full title** (lowest priority): "weekly team standup meeting"
2. **Key phrases** (medium priority): "team standup", "standup meeting"
3. **Keywords** (highest specificity): "standup"

For MVP, use the **significant words** approach:
- Remove common words (the, a, an, with, for, etc.)
- Store remaining words as pattern
- Match if event title contains pattern

### Matching Priority

1. **Exact user mapping** - User categorized this exact title before
2. **Partial user mapping** - Title contains a learned pattern
3. **Keyword match** - Title matches default keywords
4. **Uncategorized** - No match found

---

## Validation Strategies

### Unit Tests

| Test | Description |
|------|-------------|
| `categorization.test.ts` | Test pattern extraction and matching |
| `CategoryPicker.test.tsx` | Test modal interactions |
| `categoriesSlice.test.ts` | Test Redux actions and persistence |

### Manual Testing Checklist

- [ ] **Category Picker**
  - [ ] Tapping event opens modal
  - [ ] Current category is highlighted
  - [ ] Selecting category updates event
  - [ ] "Remember" toggle works
  - [ ] Cancel closes without changes
  - [ ] Modal animates smoothly

- [ ] **Learning System**
  - [ ] Categorizing with "remember" saves mapping
  - [ ] New similar events get learned category
  - [ ] User mappings override keyword defaults
  - [ ] Mappings persist after app restart

- [ ] **Uncategorized Banner**
  - [ ] Shows when uncategorized events exist
  - [ ] Count is accurate
  - [ ] Tapping navigates to first uncategorized
  - [ ] Hides when all categorized

- [ ] **Edge Cases**
  - [ ] Very long event titles truncate properly
  - [ ] Special characters in titles handled
  - [ ] Rapid category changes don't cause issues
  - [ ] Offline mode doesn't crash

---

## Accessibility

- Category buttons have accessible labels
- Modal can be dismissed with back gesture
- Color is not the only indicator (icons + labels)
- Focus management when modal opens/closes

---

## Performance Considerations

- Debounce mapping saves to avoid excessive writes
- Memoize category suggestions for large event lists
- Lazy load mappings on first categorization attempt

---

## Error Handling

| Scenario | Handling |
|----------|----------|
| AsyncStorage read fails | Use empty mappings, log error |
| AsyncStorage write fails | Show toast, keep in-memory state |
| Invalid mapping data | Filter out invalid entries |

---

## Success Criteria

Phase 3 is complete when:

1. ✅ Tapping an event opens CategoryPicker modal
2. ✅ User can select from 5 categories
3. ✅ "Remember" option saves mapping for future events
4. ✅ Mappings persist in AsyncStorage
5. ✅ New events auto-categorize based on learned patterns
6. ✅ Uncategorized banner shows and functions correctly
7. ✅ All unit tests pass
8. ✅ TypeScript compiles without errors

---

## Session Recovery Prompt

If starting a new session, use this prompt:

> I'm continuing work on "Get Your Life Right" (GYLR). I completed Phase 1 (setup) and Phase 2 (Google Calendar integration). Now working on Phase 3: Event Categorization System.
>
> Please read:
> - `requests/PROMPTS1.md` for the full implementation plan
> - `requests/PROMPT3.md` for Phase 3 details
> - `CLAUDE.md` for project conventions
>
> Current status: [describe what's done/remaining]
>
> Continue from where we left off.

---

## Estimated Effort

- **New files**: 5
- **Modified files**: 4
- **Total changes**: 9 files

---

*Document Version: 1.0*
*Phase: 3 of 10*
*Depends on: Phase 2 (Complete)*
