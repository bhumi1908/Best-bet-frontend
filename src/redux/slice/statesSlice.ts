/**
 * States Slice
 * Manages states list state using Redux Toolkit
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllStatesThunk } from '../thunk/statesThunk';
import { StatesState, State } from '@/types/gameHistory';

// Initial state
const initialState: StatesState = {
  states: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

// States slice
const statesSlice = createSlice({
  name: 'states',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET ALL STATES
      .addCase(getAllStatesThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllStatesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.states = action.payload.states;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(getAllStatesThunk.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch states';
      });
  },
});

// Export actions
export const { clearError } = statesSlice.actions;

// Export reducer
export default statesSlice.reducer;
