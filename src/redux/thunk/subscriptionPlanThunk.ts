import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/utilities/axios/instance';
import { routes } from '@/utilities/routes';
import { SubscriptionPlan } from '@/types/subscriptionPlan';

export interface RejectPayload {
  message: string;
}

export const getAllSubscriptionPlansThunk = createAsyncThunk<
  SubscriptionPlan[],
  void,
  { rejectValue: RejectPayload }
>(
  'subscriptionPlan/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<{
        data: { plans: SubscriptionPlan[] };
        message: string;
      }>(routes.api.subscriptionPlan.getAll);

      if (response.data && response.data.data?.plans) {
        return response.data.data.plans;
      }

      throw new Error('Invalid response format');
    } catch (error: any) {
      const message =
        typeof error.response?.data?.message === 'string'
          ? error.response.data.message
          : error.message || 'Failed to fetch subscription plans';

      return rejectWithValue({ message });
    }
  }
);
