/**
 * Proof of Performance Thunks
 * Async actions for proof of performance management using Redux Toolkit
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/utilities/axios/instance';
import { routes } from '@/utilities/routes';
import { ProofOfPerformanceItem } from '../slice/proofOfPerformanceSlice';

interface RejectPayload {
  message: string;
}

interface GetProofOfPerformanceResponse {
  proofOfPerformance: ProofOfPerformanceItem[];
}

/**
 * Get proof of performance thunk
 * Fetches proof of performance data for all states
 */
export const getProofOfPerformanceThunk = createAsyncThunk<
  ProofOfPerformanceItem[],
  void,
  { rejectValue: RejectPayload }
>(
  'proofOfPerformance/getProofOfPerformance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<{
        data: GetProofOfPerformanceResponse;
        message: string;
      }>(routes.api.predictions.proofOfPerformance);

      if (response.data && response.data.data && response.data.data.proofOfPerformance) {
        return response.data.data.proofOfPerformance;
      }

      throw new Error('Invalid response format');
    } catch (error: any) {
      const message =
        typeof error.response?.data?.message === 'string'
          ? error.response.data.message
          : error.message || 'Failed to fetch proof of performance';

      return rejectWithValue({ message });
    }
  }
);
