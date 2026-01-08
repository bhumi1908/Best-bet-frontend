/**
 * Game History Slice
 * Manages game history state using Redux Toolkit
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getAllGameHistoriesThunk,
  getGameHistoryByIdThunk,
  createGameHistoryThunk,
  updateGameHistoryThunk,
  deleteGameHistoryThunk,
} from '../thunk/gameHistoryThunk';
import {
  GameHistory,
  GameHistoryState,
  GameHistoryFilters,
  Pagination,
} from '@/types/gameHistory';

// Initial state
const initialState: GameHistoryState = {
  gameHistories: [],
  selectedGameHistory: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {
    sortBy: 'drawDate',
    sortOrder: 'desc',
  },
  isLoading: false,
  error: null,
  lastUpdated: null,
};

// Game History slice
const gameHistorySlice = createSlice({
  name: 'gameHistory',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    // Set filters
    setFilters: (state, action: PayloadAction<Partial<GameHistoryFilters>>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
      // Reset to first page when filters change
      state.pagination.page = 1;
    },
    // Set pagination
    setPagination: (state, action: PayloadAction<Partial<Pagination>>) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload,
      };
    },
    // Reset filters
    resetFilters: (state) => {
      state.filters = {
        sortBy: 'drawDate',
        sortOrder: 'desc',
      };
      state.pagination.page = 1;
    },
    // Update game history in list (optimistic update)
    updateGameHistoryInList: (state, action: PayloadAction<GameHistory>) => {
      const index = state.gameHistories.findIndex((h) => h.id === action.payload.id);
      if (index !== -1) {
        state.gameHistories[index] = action.payload;
      }
    },
    // Add game history to list
    addGameHistoryToList: (state, action: PayloadAction<GameHistory>) => {
      state.gameHistories.unshift(action.payload);
      state.pagination.total = (state.pagination.total || 0) + 1;
    },
    // Remove game history from list
    removeGameHistoryFromList: (state, action: PayloadAction<number>) => {
      state.gameHistories = state.gameHistories.filter((h) => h.id !== action.payload);
      state.pagination.total = Math.max(0, (state.pagination.total || 0) - 1);
    },
    // Set selected game history
    setSelectedGameHistory: (state, action: PayloadAction<GameHistory | null>) => {
      state.selectedGameHistory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET ALL GAME HISTORIES
      .addCase(getAllGameHistoriesThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllGameHistoriesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.gameHistories = action.payload.game_histories;
        state.pagination = action.payload.pagination;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(getAllGameHistoriesThunk.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch game histories';
      })

      // GET GAME HISTORY BY ID
      .addCase(getGameHistoryByIdThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getGameHistoryByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedGameHistory = action.payload;
        state.error = null;
      })
      .addCase(getGameHistoryByIdThunk.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch game history';
      })

      // CREATE GAME HISTORY
      .addCase(createGameHistoryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createGameHistoryThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        // Add to the beginning of the list
        state.gameHistories.unshift(action.payload);
        state.pagination.total = (state.pagination.total || 0) + 1;
        state.error = null;
      })
      .addCase(createGameHistoryThunk.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to create game history';
      })

      // UPDATE GAME HISTORY
      .addCase(updateGameHistoryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateGameHistoryThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update game history in the list
        const index = state.gameHistories.findIndex((h) => h.id === action.payload.id);
        if (index !== -1) {
          state.gameHistories[index] = action.payload;
        }
        // Update selected if it's the same
        if (state.selectedGameHistory?.id === action.payload.id) {
          state.selectedGameHistory = action.payload;
        }
        state.error = null;
      })
      .addCase(updateGameHistoryThunk.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to update game history';
      })

      // DELETE GAME HISTORY
      .addCase(deleteGameHistoryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteGameHistoryThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove from the list
        state.gameHistories = state.gameHistories.filter((h) => h.id !== action.payload);
        state.pagination.total = Math.max(0, (state.pagination.total || 0) - 1);
        // Clear selected if it's the deleted one
        if (state.selectedGameHistory?.id === action.payload) {
          state.selectedGameHistory = null;
        }
        state.error = null;
      })
      .addCase(deleteGameHistoryThunk.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to delete game history';
      });
  },
});

// Export actions
export const {
  clearError,
  setFilters,
  setPagination,
  resetFilters,
  updateGameHistoryInList,
  addGameHistoryToList,
  removeGameHistoryFromList,
  setSelectedGameHistory,
} = gameHistorySlice.actions;

// Export reducer
export default gameHistorySlice.reducer;
