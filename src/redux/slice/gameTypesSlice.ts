/**
 * Game Types Slice
 * Manages game types list state using Redux Toolkit
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllGameTypesThunk } from '../thunk/gameTypesThunk';
import { GameTypesState } from '@/types/gameHistory';

// Initial state
const initialState: GameTypesState = {
  gameTypes: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

// Game Types slice
const gameTypesSlice = createSlice({
  name: 'gameTypes',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET ALL GAME TYPES
      .addCase(getAllGameTypesThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllGameTypesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.gameTypes = action.payload.game_types;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(getAllGameTypesThunk.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch game types';
      });
  },
});

// Export actions
export const { clearError: clearGameTypesError } = gameTypesSlice.actions;

// Export reducer
export default gameTypesSlice.reducer;
