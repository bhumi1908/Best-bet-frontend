import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/utilities/axios/instance';
import { routes } from '@/utilities/routes';
import { CreateSupportPayload, Support } from '@/types/support';



export interface RejectPayload {
  message: string;
}

export const createSupportThunk = createAsyncThunk<
  Support,
  CreateSupportPayload,
  { rejectValue: RejectPayload }
>(
  'support/create',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<{
        data: { ticket: Support };
        message: string;
      }>(routes.api.support.create, payload);

      if (response.data && response.data.data?.ticket) {
        return response.data.data.ticket;
      }

      throw new Error('Invalid response format');
    } catch (error: any) {
      const message =
        typeof error.response?.data?.message === 'string'
          ? error.response.data.message
          : error.message || 'Failed to create support ticket';

      return rejectWithValue({ message });
    }
  }
);
