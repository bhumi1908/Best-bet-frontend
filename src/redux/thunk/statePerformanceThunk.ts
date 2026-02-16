/**
 * State Performance Thunks
 * Async actions for state performance management using Redux Toolkit
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/utilities/axios/instance';
import { routes } from '@/utilities/routes';
import { StatePerformanceData } from '@/types/gameHistory';

interface RejectPayload {
  message: string;
}

interface GetStatePerformanceParams {
  state: string;
  gameId?: number;
}

/**
 * Get state performance thunk
 * Fetches state performance data for a specific state
 */
export const getStatePerformanceThunk = createAsyncThunk<
  StatePerformanceData,
  GetStatePerformanceParams,
  { rejectValue: RejectPayload }
>(
  'statePerformance/getStatePerformance',
  async ({ state, gameId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<{
        data: StatePerformanceData;
        message: string;
      }>(routes.api.statePerformance.get(state, gameId));

      if (response.data && response.data.data) {
        return response.data.data;
      }

      throw new Error('Invalid response format');
    } catch (error: any) {
      const message =
        typeof error.response?.data?.message === 'string'
          ? error.response.data.message
          : error.message || 'Failed to fetch state performance';

      return rejectWithValue({ message });
    }
  }
);
