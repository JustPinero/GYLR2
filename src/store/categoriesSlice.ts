import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../types';
import type { RootState } from './index';

// Maps event title patterns to categories (user-defined overrides)
interface CategoryMapping {
  pattern: string;
  category: Category;
}

interface CategoriesState {
  mappings: CategoryMapping[];
}

const initialState: CategoriesState = {
  mappings: [],
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addMapping: (state, action: PayloadAction<CategoryMapping>) => {
      // Remove existing mapping for this pattern if exists
      state.mappings = state.mappings.filter(
        (m) => m.pattern.toLowerCase() !== action.payload.pattern.toLowerCase()
      );
      state.mappings.push(action.payload);
    },
    removeMapping: (state, action: PayloadAction<string>) => {
      state.mappings = state.mappings.filter(
        (m) => m.pattern.toLowerCase() !== action.payload.toLowerCase()
      );
    },
    setMappings: (state, action: PayloadAction<CategoryMapping[]>) => {
      state.mappings = action.payload;
    },
    clearMappings: (state) => {
      state.mappings = [];
    },
  },
});

export const { addMapping, removeMapping, setMappings, clearMappings } =
  categoriesSlice.actions;

export const categoriesReducer = categoriesSlice.reducer;

// Selectors
export const selectCategoryMappings = (state: RootState): CategoryMapping[] =>
  state.categories.mappings;

export const selectCategoryForPattern = (
  state: RootState,
  pattern: string
): Category | undefined => {
  const mapping = state.categories.mappings.find(
    (m) => m.pattern.toLowerCase() === pattern.toLowerCase()
  );
  return mapping?.category;
};
