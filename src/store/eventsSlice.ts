import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CategorizedEvent, Category } from '../types';
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
    },
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

export const selectUncategorizedEvents = (state: RootState): CategorizedEvent[] =>
  state.events.events.filter((e) => e.category === Category.UNCATEGORIZED);
