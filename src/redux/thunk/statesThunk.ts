/**
 * States Thunks
 * Async actions for states management using Redux Toolkit
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/utilities/axios/instance';
import { routes } from '@/utilities/routes';
import { GetStatesResponse } from '@/types/gameHistory';

interface RejectPayload {
  message: string;
}

/**
 * Get all states thunk
 * Fetches all active states
 */
export const getAllStatesThunk = createAsyncThunk<
  GetStatesResponse,
  void,
  { rejectValue: RejectPayload }
>(
  'states/getAllStates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<{
        data: GetStatesResponse;
        message: string;
      }>(routes.api.states.getAll);

      if (response.data && response.data.data) {
        return response.data.data;
      }

      throw new Error('Invalid response format');
    } catch (error: any) {
      const message =
        typeof error.response?.data?.message === 'string'
          ? error.response.data.message
          : error.message || 'Failed to fetch states';

      return rejectWithValue({ message });
    }
  }
);
