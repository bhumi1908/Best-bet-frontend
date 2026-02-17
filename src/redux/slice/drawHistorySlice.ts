/**
 * Draw History Slice
 * Manages draw history state using Redux Toolkit
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getDrawHistoriesThunk } from '../thunk/drawHistoryThunk';

export interface DrawHistory {
  id: number;
  draw_date: string; // YYYY-MM-DD format
  draw_time: 'MID' | 'EVE'; // Enum: MID or EVE
  winning_numbers: string;
  prize_amount: number;
  is_predicted?: boolean; // Whether this draw matches a prediction
  state_name: string;
  state_code: string;
  game_name: string;
  game_code: string;
}

export interface DrawHistoryFilters {
  search?: string; // Search by winning number, draw date, or draw time
  stateId?: number;
  drawTime?: 'MID' | 'EVE'; // Filter by draw time enum: MID or EVE
  fromDate?: Date; // ISO date string (YYYY-MM-DD)
  toDate?: Date; // ISO date string (YYYY-MM-DD)
  sortBy?: 'drawDate' | 'winningNumbers';
  sortOrder?: 'asc' | 'desc';
}

export interface DrawHistoryState {
  drawHistories: DrawHistory[];
  filters: DrawHistoryFilters;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

// Initial state
const initialState: DrawHistoryState = {
  drawHistories: [],
  filters: {
    sortBy: 'drawDate',
    sortOrder: 'desc',
  },
  isLoading: false,
  error: null,
  lastUpdated: null,
};

// Draw History slice
const drawHistorySlice = createSlice({
  name: 'drawHistory',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    // Set filters
    setFilters: (state, action: PayloadAction<Partial<DrawHistoryFilters>>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    // Reset filters
    resetFilters: (state) => {
      state.filters = {
        sortBy: 'drawDate',
        sortOrder: 'desc',
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // GET DRAW HISTORIES
      .addCase(getDrawHistoriesThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDrawHistoriesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.drawHistories = action.payload.draw_histories;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(getDrawHistoriesThunk.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch draw histories';
      });
  },
});

// Export actions
export const { clearError, setFilters, resetFilters } = drawHistorySlice.actions;

// Export reducer
export default drawHistorySlice.reducer;
