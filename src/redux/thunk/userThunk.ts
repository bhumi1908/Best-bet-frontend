/**
 * User Thunks
 * Async actions for user management using Redux Toolkit
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/utilities/axios/instance';
import { routes } from '@/utilities/routes';
import {
  User,
  Pagination,
  UserFilters,
  GetAllUsersResponse,
  UpdateUserPayload,
  ApiUserDetail,
} from '@/types/user';

interface RejectPayload {
  message: string;
}

/**
 * Get all users thunk
 * Fetches users with pagination and filters
 */
export const getAllUsersThunk = createAsyncThunk<
  GetAllUsersResponse,
  {
    page?: number;
    limit?: number;
    filters?: UserFilters;
  },
  { rejectValue: RejectPayload }
>(
  'user/getAllUsers',
  async ({ page = 1, limit = 10, filters = {} }, { rejectWithValue }) => {
    try {
      // Build query parameters
      const params: Record<string, string> = {
        page: page.toString(),
        limit: limit.toString(),
      };

      if (filters.role) {
        params.role = filters.role;
      }

      if (filters.isInactive !== undefined) {
        params.isInactive = filters.isInactive.toString();
      }

      if (filters.search) {
        params.search = filters.search;
      }

      if (filters.sortBy) {
        params.sortBy = filters.sortBy;
      }

      if (filters.sortOrder) {
        params.sortOrder = filters.sortOrder;
      }

      const response = await apiClient.get<{
        data: GetAllUsersResponse;
        message: string;
      }>(routes.api.user.getAll, { params });

      if (response.data && response.data.data) {
        return response.data.data;
      }

      throw new Error('Invalid response format');
    } catch (error: any) {
      const message =
        typeof error.response?.data?.message === 'string'
          ? error.response.data.message
          : error.message || 'Failed to fetch users';

      return rejectWithValue({ message });
    }
  }
);

/**
 * Get user by ID thunk
 * Fetches a single user by their ID
 */
export const getUserByIdThunk = createAsyncThunk<
  ApiUserDetail,
  number,
  { rejectValue: RejectPayload }
>(
  'user/getUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<{
        data: ApiUserDetail;
        message: string;
      }>(routes.api.user.getById(userId));

      if (response.data && response.data.data) {
        return response.data.data;
      }

      throw new Error('Invalid response format');
    } catch (error: any) {
      const message =
        typeof error.response?.data?.message === 'string'
          ? error.response.data.message
          : error.message || 'Failed to fetch user';

      return rejectWithValue({ message });
    }
  }
);

/**
 * Update user thunk
 * Updates user information
 */
export const updateUserThunk = createAsyncThunk<
  User,
  UpdateUserPayload,
  { rejectValue: RejectPayload }
>(
  'user/updateUser',
  async ({ id, ...updateData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put<{
        data: User;
        message: string;
      }>(routes.api.user.update(id), updateData);

      if (response.data && response.data.data) {
        return response.data.data;
      }

      throw new Error('Invalid response format');
    } catch (error: any) {
      const message =
        typeof error.response?.data?.message === 'string'
          ? error.response.data.message
          : error.message || 'Failed to update user';

      return rejectWithValue({ message });
    }
  }
);

