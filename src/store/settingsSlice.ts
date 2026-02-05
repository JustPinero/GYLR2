import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TimePeriod, JudgePersonality } from '../types';
import type { RootState } from './index';

interface SettingsState {
  timePeriod: TimePeriod;
  judgePersonality: JudgePersonality;
  isAuthenticated: boolean;
  userEmail: string | null;
}

const initialState: SettingsState = {
  timePeriod: 'week',
  judgePersonality: 'sarcastic_friend',
  isAuthenticated: false,
  userEmail: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTimePeriod: (state, action: PayloadAction<TimePeriod>) => {
      state.timePeriod = action.payload;
    },
    setJudgePersonality: (state, action: PayloadAction<JudgePersonality>) => {
      state.judgePersonality = action.payload;
    },
    setAuthenticated: (
      state,
      action: PayloadAction<{ isAuthenticated: boolean; email: string | null }>
    ) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.userEmail = action.payload.email;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userEmail = null;
    },
  },
});

export const { setTimePeriod, setJudgePersonality, setAuthenticated, logout } =
  settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;

// Selectors
export const selectTimePeriod = (state: RootState): TimePeriod =>
  state.settings.timePeriod;

export const selectJudgePersonality = (state: RootState): JudgePersonality =>
  state.settings.judgePersonality;

export const selectIsAuthenticated = (state: RootState): boolean =>
  state.settings.isAuthenticated;

export const selectUserEmail = (state: RootState): string | null =>
  state.settings.userEmail;
