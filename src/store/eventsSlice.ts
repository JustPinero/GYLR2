import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CategorizedEvent, Category, CalendarEvent, TimePeriod } from '../types';
import { fetchEvents as fetchGoogleEvents } from '../services/googleCalendar';
import { categoryKeywords } from '../constants/keywords';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from '../utils/dateUtils';
import type { RootState } from './index';

interface EventsState {
  events: CategorizedEvent[];
  loading: boolean;
  error: string | null;
  lastSynced: string | null;
}

const initialState: EventsState = {
  events: [],
  loading: false,
  error: null,
  lastSynced: null,
};

// Helper to get date range based on time period
function getDateRange(timePeriod: TimePeriod): { start: Date; end: Date } {
  const now = new Date();
  switch (timePeriod) {
    case 'day':
      return { start: startOfDay(now), end: endOfDay(now) };
    case 'week':
      return { start: startOfWeek(now), end: endOfWeek(now) };
    case 'month':
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case 'year':
      return { start: startOfYear(now), end: endOfYear(now) };
  }
}

// Helper to auto-categorize an event based on title
function autoCategorize(title: string): Category {
  const lowerTitle = title.toLowerCase();

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (lowerTitle.includes(keyword.toLowerCase())) {
        return category as Category;
      }
    }
  }

  return Category.UNCATEGORIZED;
}

// Transform CalendarEvent to CategorizedEvent
function categorizeEvent(
  event: CalendarEvent,
  existingMappings: Map<string, Category>
): CategorizedEvent {
  // Check if we have an existing mapping for this event title
  const existingCategory = existingMappings.get(event.title.toLowerCase());

  if (existingCategory) {
    return {
      ...event,
      category: existingCategory,
      categoryConfirmed: true,
    };
  }

  // Auto-categorize based on keywords
  const suggestedCategory = autoCategorize(event.title);

  return {
    ...event,
    category: suggestedCategory,
    categoryConfirmed: suggestedCategory !== Category.UNCATEGORIZED,
  };
}

// Async thunk to fetch calendar events
export const fetchCalendarEvents = createAsyncThunk<
  CategorizedEvent[],
  { accessToken: string; timePeriod: TimePeriod },
  { state: RootState; rejectValue: string }
>(
  'events/fetchCalendarEvents',
  async ({ accessToken, timePeriod }, { getState, rejectWithValue }) => {
    try {
      const { start, end } = getDateRange(timePeriod);
      const events = await fetchGoogleEvents(accessToken, start, end);

      // Get existing category mappings
      const state = getState();
      const mappings = new Map(
        state.categories.mappings.map((m) => [m.pattern.toLowerCase(), m.category])
      );

      // Categorize events
      return events.map((event) => categorizeEvent(event, mappings));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch events';
      return rejectWithValue(message);
    }
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setEvents: (state, action: PayloadAction<CategorizedEvent[]>) => {
      state.events = action.payload;
      state.lastSynced = new Date().toISOString();
      state.loading = false;
      state.error = null;
    },
    addEvent: (state, action: PayloadAction<CategorizedEvent>) => {
      state.events.push(action.payload);
    },
    updateEventCategory: (
      state,
      action: PayloadAction<{ eventId: string; category: Category }>
    ) => {
      const event = state.events.find((e) => e.id === action.payload.eventId);
      if (event) {
        event.category = action.payload.category;
        event.categoryConfirmed = true;
      }
    },
    clearEvents: (state) => {
      state.events = [];
      state.lastSynced = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalendarEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCalendarEvents.fulfilled, (state, action) => {
        state.events = action.payload;
        state.loading = false;
        state.lastSynced = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchCalendarEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch events';
      });
  },
});

export const {
  setLoading,
  setError,
  setEvents,
  addEvent,
  updateEventCategory,
  clearEvents,
} = eventsSlice.actions;

export const eventsReducer = eventsSlice.reducer;

// Selectors
export const selectAllEvents = (state: RootState): CategorizedEvent[] =>
  state.events.events;

export const selectEventsLoading = (state: RootState): boolean =>
  state.events.loading;

export const selectEventsError = (state: RootState): string | null =>
  state.events.error;

export const selectLastSynced = (state: RootState): string | null =>
  state.events.lastSynced;

export const selectUncategorizedEvents = (state: RootState): CategorizedEvent[] =>
  state.events.events.filter((e) => e.category === Category.UNCATEGORIZED);

export const selectEventsByCategory = (
  state: RootState,
  category: Category
): CategorizedEvent[] =>
  state.events.events.filter((e) => e.category === category);
