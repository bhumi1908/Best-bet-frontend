/**
 * Game Types Thunks
 * Async actions for game types management using Redux Toolkit
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/utilities/axios/instance';
import { routes } from '@/utilities/routes';
import { GetGameTypesResponse } from '@/types/gameHistory';

interface RejectPayload {
  message: string;
}

/**
 * Get all game types thunk
 * Fetches all active game types
 */
export const getAllGameTypesThunk = createAsyncThunk<
  GetGameTypesResponse,
  void,
  { rejectValue: RejectPayload }
>(
  'gameTypes/getAllGameTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<{
        data: GetGameTypesResponse;
        message: string;
      }>(routes.api.gameTypes.getAll);

      if (response.data && response.data.data) {
        return response.data.data;
      }

      throw new Error('Invalid response format');
    } catch (error: any) {
      const message =
        typeof error.response?.data?.message === 'string'
          ? error.response.data.message
          : error.message || 'Failed to fetch game types';

      return rejectWithValue({ message });
    }
  }
);
