import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    AdminSubscriptionState,
    GetAllSubscriptionsResponse,
    Pagination,
    Subscription,
    AdminSubscriptionUIFilters,
    SubscriptionDashboardResponse,
} from "@/types/subscription";
import {
    getAllUserSubscriptionsAdminThunk,
    getSubscriptionDashboardAdminThunk,
    getSubscriptionDetailsAdminThunk,
} from "../thunk/subscriptionThunk";

const initialState: AdminSubscriptionState = {
    isLoading: false,
    error: null,
    subscriptions: [],
    selectedSubscription: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    },
    filters: {
        search: "",
        status: "all",
        planId: "all",
        startDateFrom: null,
        startDateTo: null,
        sortBy: "createdAt",
        sortOrder: "descend",
    },
    stats: null,
    charts: null,
};

const adminSubscriptionSlice = createSlice({
    name: "adminSubscriptions",
    initialState,
    reducers: {
        clearError(state) {
            state.error = null;
        },

        setFilters(
            state,
            action: PayloadAction<Partial<AdminSubscriptionUIFilters>>
        ) {
            state.filters = {
                ...state.filters,
                ...action.payload,
            };
            state.pagination.page = 1;
        },

        resetFilters(state) {
            state.filters = initialState.filters;
            state.pagination.page = 1;
        },

        setPagination(state, action: PayloadAction<Partial<Pagination>>) {
            state.pagination = {
                ...state.pagination,
                ...action.payload,
            };
        },

        clearSelectedSubscription(state) {
            state.selectedSubscription = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get all subscriptions
            .addCase(getAllUserSubscriptionsAdminThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                getAllUserSubscriptionsAdminThunk.fulfilled,
                (state, action: PayloadAction<GetAllSubscriptionsResponse>) => {
                    console.log('action.payload', action.payload)
                    state.isLoading = false;
                    state.subscriptions = action.payload.subscriptions;
                    state.pagination = action.payload.pagination;
                }
            )
            .addCase(
                getAllUserSubscriptionsAdminThunk.rejected,
                (state, action) => {
                    state.isLoading = false;
                    state.error =
                        action.payload?.message || "Failed to fetch subscribed users";
                }
            )

            // Get subscription details
            .addCase(getSubscriptionDetailsAdminThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                getSubscriptionDetailsAdminThunk.fulfilled,
                (state, action: PayloadAction<Subscription>) => {
                    state.isLoading = false;
                    state.selectedSubscription = action.payload;
                }
            )
            .addCase(
                getSubscriptionDetailsAdminThunk.rejected,
                (state, action) => {
                    state.isLoading = false;
                    state.selectedSubscription = null;
                    state.error =
                        action.payload?.message ||
                        "Failed to fetch subscription details";
                }
            )

            // Subscription Dashboard
            .addCase(getSubscriptionDashboardAdminThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })

            .addCase(
                getSubscriptionDashboardAdminThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<SubscriptionDashboardResponse>
                ) => {
                    state.isLoading = false;
                    state.stats = action.payload.stats;
                    state.charts = action.payload.charts;
                }
            )

            .addCase(getSubscriptionDashboardAdminThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    action.payload?.message ||
                    "Failed to load subscription dashboard";
            });
    },
});

export const {
    clearError,
    setFilters,
    resetFilters,
    setPagination,
    clearSelectedSubscription,
} = adminSubscriptionSlice.actions;

export default adminSubscriptionSlice.reducer;
