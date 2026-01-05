// subscription.thunk.ts

import { ChangePlanPayload, CheckoutSessionPayload, GetAllSubscriptionsResponse, RefundResponse, Subscription, SubscriptionDashboardResponse, SubscriptionFilters } from "@/types/subscription";
import apiClient from "@/utilities/axios/instance";
import { routes } from "@/utilities/routes";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface RejectPayload {
  message: string;
}


export const getAllUserSubscriptionsAdminThunk = createAsyncThunk<
  GetAllSubscriptionsResponse,
  {
    page?: number;
    limit?: number;
    filters: SubscriptionFilters;
  },
  { rejectValue: RejectPayload }
>(
  "admin/getAllUserSubscriptions",
  async (
    {
      page = 1,
      limit = 10,
      filters
    },
    { rejectWithValue }
  ) => {
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: String(limit),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder === "ascend" ? "asc" : "desc",
      };

      // add filters
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (typeof filters.planId === "number") params.planId = String(filters.planId);
      if (filters.plan) params.plan = filters.plan;
      if (filters.startDateFrom instanceof Date) params.startDateFrom = filters.startDateFrom.toISOString();
      if (filters.startDateTo instanceof Date) params.startDateTo = filters.startDateTo.toISOString();

      const response = await apiClient.get<{
        data: GetAllSubscriptionsResponse;
        message: string;
      }>(routes.api.subscription.admin.getAll, { params });

      if (!response.data?.data) {
        throw new Error("Invalid response format");
      }

      return response.data.data;
    } catch (error: any) {
      const message =
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : error.message || "Failed to fetch subscribed users";

      return rejectWithValue({ message });
    }
  }
);


export const getSubscriptionDetailsAdminThunk = createAsyncThunk<
  Subscription,
  number,
  { rejectValue: RejectPayload }
>(
  "admin/getSubscriptionDetails",
  async (subscriptionId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<{
        data: {
          subscription: Subscription;
        };
        message: string;
      }>(
        `${routes.api.subscription.admin.getSubscriptionDetails(subscriptionId)}`
      );

      if (
        response.data &&
        response.data.data &&
        response.data.data.subscription
      ) {
        return response.data.data.subscription;
      }

      throw new Error("Invalid response format");
    } catch (error: any) {
      const message =
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : error.message || "Failed to fetch subscription details";

      return rejectWithValue({ message });
    }
  }
);


export const getSubscriptionDashboardAdminThunk = createAsyncThunk<
  SubscriptionDashboardResponse,
  void,
  { rejectValue: RejectPayload }
>(
  "admin/getSubscriptionDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<{
        data: SubscriptionDashboardResponse;
        message: string;
      }>(
        routes.api.subscription.admin.dashboard
      );

      if (response.data?.data) {
        return response.data.data;
      }

      throw new Error("Invalid dashboard response format");
    } catch (error: any) {
      const message =
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : error.message || "Failed to fetch subscription dashboard";

      return rejectWithValue({ message });
    }
  }
);

export const revokeUserSubscriptionAdminThunk = createAsyncThunk<
  { message: string },
  number,
  { rejectValue: RejectPayload }
>(
  "admin/revokeUserSubscription",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<{ message: string }>(
        routes.api.subscription.admin.revokeSubscription(userId)
      );

      if (!response.data?.message) {
        throw new Error("Invalid response from server");
      }

      return { message: response.data.message };
    } catch (error: any) {
      const message =
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : error.message || "Failed to revoke subscription";

      return rejectWithValue({ message });
    }
  }
);

export const refundSubscriptionPaymentAdminThunk = createAsyncThunk<
  RefundResponse,
  { paymentIntentId: string; amount: number; reason?: string },
  { rejectValue: RejectPayload }
>(
  "admin/refundSubscriptionPayment",
  async ({ paymentIntentId, amount, reason }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<RefundResponse>(
        routes.api.subscription.admin.refundSubscription(paymentIntentId),
        { amount, reason }
      );

      if (!response.data) {
        throw new Error("Invalid refund response from server");
      }

      return response.data.data;
    } catch (error: any) {
      const message =
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : error.message || "Failed to process refund";

      return rejectWithValue({ message });
    }
  }
);


export const changeUserSubscriptionPlanAdminThunk = createAsyncThunk<
  Subscription,
  ChangePlanPayload,
  { rejectValue: RejectPayload }
>(
  "admin/changeUserSubscriptionPlan",
  async ({ userId, newPlanId }, { rejectWithValue }) => {
    try {

      const response = await apiClient.post(
        routes.api.subscription.admin.changePlanSubscription(userId),
        { newPlanId }
      );

      if (!response.data) {
        throw new Error("Invalid response from server");
      }
      return response.data.data;
    } catch (error: any) {
      const message =
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : error.message || "Failed to change subscription plan";

      return rejectWithValue({ message });
    }
  }
);

//Checkout
export const createCheckoutSessionThunk = createAsyncThunk<
  CheckoutSessionPayload,
  number,
  { rejectValue: CheckoutSessionPayload }
>(
  "subscription/createCheckoutSession",
  async (planId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<{
        data: { url?: string; trialActivated?: boolean; message?: string };
        message: string;
      }>(
        routes.api.subscription.checkout,
        { planId }
      );

      return response.data.data;
    } catch (error: any) {
      const message =
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : error.message || "Failed to create checkout session";

      return rejectWithValue({ message });
    }
  }
);

