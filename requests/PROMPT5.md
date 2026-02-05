# Phase 5: Life Panel with Pie Chart

## Overview

This phase implements the Life Panel - the core feature that visualizes how users spend their time and prepares the UI for AI-generated roasts. We'll add a pie chart showing time allocation by category, time calculation utilities, and the judgment display area.

---

## Goals

1. **Pie Chart** - Visual breakdown of time spent per category
2. **Time Calculations** - Calculate hours and percentages per category
3. **Category Legend** - Show breakdown with icons and durations
4. **Time Period Integration** - Sync with CalendarScreen's time period
5. **Judgment Area** - UI ready for Claude API integration (Phase 6)
6. **Stats Summary** - Total hours tracked, most/least time categories

---

## Dependencies to Install

```bash
npx expo install react-native-svg
npm install victory-native
```

- `react-native-svg` - Required for chart rendering
- `victory-native` - Charting library with good React Native support

**Alternative:** `react-native-chart-kit` (simpler but less customizable)

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/TimeAllocationChart.tsx` | Pie chart component |
| `src/components/CategoryLegend.tsx` | Legend showing category breakdown |
| `src/components/JudgmentCard.tsx` | Card displaying the AI roast |
| `src/components/StatsSummary.tsx` | Quick stats (total hours, top category) |
| `src/utils/timeCalculations.ts` | Calculate allocations from events |
| `src/hooks/useTimeAllocation.ts` | Hook for computing allocations |

## Files to Modify

| File | Changes |
|------|---------|
| `src/screens/LifeScreen.tsx` | Complete redesign with chart and stats |
| `src/components/index.ts` | Export new components |
| `src/utils/index.ts` | Export new utilities |
| `src/hooks/index.ts` | Export new hook |

---

## Implementation Steps

### Step 1: Install Chart Dependencies

```bash
npx expo install react-native-svg
npm install victory-native
```

### Step 2: Time Calculation Utilities

**File: `src/utils/timeCalculations.ts`**

Functions to implement:

```typescript
// Calculate time allocation from events
calculateTimeAllocations(events: CategorizedEvent[]): TimeAllocation[]

// Get total minutes from events
getTotalMinutes(events: CategorizedEvent[]): number

// Get category with most time
getTopCategory(allocations: TimeAllocation[]): TimeAllocation | null

// Get category with least time (excluding zero)
getBottomCategory(allocations: TimeAllocation[]): TimeAllocation | null

// Format minutes as hours string (e.g., "12.5 hrs")
formatHours(minutes: number): string
```

### Step 3: Time Allocation Hook

**File: `src/hooks/useTimeAllocation.ts`**

Provides:
- Computed allocations from Redux events
- Total time tracked
- Top/bottom categories
- Memoized for performance

```typescript
interface UseTimeAllocationResult {
  allocations: TimeAllocation[];
  totalMinutes: number;
  topCategory: TimeAllocation | null;
  bottomCategory: TimeAllocation | null;
  isEmpty: boolean;
}
```

### Step 4: Pie Chart Component

**File: `src/components/TimeAllocationChart.tsx`**

Using Victory Native:

```typescript
interface TimeAllocationChartProps {
  allocations: TimeAllocation[];
  size?: number;
}
```

Features:
- Donut-style pie chart
- Category colors from constants
- Animated on load
- Center text showing total hours
- Touch to highlight segment (optional)

### Step 5: Category Legend

**File: `src/components/CategoryLegend.tsx`**

Shows breakdown list:

```
┌─────────────────────────────────┐
│ 💼 Work        45%    18.5 hrs │
│ 🎮 Play        25%    10.2 hrs │
│ 💪 Health      15%     6.1 hrs │
│ 💕 Romance      10%     4.1 hrs │
│ 📚 Study        5%     2.0 hrs │
└─────────────────────────────────┘
```

Props:
```typescript
interface CategoryLegendProps {
  allocations: TimeAllocation[];
  onCategoryPress?: (category: Category) => void;
}
```

### Step 6: Stats Summary

**File: `src/components/StatsSummary.tsx`**

Quick glance stats:

```
┌─────────────────────────────────┐
│  📊 This Week's Summary         │
│  ────────────────────────────── │
│  Total: 40.9 hours tracked      │
│  Top: Work (45%)                │
│  Bottom: Study (5%)             │
└─────────────────────────────────┘
```

### Step 7: Judgment Card (Placeholder)

**File: `src/components/JudgmentCard.tsx`**

Displays the AI roast (placeholder until Phase 6):

```
┌─────────────────────────────────┐
│     🎭 Your Judgment            │
│  ────────────────────────────── │
│                                 │
│  "Connect your calendar and     │
│   get roasted!"                 │
│                                 │
│        [ Get Roasted ]          │
└─────────────────────────────────┘
```

Props:
```typescript
interface JudgmentCardProps {
  judgment: string | null;
  loading: boolean;
  onRequestJudgment: () => void;
  personality: JudgePersonality;
}
```

### Step 8: Update Life Screen

**File: `src/screens/LifeScreen.tsx`**

Layout:
```
┌─────────────────────────────────┐
│  Life Panel          [Week ▼]  │  ← Header with time selector
├─────────────────────────────────┤
│                                 │
│      ┌───────────────┐         │
│      │   PIE CHART   │         │  ← TimeAllocationChart
│      │    40.9 hrs   │         │
│      └───────────────┘         │
│                                 │
│  ┌─────────────────────────┐   │
│  │    Category Legend      │   │  ← CategoryLegend
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │    Judgment Card        │   │  ← JudgmentCard
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

---

## Time Allocation Algorithm

```typescript
function calculateTimeAllocations(events: CategorizedEvent[]): TimeAllocation[] {
  // 1. Group events by category
  const categoryMinutes = new Map<Category, number>();

  // 2. Sum duration for each category
  events.forEach(event => {
    const duration = getDurationMinutes(event.startTime, event.endTime);
    const current = categoryMinutes.get(event.category) ?? 0;
    categoryMinutes.set(event.category, current + duration);
  });

  // 3. Calculate total
  const totalMinutes = Array.from(categoryMinutes.values())
    .reduce((sum, mins) => sum + mins, 0);

  // 4. Build allocations with percentages
  const allocations: TimeAllocation[] = [];

  for (const category of Object.values(Category)) {
    if (category === Category.UNCATEGORIZED) continue;

    const minutes = categoryMinutes.get(category) ?? 0;
    const percentage = totalMinutes > 0
      ? Math.round((minutes / totalMinutes) * 100)
      : 0;

    allocations.push({
      category,
      totalMinutes: minutes,
      percentage,
      eventCount: events.filter(e => e.category === category).length,
    });
  }

  // 5. Sort by percentage (highest first)
  return allocations.sort((a, b) => b.percentage - a.percentage);
}
```

---

## Chart Color Mapping

Use colors from `src/constants/colors.ts`:

```typescript
const chartColors: Record<Category, string> = {
  [Category.WORK]: colors.work,      // #E85D75
  [Category.PLAY]: colors.play,      // #50C878
  [Category.HEALTH]: colors.health,  // #4ECDC4
  [Category.ROMANCE]: colors.romance, // #FF6B9D
  [Category.STUDY]: colors.study,    // #9B59B6
};
```

---

## Victory Native Pie Chart Example

```typescript
import { VictoryPie, VictoryLabel } from 'victory-native';
import Svg from 'react-native-svg';

<Svg width={size} height={size}>
  <VictoryPie
    standalone={false}
    width={size}
    height={size}
    data={chartData}
    innerRadius={size * 0.3}
    labelRadius={size * 0.4}
    style={{
      data: {
        fill: ({ datum }) => datum.color,
      },
    }}
    labels={() => null} // Hide labels on chart
  />
  {/* Center label */}
  <VictoryLabel
    textAnchor="middle"
    x={size / 2}
    y={size / 2}
    text={centerText}
    style={{ fontSize: 18, fill: colors.textPrimary }}
  />
</Svg>
```

---

## Empty State

When no events or all uncategorized:

```
┌─────────────────────────────────┐
│                                 │
│            📊                   │
│                                 │
│     No Data Yet                 │
│                                 │
│  Categorize your events to     │
│  see your time breakdown.       │
│                                 │
│     [ Go to Calendar ]          │
│                                 │
└─────────────────────────────────┘
```

---

## Type Definitions

Already defined in `src/types/index.ts`:

```typescript
interface TimeAllocation {
  category: Category;
  totalMinutes: number;
  percentage: number;
  eventCount: number;
}
```

---

## Validation Strategies

### Unit Tests

| Test | Description |
|------|-------------|
| `timeCalculations.test.ts` | Test allocation calculations |
| `useTimeAllocation.test.ts` | Test hook with mock events |
| `TimeAllocationChart.test.tsx` | Test chart renders correctly |

### Manual Testing Checklist

- [ ] **Pie Chart**
  - [ ] Chart renders with correct colors
  - [ ] Segments proportional to time spent
  - [ ] Center shows total hours
  - [ ] Animates on load
  - [ ] Updates when time period changes

- [ ] **Category Legend**
  - [ ] All categories shown
  - [ ] Correct percentages
  - [ ] Correct hours
  - [ ] Sorted by percentage

- [ ] **Time Period Sync**
  - [ ] Changing period on Calendar updates Life Panel
  - [ ] Chart reflects correct time range

- [ ] **Empty State**
  - [ ] Shows when no categorized events
  - [ ] "Go to Calendar" button works

- [ ] **Judgment Card**
  - [ ] Placeholder text shows
  - [ ] "Get Roasted" button visible
  - [ ] Ready for Phase 6 integration

---

## Performance Considerations

- Memoize allocation calculations (expensive for many events)
- Use `useMemo` for chart data transformation
- Debounce time period changes if needed
- Limit animation complexity on older devices

---

## Accessibility

- Chart has accessible description
- Legend items are tappable with proper labels
- Color is not the only indicator (icons + labels)
- Screen reader announces totals

---

## Error Handling

| Scenario | Handling |
|----------|----------|
| No events | Show empty state |
| All uncategorized | Show prompt to categorize |
| Chart render error | Fallback to text-only view |

---

## Success Criteria

Phase 5 is complete when:

1. ✅ Pie chart displays time allocation by category
2. ✅ Chart colors match category colors
3. ✅ Center of chart shows total hours
4. ✅ Category legend shows breakdown with icons
5. ✅ Stats update when time period changes
6. ✅ Empty state displays when no data
7. ✅ Judgment card placeholder is ready
8. ✅ TypeScript compiles without errors

---

## Session Recovery Prompt

If starting a new session, use this prompt:

> I'm continuing work on "Get Your Life Right" (GYLR). I completed:
> - Phase 1: Project setup
> - Phase 2: Google Calendar integration
> - Phase 3: Event categorization system
> - Phase 4: Calendar Tab UI enhancement
>
> Now working on Phase 5: Life Panel with Pie Chart.
>
> Please read:
> - `requests/PROMPTS1.md` for the full implementation plan
> - `requests/PROMPT5.md` for Phase 5 details
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

- **Requires Phase 3**: Categorized events for calculations
- **Requires Phase 4**: TimePeriodSelector (already built)
- **Leads into Phase 6**: Claude API integration for roasts

---

*Document Version: 1.0*
*Phase: 5 of 10*
*Depends on: Phase 4 (Complete)*
