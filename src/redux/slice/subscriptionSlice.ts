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
    changeUserSubscriptionPlanAdminThunk,
    getAllUserSubscriptionsAdminThunk,
    getSubscriptionDashboardAdminThunk,
    getSubscriptionDetailsAdminThunk,
    refundSubscriptionPaymentAdminThunk,
    revokeUserSubscriptionAdminThunk,
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
    refundResult: null,
    lastChangedSubscription: null
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
            })

            //Revoke subscriptions
            .addCase(revokeUserSubscriptionAdminThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                revokeUserSubscriptionAdminThunk.fulfilled,
                (state, action) => {
                    state.isLoading = false;
                    state.error = null;

                    if (state.subscriptions.length) {
                        state.subscriptions = state.subscriptions.map((sub) =>
                            sub.status === "ACTIVE"
                                && sub.user.id === action.meta.arg
                                ? { ...sub, status: "CANCELED" }
                                : sub
                        );
                    }
                }
            )
            .addCase(revokeUserSubscriptionAdminThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Failed to revoke subscription";
            })

            // Refund the subscription
            .addCase(refundSubscriptionPaymentAdminThunk
                .pending, (state) => {
                    state.isLoading = true;
                    state.error = null;
                    state.refundResult = null;
                })
            .addCase(refundSubscriptionPaymentAdminThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.refundResult = action.payload;
            })
            .addCase(refundSubscriptionPaymentAdminThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Failed to process refund";
                state.refundResult = null;
            })

            // Change user subscription plan
            .addCase(changeUserSubscriptionPlanAdminThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.lastChangedSubscription = null;
            })
            .addCase(changeUserSubscriptionPlanAdminThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.lastChangedSubscription = action.payload;

                // Update subscription in subscriptions list if exists
                state.subscriptions = state.subscriptions.map((sub) =>
                    sub.user.id === action.payload.user.id ? action.payload : sub
                );

                // Update selected subscription if currently selected
                if (state.selectedSubscription?.user.id === action.payload.user.id) {
                    state.selectedSubscription = action.payload;
                }
            })
            .addCase(changeUserSubscriptionPlanAdminThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    action.payload?.message || "Failed to change subscription plan";
                state.lastChangedSubscription = null;
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
