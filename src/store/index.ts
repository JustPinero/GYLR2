import { configureStore } from '@reduxjs/toolkit';
import { eventsReducer } from './eventsSlice';
import { categoriesReducer } from './categoriesSlice';
import { settingsReducer } from './settingsSlice';
import judgmentReducer from './judgmentSlice';

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    categories: categoriesReducer,
    settings: settingsReducer,
    judgment: judgmentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore Date objects in state
        ignoredActions: ['events/setEvents', 'events/addEvent'],
        ignoredPaths: ['events.events'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
