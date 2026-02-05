import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TimePeriod, JudgePersonality } from '../types';
import type { RootState } from './index';

interface TokenState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

interface SettingsState {
  timePeriod: TimePeriod;
  judgePersonality: JudgePersonality;
  isAuthenticated: boolean;
  userEmail: string | null;
  userName: string | null;
  tokens: TokenState;
  authLoading: boolean;
}

const initialState: SettingsState = {
  timePeriod: 'week',
  judgePersonality: 'sarcastic_friend',
  isAuthenticated: false,
  userEmail: null,
  userName: null,
  tokens: {
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
  },
  authLoading: true, // Start as true to check stored auth on app load
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
      state.authLoading = false;
    },
    setUserInfo: (
      state,
      action: PayloadAction<{ email: string | null; name: string | null }>
    ) => {
      state.userEmail = action.payload.email;
      state.userName = action.payload.name;
    },
    setTokens: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string | null;
        expiresAt: number;
      }>
    ) => {
      state.tokens.accessToken = action.payload.accessToken;
      state.tokens.refreshToken = action.payload.refreshToken;
      state.tokens.expiresAt = action.payload.expiresAt;
    },
    clearTokens: (state) => {
      state.tokens.accessToken = null;
      state.tokens.refreshToken = null;
      state.tokens.expiresAt = null;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.authLoading = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userEmail = null;
      state.userName = null;
      state.tokens.accessToken = null;
      state.tokens.refreshToken = null;
      state.tokens.expiresAt = null;
      state.authLoading = false;
    },
  },
});

export const {
  setTimePeriod,
  setJudgePersonality,
  setAuthenticated,
  setUserInfo,
  setTokens,
  clearTokens,
  setAuthLoading,
  logout,
} = settingsSlice.actions;

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

export const selectUserName = (state: RootState): string | null =>
  state.settings.userName;

export const selectAccessToken = (state: RootState): string | null =>
  state.settings.tokens.accessToken;

export const selectAuthLoading = (state: RootState): boolean =>
  state.settings.authLoading;

export const selectTokens = (state: RootState): TokenState =>
  state.settings.tokens;
