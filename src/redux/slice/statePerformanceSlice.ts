/**
 * State Performance Slice
 * Manages state performance data state using Redux Toolkit
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getStatePerformanceThunk } from '../thunk/statePerformanceThunk';
import { StatePerformanceState, StatePerformanceData } from '@/types/gameHistory';

// Initial state
const initialState: StatePerformanceState = {
  data: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
  currentState: null,
  currentGameId: undefined,
};

// State performance slice
const statePerformanceSlice = createSlice({
  name: 'statePerformance',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    // Clear data
    clearData: (state) => {
      state.data = null;
      state.currentState = null;
      state.currentGameId = undefined;
      state.lastUpdated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET STATE PERFORMANCE
      .addCase(getStatePerformanceThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getStatePerformanceThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.currentState = action.meta.arg.state;
        state.currentGameId = action.meta.arg.gameId;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(getStatePerformanceThunk.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch state performance';
      });
  },
});

// Export actions
export const { clearError, clearData } = statePerformanceSlice.actions;

// Export reducer
export default statePerformanceSlice.reducer;
