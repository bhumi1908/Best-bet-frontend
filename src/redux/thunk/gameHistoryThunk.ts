/**
 * Game History Thunks
 * Async actions for game history management using Redux Toolkit
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/utilities/axios/instance';
import { routes } from '@/utilities/routes';
import {
  GameHistory,
  GetGameHistoriesResponse,
  CreateGameHistoryPayload,
  UpdateGameHistoryPayload,
  GameHistoryFilters,
} from '@/types/gameHistory';

interface RejectPayload {
  message: string;
}

/**
 * Get all game histories thunk
 * Fetches game histories with pagination and filters
 */
export const getAllGameHistoriesThunk = createAsyncThunk<
  GetGameHistoriesResponse,
  {
    page?: number;
    limit?: number;
    filters?: GameHistoryFilters;
  },
  { rejectValue: RejectPayload }
>(
  'gameHistory/getAllGameHistories',
  async ({ page = 1, limit = 10, filters = {} }, { rejectWithValue }) => {
    try {
      // Build query parameters
      const params: Record<string, string> = {
        page: page.toString(),
        limit: limit.toString(),
      };

      if (filters.search) {
        params.search = filters.search;
      }

      if (filters.result) {
        params.result = filters.result;
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
        data: GetGameHistoriesResponse;
        message: string;
      }>(routes.api.gameHistory.getAll, { params });

      if (response.data && response.data.data) {
        return response.data.data;
      }

      throw new Error('Invalid response format');
    } catch (error: any) {
      const message =
        typeof error.response?.data?.message === 'string'
          ? error.response.data.message
          : error.message || 'Failed to fetch game histories';

      return rejectWithValue({ message });
    }
  }
);

/**
 * Get game history by ID thunk
 * Fetches a single game history by its ID
 */
export const getGameHistoryByIdThunk = createAsyncThunk<
  GameHistory,
  number,
  { rejectValue: RejectPayload }
>(
  'gameHistory/getGameHistoryById',
  async (gameHistoryId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<{
        data: GameHistory;
        message: string;
      }>(routes.api.gameHistory.getById(gameHistoryId));

      if (response.data && response.data.data) {
        return response.data.data;
      }

      throw new Error('Invalid response format');
    } catch (error: any) {
      const message =
        typeof error.response?.data?.message === 'string'
          ? error.response.data.message
          : error.message || 'Failed to fetch game history';

      return rejectWithValue({ message });
    }
  }
);

/**
 * Create game history thunk
 * Creates a new game history entry
 */
export const createGameHistoryThunk = createAsyncThunk<
  GameHistory,
  CreateGameHistoryPayload,
  { rejectValue: RejectPayload }
>(
  'gameHistory/createGameHistory',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<{
        data: GameHistory;
        message: string;
      }>(routes.api.gameHistory.create, payload);

      if (response.data && response.data.data) {
        return response.data.data;
      }

      throw new Error('Invalid response format');
    } catch (error: any) {
      const message =
        typeof error.response?.data?.message === 'string'
          ? error.response.data.message
          : error.message || 'Failed to create game history';

      return rejectWithValue({ message });
    }
  }
);

/**
 * Update game history thunk
 * Updates an existing game history entry
 */
export const updateGameHistoryThunk = createAsyncThunk<
  GameHistory,
  { id: number; data: UpdateGameHistoryPayload },
  { rejectValue: RejectPayload }
>(
  'gameHistory/updateGameHistory',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put<{
        data: GameHistory;
        message: string;
      }>(routes.api.gameHistory.update(id), data);

      if (response.data && response.data.data) {
        return response.data.data;
      }

      throw new Error('Invalid response format');
    } catch (error: any) {
      const message =
        typeof error.response?.data?.message === 'string'
          ? error.response.data.message
          : error.message || 'Failed to update game history';

      return rejectWithValue({ message });
    }
  }
);

/**
 * Delete game history thunk
 * Deletes a game history entry by ID
 */
export const deleteGameHistoryThunk = createAsyncThunk<
  number,
  number,
  { rejectValue: RejectPayload }
>(
  'gameHistory/deleteGameHistory',
  async (gameHistoryId, { rejectWithValue }) => {
    try {
      await apiClient.delete<{
        data: null;
        message: string;
      }>(routes.api.gameHistory.delete(gameHistoryId));

      return gameHistoryId;
    } catch (error: any) {
      const message =
        typeof error.response?.data?.message === 'string'
          ? error.response.data.message
          : error.message || 'Failed to delete game history';

      return rejectWithValue({ message });
    }
  }
);
