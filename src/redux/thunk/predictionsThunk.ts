/**
 * Predictions Thunks
 * Async actions for predictions management using Redux Toolkit
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/utilities/axios/instance';
import { routes } from '@/utilities/routes';

interface RejectPayload {
  message: string;
}

export interface PredictionResponse {
  gameId: number;
  predictions: number[][];
  date: Date | string;
}

interface GetLatestPredictionsResponse {
  predictions: PredictionResponse[];
  status?: 'processing' | 'completed';
  jobId?: string;
  message?: string;
}

interface GetLatestPredictionsParams {
  gameId?: 1 | 2; // Optional gameId filter
}

/**
 * Get latest predictions thunk
 * Fetches latest predictions for a specific game or all games
 */
export const getLatestPredictionsThunk = createAsyncThunk<
  GetLatestPredictionsResponse,
  GetLatestPredictionsParams | undefined,
  { rejectValue: RejectPayload }
>(
  'predictions/getLatestPredictions',
  async (params = {}, { rejectWithValue }) => {
    try {
      // Build query parameters
      const queryParams: Record<string, string> = {};

      if (params.gameId !== undefined) {
        queryParams.gameId = params.gameId.toString();
      }

      const response = await apiClient.get<{
        status: string;
        message: string;
        data: GetLatestPredictionsResponse;
      }>(routes.api.predictions.latest, {
        params: queryParams,
      });

      if (response.data && response.data.data) {
        // Handle processing status (when predictions are being generated)
        if (response.data.data.status === 'processing') {
          // Return empty predictions with processing status
          return {
            predictions: [],
            status: 'processing',
            jobId: response.data.data.jobId,
            message: response.data.data.message,
          };
        }
        
        // Return predictions if available
        if (response.data.data.predictions) {
          return response.data.data;
        }
      }

      throw new Error('Invalid response format');
    } catch (error: any) {
      const message =
        typeof error.response?.data?.message === 'string'
          ? error.response.data.message
          : error.message || 'Failed to fetch predictions';

      return rejectWithValue({ message });
    }
  }
);
