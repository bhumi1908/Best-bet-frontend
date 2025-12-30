// subscription.thunk.ts

import { GetAllSubscriptionsResponse, Subscription, SubscriptionFilters } from "@/types/subscription";
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
    filters?: SubscriptionFilters;
    sortBy?: string;
    sortOrder?: "asc" | "desc" | "ascend" | "descend";
  },
  { rejectValue: RejectPayload }
>(
  "admin/getAllUserSubscriptions",
  async (
    {
      page = 1,
      limit = 10,
      filters = {},
      sortBy = "createdAt",
      sortOrder = "desc",
    },
    { rejectWithValue }
  ) => {
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: String(limit),
        sortBy,
        sortOrder:
          sortOrder === "ascend"
            ? "asc"
            : sortOrder === "descend"
              ? "desc"
              : sortOrder,
      };

      // Filters
      if (filters.search) {
        params.search = filters.search;
      }

      if (filters.status) {
        params.status = filters.status;
      }

      if (typeof filters.planId === "number") {
        params.planId = String(filters.planId);
      }

      if (filters.plan) {
        params.plan = filters.plan;
      }

      if (filters.startDateFrom instanceof Date) {
        params.startDateFrom = filters.startDateFrom.toISOString();
      }

      if (filters.startDateTo instanceof Date) {
        params.startDateTo = filters.startDateTo.toISOString();
      }

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
