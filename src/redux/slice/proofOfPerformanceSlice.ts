/**
 * Proof of Performance Slice
 * Manages proof of performance state using Redux Toolkit
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getProofOfPerformanceThunk } from '../thunk/proofOfPerformanceThunk';

export interface ProofOfPerformanceItem {
  stateId: number;
  stateName: string;
  winningNumber: string;
  hit: boolean;
  drawDate: string | null;
  drawTime: 'MID' | 'EVE' | null;
}

export interface ProofOfPerformanceState {
  items: ProofOfPerformanceItem[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

// Initial state
const initialState: ProofOfPerformanceState = {
  items: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

// Proof of Performance slice
const proofOfPerformanceSlice = createSlice({
  name: 'proofOfPerformance',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    // Reset state
    reset: (state) => {
      state.items = [];
      state.isLoading = false;
      state.error = null;
      state.lastUpdated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET PROOF OF PERFORMANCE
      .addCase(getProofOfPerformanceThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProofOfPerformanceThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(getProofOfPerformanceThunk.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch proof of performance';
      });
  },
});

// Export actions
export const { clearError, reset } = proofOfPerformanceSlice.actions;

// Export reducer
export default proofOfPerformanceSlice.reducer;
