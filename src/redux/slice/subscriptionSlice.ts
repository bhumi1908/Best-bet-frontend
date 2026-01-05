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
    createCheckoutSessionThunk,
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

                    const userId = action.meta.arg;

                    state.subscriptions = state.subscriptions.map((sub) =>
                        sub.user.id === userId && sub.status === "ACTIVE"
                            ? { ...sub, status: "CANCELED" }
                            : sub
                    );

                    if (
                        state.selectedSubscription &&
                        state.selectedSubscription.user.id === userId &&
                        state.selectedSubscription.status === "ACTIVE"
                    ) {
                        state.selectedSubscription = {
                            ...state.selectedSubscription,
                            status: "CANCELED",
                        };
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

                const refundData = action.payload;
                const userId = refundData.userId;

                state.isLoading = false;
                state.error = null;
                state.refundResult = refundData;

                state.subscriptions = state.subscriptions.map((sub) =>
                    sub.user.id === userId && sub.status === "ACTIVE"
                        ? { ...sub, status: "REFUNDED" }
                        : sub
                );

                if (
                    state.selectedSubscription &&
                    state.selectedSubscription.user.id === userId &&
                    state.selectedSubscription.status === "ACTIVE"
                ) {
                    state.selectedSubscription = {
                        ...state.selectedSubscription,
                        status: "REFUNDED",
                    };
                }
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
            })
            .addCase(changeUserSubscriptionPlanAdminThunk.fulfilled, (state, action) => {

                // The backend should now return the Subscription object directly
                const updated: Subscription = action.payload;
                const userId = action.meta.arg.userId;

                state.isLoading = false;
                state.error = null;

                // Update subscriptions list
                state.subscriptions = state.subscriptions.map((sub) => {
                    if (sub.user.id !== userId) return sub;

                    return {
                        ...sub,
                        subscriptionId: updated.subscriptionId,
                        status: updated.status,
                        startDate: updated.startDate,
                        endDate: updated.endDate,
                        plan: {
                            ...sub.plan,
                            id: updated.plan.id,
                            name: updated.plan.name,
                            isActive: updated.plan.isActive,
                            price: updated.plan.price,
                            duration: updated.plan.duration,
                            description: updated.plan.description,
                            features: updated.plan.features,
                        },
                        payment: updated.payment,
                    };
                });

                if (state.selectedSubscription?.user.id === userId) {
                    state.selectedSubscription = {
                        ...state.selectedSubscription,
                        subscriptionId: updated.subscriptionId,
                        status: updated.status,
                        startDate: updated.startDate,
                        endDate: updated.endDate,
                        plan: {
                            ...state.selectedSubscription.plan,
                            id: updated.plan.id,
                            name: updated.plan.name,
                            isActive: updated.plan.isActive,
                            price: updated.plan.price,
                            duration: updated.plan.duration,
                            description: updated.plan.description,
                            features: updated.plan.features,
                        },
                        payment: updated.payment,
                    };
                }
            })
            .addCase(changeUserSubscriptionPlanAdminThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    action.payload?.message || "Failed to change subscription plan";
            })

            //Checkout
            .addCase(createCheckoutSessionThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createCheckoutSessionThunk.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(createCheckoutSessionThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    action.payload?.message || "Failed to create checkout session";
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
