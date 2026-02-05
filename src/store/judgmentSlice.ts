import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { generateJudgment, createCacheKey, ClaudeAPIError } from '../services/claude';
import { JudgmentRequest, TimeAllocation, TimePeriod, JudgePersonality } from '../types';
import type { RootState } from './index';

// Cache entry type
interface CacheEntry {
  text: string;
  generatedAt: number;
}

// State shape
interface JudgmentState {
  currentJudgment: string | null;
  loading: boolean;
  error: string | null;
  lastRequestedAt: number | null;
  cache: Record<string, CacheEntry>;
}

// Initial state
const initialState: JudgmentState = {
  currentJudgment: null,
  loading: false,
  error: null,
  lastRequestedAt: null,
  cache: {},
};

// Constants
const RATE_LIMIT_MS = 10000; // 10 seconds between requests
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

// Request parameters type
interface RequestJudgmentParams {
  allocations: TimeAllocation[];
  timePeriod: TimePeriod;
  personality: JudgePersonality;
  forceRefresh?: boolean;
}

// Async thunk for requesting judgment
export const requestJudgment = createAsyncThunk<
  string,
  RequestJudgmentParams,
  { state: RootState; rejectValue: string }
>(
  'judgment/requestJudgment',
  async (params, { getState, rejectWithValue }) => {
    const { allocations, timePeriod, personality, forceRefresh = false } = params;
    const state = getState();
    const { lastRequestedAt, cache } = state.judgment;

    // Check rate limit
    if (lastRequestedAt && !forceRefresh) {
      const timeSinceLastRequest = Date.now() - lastRequestedAt;
      if (timeSinceLastRequest < RATE_LIMIT_MS) {
        const secondsRemaining = Math.ceil((RATE_LIMIT_MS - timeSinceLastRequest) / 1000);
        return rejectWithValue(`Easy there! Wait ${secondsRemaining} seconds before getting roasted again.`);
      }
    }

    // Check cache (unless force refresh)
    if (!forceRefresh) {
      const cacheKey = createCacheKey(allocations, timePeriod, personality);
      const cached = cache[cacheKey];

      if (cached) {
        const cacheAge = Date.now() - cached.generatedAt;
        if (cacheAge < CACHE_TTL_MS) {
          // Return cached judgment
          return cached.text;
        }
      }
    }

    // Make API request
    try {
      const request: JudgmentRequest = {
        allocations,
        timePeriod,
        personality,
      };

      const response = await generateJudgment(request);
      return response.text;
    } catch (error) {
      if (error instanceof ClaudeAPIError) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue('Something went wrong. Please try again.');
    }
  }
);

// Slice
const judgmentSlice = createSlice({
  name: 'judgment',
  initialState,
  reducers: {
    clearJudgment: (state) => {
      state.currentJudgment = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCache: (state) => {
      state.cache = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestJudgment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestJudgment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJudgment = action.payload;
        state.lastRequestedAt = Date.now();
        state.error = null;

        // Cache the result
        const { allocations, timePeriod, personality } = action.meta.arg;
        const cacheKey = createCacheKey(allocations, timePeriod, personality);
        state.cache[cacheKey] = {
          text: action.payload,
          generatedAt: Date.now(),
        };
      })
      .addCase(requestJudgment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unknown error occurred';
      });
  },
});

// Actions
export const { clearJudgment, clearError, clearCache } = judgmentSlice.actions;

// Selectors
export const selectCurrentJudgment = (state: RootState): string | null =>
  state.judgment.currentJudgment;

export const selectJudgmentLoading = (state: RootState): boolean =>
  state.judgment.loading;

export const selectJudgmentError = (state: RootState): string | null =>
  state.judgment.error;

export const selectLastRequestedAt = (state: RootState): number | null =>
  state.judgment.lastRequestedAt;

// Selector to check if can request (rate limit)
export const selectCanRequestJudgment = (state: RootState): boolean => {
  const { lastRequestedAt, loading } = state.judgment;

  if (loading) return false;

  if (!lastRequestedAt) return true;

  const timeSinceLastRequest = Date.now() - lastRequestedAt;
  return timeSinceLastRequest >= RATE_LIMIT_MS;
};

// Selector to get seconds until can request again
export const selectSecondsUntilCanRequest = (state: RootState): number => {
  const { lastRequestedAt } = state.judgment;

  if (!lastRequestedAt) return 0;

  const timeSinceLastRequest = Date.now() - lastRequestedAt;
  const remaining = RATE_LIMIT_MS - timeSinceLastRequest;

  return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
};

export default judgmentSlice.reducer;
