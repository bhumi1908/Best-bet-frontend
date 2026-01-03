import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/utilities/axios/instance';
import { routes } from '@/utilities/routes';
import { SubscriptionPlan, SubscriptionPlanPayload } from '@/types/subscriptionPlan';

export interface RejectPayload {
  message: string;
}

//GET ALL PLAN FOR USERS
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

// GET ALL PLAN FOR ADMIN
export const getAllSubscriptionPlansAdminThunk = createAsyncThunk<
  SubscriptionPlan[],
  void,
  { rejectValue: RejectPayload }
>(
  'subscriptionPlan/admin/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<{
        data: { plans: SubscriptionPlan[] };
        message: string;
      }>(routes.api.subscriptionPlan.admin.getAll);

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

// GET By PLANID FOR ADMIN
export const getSubscriptionPlansByIdAdminThunk = createAsyncThunk<
  SubscriptionPlan,
  { id: number | string },
  { rejectValue: RejectPayload }
>(
  'subscriptionPlan/admin/getById',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<{
        data: { plan: SubscriptionPlan };
        message: string;
      }>(routes.api.subscriptionPlan.admin.getByPlanId(id));

      if (response.data && response.data.data.plan) {
        return response.data.data.plan;
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

// CREATE PLAN FOR ADMIN
export const createSubscriptionPlanThunk = createAsyncThunk<
  SubscriptionPlan,
  SubscriptionPlanPayload,
  { rejectValue: RejectPayload }
>(
  'subscriptionPlan/admin/create',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<{
        data: { plan: SubscriptionPlan };
        message: string;
      }>(routes.api.subscriptionPlan.admin.create, payload);

      if (response.data && response.data.data?.plan) {
        return response.data.data.plan;
      }

      throw new Error('Invalid response format');
    } catch (error: any) {
      const message =
        typeof error.response?.data?.message === 'string'
          ? error.response.data.message
          : error.message || 'Failed to create subscription plan';

      return rejectWithValue({ message });
    }
  }
);

// EDIT PLAN FOR ADMIN
export const updateSubscriptionPlanThunk = createAsyncThunk<
  SubscriptionPlan,
  { id: number | string; payload: SubscriptionPlanPayload },
  { rejectValue: RejectPayload }
>(
  'subscriptionPlan/admin/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put<{
        data: { plan: SubscriptionPlan };
        message: string;
      }>(routes.api.subscriptionPlan.admin.update(id), payload);

      if (response.data && response.data.data?.plan) {
        return response.data.data.plan;
      }

      throw new Error('Invalid response format');
    } catch (error: any) {
      const message =
        typeof error.response?.data?.message === 'string'
          ? error.response.data.message
          : error.message || 'Failed to update subscription plan';

      return rejectWithValue({ message });
    }
  }
);

// TOGGLE PLAN ACTIVE / INACTIVE (ADMIN)
export const toggleSubscriptionPlanStatusThunk = createAsyncThunk<
  { id: number; isActive: boolean },
  number,
  { rejectValue: RejectPayload }
>(
  'subscriptionPlan/admin/toggleStatus',
  async (planId, { rejectWithValue }) => {
    try {
      const response = await apiClient.put<{
        data: { isActive: boolean };
        message: string;
      }>(routes.api.subscriptionPlan.admin.updateStatus(planId));


      if (response.data?.data?.isActive !== undefined) {
        return {
          id: planId,
          isActive: response.data.data.isActive,
        };
      }

      throw new Error('Invalid response format');
    } catch (error: any) {
      const message =
        typeof error.response?.data?.message === 'string'
          ? error.response.data.message
          : error.message || 'Failed to update plan status';

      return rejectWithValue({ message });
    }
  }
);


// DELETE PLAN FOR ADMIN
export const deleteSubscriptionPlanThunk = createAsyncThunk<
  number | string,
  number | string,
  { rejectValue: RejectPayload }
>(
  'subscriptionPlan/admin/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete<{
        message: string;
      }>(routes.api.subscriptionPlan.admin.delete(id));

      if (response.status === 200) {
        return id;
      }

      throw new Error('Invalid response');
    } catch (error: any) {
      const message =
        typeof error.response?.data?.message === 'string'
          ? error.response.data.message
          : error.message || 'Failed to delete subscription plan';

      return rejectWithValue({ message });
    }
  }
);

