import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../types';
import {
  loadCategoryMappings,
  saveCategoryMapping,
  removeCategoryMapping as removeStoredMapping,
  clearAllMappings,
  CategoryMapping,
} from '../services/categorization';
import type { RootState } from './index';

interface CategoriesState {
  mappings: CategoryMapping[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  mappings: [],
  loading: false,
  error: null,
};

// Async thunk to load mappings from AsyncStorage
export const loadStoredMappings = createAsyncThunk<
  CategoryMapping[],
  void,
  { rejectValue: string }
>('categories/loadStoredMappings', async (_, { rejectWithValue }) => {
  try {
    return await loadCategoryMappings();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load mappings';
    return rejectWithValue(message);
  }
});

// Async thunk to save a new mapping
export const saveMapping = createAsyncThunk<
  CategoryMapping,
  { pattern: string; category: Category },
  { rejectValue: string }
>('categories/saveMapping', async ({ pattern, category }, { rejectWithValue }) => {
  try {
    return await saveCategoryMapping(pattern, category);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save mapping';
    return rejectWithValue(message);
  }
});

// Async thunk to remove a mapping
export const deleteMapping = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('categories/deleteMapping', async (pattern, { rejectWithValue }) => {
  try {
    await removeStoredMapping(pattern);
    return pattern;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete mapping';
    return rejectWithValue(message);
  }
});

// Async thunk to clear all mappings
export const clearStoredMappings = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('categories/clearStoredMappings', async (_, { rejectWithValue }) => {
  try {
    await clearAllMappings();
    return;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to clear mappings';
    return rejectWithValue(message);
  }
});

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addMappingLocal: (state, action: PayloadAction<CategoryMapping>) => {
      // Remove existing mapping for this pattern if exists
      state.mappings = state.mappings.filter(
        (m) => m.pattern.toLowerCase() !== action.payload.pattern.toLowerCase()
      );
      state.mappings.push(action.payload);
    },
    removeMappingLocal: (state, action: PayloadAction<string>) => {
      state.mappings = state.mappings.filter(
        (m) => m.pattern.toLowerCase() !== action.payload.toLowerCase()
      );
    },
    setMappings: (state, action: PayloadAction<CategoryMapping[]>) => {
      state.mappings = action.payload;
    },
    clearMappingsLocal: (state) => {
      state.mappings = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Load mappings
      .addCase(loadStoredMappings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadStoredMappings.fulfilled, (state, action) => {
        state.mappings = action.payload;
        state.loading = false;
      })
      .addCase(loadStoredMappings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load mappings';
      })
      // Save mapping
      .addCase(saveMapping.fulfilled, (state, action) => {
        // Remove existing and add new
        state.mappings = state.mappings.filter(
          (m) => m.pattern.toLowerCase() !== action.payload.pattern.toLowerCase()
        );
        state.mappings.push(action.payload);
      })
      // Delete mapping
      .addCase(deleteMapping.fulfilled, (state, action) => {
        state.mappings = state.mappings.filter(
          (m) => m.pattern.toLowerCase() !== action.payload.toLowerCase()
        );
      })
      // Clear all mappings
      .addCase(clearStoredMappings.fulfilled, (state) => {
        state.mappings = [];
      });
  },
});

export const {
  addMappingLocal,
  removeMappingLocal,
  setMappings,
  clearMappingsLocal,
} = categoriesSlice.actions;

export const categoriesReducer = categoriesSlice.reducer;

// Selectors
export const selectCategoryMappings = (state: RootState): CategoryMapping[] =>
  state.categories.mappings;

export const selectCategoriesLoading = (state: RootState): boolean =>
  state.categories.loading;

export const selectCategoryForPattern = (
  state: RootState,
  pattern: string
): Category | undefined => {
  const mapping = state.categories.mappings.find(
    (m) => m.pattern.toLowerCase() === pattern.toLowerCase()
  );
  return mapping?.category;
};
