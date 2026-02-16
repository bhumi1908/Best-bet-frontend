/**
 * Predictions Slice
 * Manages predictions state for Game 1 and Game 2 using Redux Toolkit
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getLatestPredictionsThunk } from '../thunk/predictionsThunk';
import { getDrawHistoriesThunk } from '../thunk/drawHistoryThunk';

export interface Prediction {
  gameId: number;
  predictions: (number | string)[][]; // Array of number/string arrays (preserves formatting like "081")
  date: Date | string;
}

export interface PredictionsState {
  // Game 1 predictions
  game1Predictions: string[]; // Flattened to string array for display
  game1Loading: boolean;
  game1Error: string | null;
  game1LastUpdated: string | null;

  // Game 2 predictions
  game2Predictions: string[]; // All predictions from Excel (flat array, not grouped)
  game2Loading: boolean;
  game2Error: string | null;
  game2LastUpdated: string | null;

  // Recent draws (shared between games)
  recentDraws: RecentDraw[];
  recentDrawsLoading: boolean;
  recentDrawsError: string | null;
  recentDrawsLastUpdated: string | null;
}

export interface RecentDraw {
  id: number;
  draw_date: string; // YYYY-MM-DD format
  draw_time: 'MID' | 'EVE'; // Enum: MID (Midday) or EVE (Evening)
  winning_numbers: string;
  prize_amount: number;
  total_winners: number;
  state_name: string;
  state_code: string;
  game_name: string;
  game_code: string;
}

// Initial state
const initialState: PredictionsState = {
  game1Predictions: [],
  game1Loading: false,
  game1Error: null,
  game1LastUpdated: null,

  game2Predictions: [],
  game2Loading: false,
  game2Error: null,
  game2LastUpdated: null,

  recentDraws: [],
  recentDrawsLoading: false,
  recentDrawsError: null,
  recentDrawsLastUpdated: null,
};

/**
 * Helper function to convert number[][] or string[][] to string[]
 * Flattens the 2D array, filters out zeros and invalid numbers, converts to strings
 * Preserves original digit length (3-digit, 4-digit, etc.)
 * Filters out predictions that are "0" or empty
 * Example: [[341, 142, 0, 214, 2145], [346, 0, 0, 0]] -> ['341', '142', '214', '2145', '346']
 * Example: [['081', '142', '0'], ['346']] -> ['081', '142', '346']
 */
const flattenPredictions = (predictions: (number | string)[][]): string[] => {
  const flattened: string[] = [];
  
  predictions.forEach((row) => {
    if (Array.isArray(row)) {
      row.forEach((num) => {
        if (num !== null && num !== undefined) {
          const numStr = String(num).trim();
          // Filter out "0", empty strings, and duplicates
          if (numStr && numStr !== '0' && !flattened.includes(numStr)) {
            flattened.push(numStr);
          }
        }
      });
    }
  });
  
  return flattened;
};

/**
 * Helper function to flatten Game 2 predictions from Excel
 * Returns all predictions as a flat array (not grouped by front number)
 * Filters out predictions that are "0" or empty
 * Preserves original Excel order and values
 * Example: [[341, 142, 214], [346, 364, 431]] -> ['341', '142', '214', '346', '364', '431']
 * Example: [['081', '142', '0'], ['346']] -> ['081', '142', '346']
 */
const flattenGame2Predictions = (predictions: (number | string)[][]): string[] => {
  return flattenPredictions(predictions);
};

// Predictions slice
const predictionsSlice = createSlice({
  name: 'predictions',
  initialState,
  reducers: {
    // Clear errors
    clearGame1Error: (state) => {
      state.game1Error = null;
    },
    clearGame2Error: (state) => {
      state.game2Error = null;
    },
    clearRecentDrawsError: (state) => {
      state.recentDrawsError = null;
    },
    // Clear all errors
    clearAllErrors: (state) => {
      state.game1Error = null;
      state.game2Error = null;
      state.recentDrawsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET GAME 1 PREDICTIONS
      .addCase(getLatestPredictionsThunk.pending, (state, action) => {
        const gameId = action.meta.arg?.gameId;
        if (gameId === 1) {
          state.game1Loading = true;
          state.game1Error = null;
        } else if (gameId === 2) {
          state.game2Loading = true;
          state.game2Error = null;
        }
      })
      .addCase(getLatestPredictionsThunk.fulfilled, (state, action) => {
        const gameId = action.meta.arg?.gameId;
        const predictions = action.payload.predictions || [];
        const status = action.payload.status;

        // Handle processing status (predictions being generated)
        if (status === 'processing') {
          if (gameId === 1) {
            state.game1Loading = false;
            state.game1Error = action.payload.message || 'Predictions are being generated. Please check back in a moment.';
            state.game1Predictions = [];
          } else if (gameId === 2) {
            state.game2Loading = false;
            state.game2Error = action.payload.message || 'Predictions are being generated. Please check back in a moment.';
            state.game2Predictions = [];
          }
          return;
        }

        if (gameId === 1) {
          // Find Game 1 prediction
          const game1Pred = predictions.find((p: Prediction) => p.gameId === 1);
          if (game1Pred && game1Pred.predictions && game1Pred.predictions.length > 0) {
            state.game1Predictions = flattenPredictions(game1Pred.predictions);
            state.game1LastUpdated = new Date().toISOString();
            state.game1Error = null;
          } else {
            // Clear predictions if not found or empty
            state.game1Predictions = [];
            state.game1LastUpdated = null;
            state.game1Error = null;
          }
          state.game1Loading = false;
        } else if (gameId === 2) {
          // Find Game 2 prediction
          const game2Pred = predictions.find((p: Prediction) => p.gameId === 2);
          if (game2Pred && game2Pred.predictions && game2Pred.predictions.length > 0) {
            // Store all predictions as flat array (Excel is single source of truth)
            state.game2Predictions = flattenGame2Predictions(game2Pred.predictions);
            state.game2LastUpdated = new Date().toISOString();
            state.game2Error = null;
          } else {
            // Clear predictions if not found or empty
            state.game2Predictions = [];
            state.game2LastUpdated = null;
            state.game2Error = null;
          }
          state.game2Loading = false;
        }
      })
      .addCase(getLatestPredictionsThunk.rejected, (state, action) => {
        const gameId = action.meta.arg?.gameId;
        const error = action.payload?.message || 'Failed to fetch predictions';

        if (gameId === 1) {
          state.game1Loading = false;
          state.game1Error = error;
        } else if (gameId === 2) {
          state.game2Loading = false;
          state.game2Error = error;
        }
      })
      // GET RECENT DRAWS
      .addCase(getDrawHistoriesThunk.pending, (state) => {
        state.recentDrawsLoading = true;
        state.recentDrawsError = null;
      })
      .addCase(getDrawHistoriesThunk.fulfilled, (state, action) => {
        state.recentDrawsLoading = false;
        // Take top 20 draws and map to RecentDraw format
        state.recentDraws = action.payload.draw_histories.slice(0, 20).map((draw) => ({
          id: draw.id,
          draw_date: draw.draw_date,
          draw_time: draw.draw_time,
          winning_numbers: draw.winning_numbers,
          prize_amount: draw.prize_amount,
          total_winners: 0, // DrawHistory doesn't include total_winners, default to 0
          state_name: draw.state_name,
          state_code: draw.state_code,
          game_name: draw.game_name,
          game_code: draw.game_code,
        }));
        state.recentDrawsLastUpdated = new Date().toISOString();
        state.recentDrawsError = null;
      })
      .addCase(getDrawHistoriesThunk.rejected, (state, action: PayloadAction<any>) => {
        state.recentDrawsLoading = false;
        state.recentDrawsError = action.payload?.message || 'Failed to fetch recent draws';
      });
  },
});

// Export actions
export const {
  clearGame1Error,
  clearGame2Error,
  clearRecentDrawsError,
  clearAllErrors,
} = predictionsSlice.actions;

// Export reducer
export default predictionsSlice.reducer;
