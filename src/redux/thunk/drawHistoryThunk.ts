/**
 * Draw History Thunks
 * Async actions for draw history management using Redux Toolkit
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/utilities/axios/instance';
import { DrawHistory, DrawHistoryFilters } from '../slice/drawHistorySlice';

interface RejectPayload {
  message: string;
}

interface GetDrawHistoriesResponse {
  draw_histories: DrawHistory[];
}

/**
 * Get draw histories thunk
 * Fetches draw histories with filters (no pagination)
 */
export const getDrawHistoriesThunk = createAsyncThunk<
  GetDrawHistoriesResponse,
  DrawHistoryFilters | undefined,
  { rejectValue: RejectPayload }
>(
  'drawHistory/getDrawHistories',
  async (filters = {}, { rejectWithValue }) => {
    try {
      // Build query parameters
      const params: Record<string, string> = {};

      if (filters.search) {
        params.search = filters.search;
      }

      if (filters.stateId) {
        params.stateId = filters.stateId.toString();
      }

      if (filters.drawTime) {
        params.drawTime = filters.drawTime;
      }
      
      if (filters.fromDate) {
        params.fromDate = filters.fromDate;
      }

      if (filters.toDate) {
        params.toDate = filters.toDate;
      }

      if (filters.sortBy) {
        params.sortBy = filters.sortBy;
      }

      if (filters.sortOrder) {
        params.sortOrder = filters.sortOrder;
      }

      const response = await apiClient.get<{
        status: string;
        message: string;
        data: GetDrawHistoriesResponse;
      }>('/draw-history', { params });

      if (response.data && response.data.data && response.data.data.draw_histories) {
        return response.data.data;
      }

      throw new Error('Invalid response format');
    } catch (error: any) {
      const message =
        typeof error.response?.data?.message === 'string'
          ? error.response.data.message
          : error.message || 'Failed to fetch draw histories';

      return rejectWithValue({ message });
    }
  }
);
