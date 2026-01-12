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
    cancelScheduledPlanChangeThunk,
    changeUserSubscriptionPlanAdminThunk,
    changeUserSubscriptionPlanSelfThunk,
    createCheckoutSessionThunk,
    getAllUserSubscriptionsAdminThunk,
    getSubscriptionDashboardAdminThunk,
    getSubscriptionDetailsAdminThunk,
    getUserSubscriptionSelfThunk,
    refundSubscriptionPaymentAdminThunk,
    revokeUserSubscriptionAdminThunk,
    revokeUserSubscriptionSelfThunk,
} from "../thunk/subscriptionThunk";
import { RejectPayload } from "../thunk/supportThunk";
import {
    toggleSubscriptionPlanStatusThunk,
    createSubscriptionPlanThunk,
    deleteSubscriptionPlanThunk,
    updateSubscriptionPlanThunk,
} from "../thunk/subscriptionPlanThunk";
import { RootState } from "../store/rootReducer";

const initialState: AdminSubscriptionState = {
    isLoading: false,
    checkoutUrl: null,
    error: null,
    subscriptions: [],
    selectedSubscription: null,
    currentSubscription: null,
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
    successMessage: null
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
        setCheckoutUrl: (state, action: PayloadAction<string | null>) => {
            state.checkoutUrl = action.payload;
        },

        clearSubscriptionSuccess: (state) => {
            state.successMessage = null;
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

            // Get user subscription
            .addCase(getUserSubscriptionSelfThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                getUserSubscriptionSelfThunk.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = false;
                    if (action.payload) {
                        // Show subscription if it's ACTIVE, TRIAL, or CANCELED (but not yet expired)
                        // CANCELED subscriptions should still be shown until endDate passes
                        const now = new Date();
                        const endDate = action.payload.endDate ? new Date(action.payload.endDate) : null;
                        const isNotExpired = !endDate || endDate > now;
                        
                        if (action.payload.status === 'ACTIVE' || 
                            action.payload.status === 'TRIAL') {
                            state.currentSubscription = action.payload;
                        } else {
                            state.currentSubscription = null;
                        }
                    } else {
                        state.currentSubscription = null;
                    }
                }
            )
            .addCase(getUserSubscriptionSelfThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Failed to fetch subscription";
            })

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

            // Update dashboard stats when plan status is toggled
            .addCase(
                toggleSubscriptionPlanStatusThunk.fulfilled,
                (state, action: PayloadAction<{ id: number; isActive: boolean; previousIsActive: boolean }>) => {
                    if (state.stats) {
                        const { isActive, previousIsActive } = action.payload;
                        
                        // Only update if the status actually changed
                        if (isActive !== previousIsActive) {
                            if (isActive && !previousIsActive) {
                                // Plan was activated: increment activePlans
                                state.stats.activePlans = (state.stats.activePlans || 0) + 1;
                            } else if (!isActive && previousIsActive) {
                                // Plan was deactivated: decrement activePlans
                                state.stats.activePlans = Math.max(0, (state.stats.activePlans || 0) - 1);
                            }
                        }
                    }
                }
            )

            // Update dashboard stats when a plan is created
            .addCase(
                createSubscriptionPlanThunk.fulfilled,
                (state, action: PayloadAction<any>) => {
                    if (state.stats) {
                        // Increment total plans
                        state.stats.totalPlans = (state.stats.totalPlans || 0) + 1;
                        
                        // If the new plan is active, increment active plans
                        if (action.payload.isActive) {
                            state.stats.activePlans = (state.stats.activePlans || 0) + 1;
                        }
                    }
                }
            )

            // Update dashboard stats when a plan is updated (if isActive status changed)
            .addCase(
                updateSubscriptionPlanThunk.fulfilled,
                (state, action: PayloadAction<any>) => {
                    if (state.stats && action.payload.previousIsActive !== undefined) {
                        const { isActive, previousIsActive } = action.payload;
                        
                        // Only update if the status actually changed
                        if (isActive !== previousIsActive) {
                            if (isActive && !previousIsActive) {
                                // Plan was activated: increment activePlans
                                state.stats.activePlans = (state.stats.activePlans || 0) + 1;
                            } else if (!isActive && previousIsActive) {
                                // Plan was deactivated: decrement activePlans
                                state.stats.activePlans = Math.max(0, (state.stats.activePlans || 0) - 1);
                            }
                        }
                    }
                }
            )

            // Update dashboard stats when a plan is deleted
            .addCase(
                deleteSubscriptionPlanThunk.fulfilled,
                (state, action: PayloadAction<{ id: number | string; wasActive: boolean }>) => {
                    if (state.stats) {
                        // Decrement total plans
                        state.stats.totalPlans = Math.max(0, (state.stats.totalPlans || 0) - 1);
                        
                        // If the deleted plan was active, decrement active plans
                        if (action.payload.wasActive) {
                            state.stats.activePlans = Math.max(0, (state.stats.activePlans || 0) - 1);
                        }
                    }
                }
            )

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
                        sub.user.id === userId && (sub.status === "ACTIVE" || sub.status === "TRIAL")
                            ? { ...sub, status: "CANCELED" }
                            : sub
                    );

                    if (
                        state.selectedSubscription &&
                        state.selectedSubscription.user.id === userId &&
                        (state.selectedSubscription.status === "ACTIVE" || state.selectedSubscription.status === "TRIAL")
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

            // REVOKE SUBSCRIPTION (SELF)
            .addCase(revokeUserSubscriptionSelfThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(revokeUserSubscriptionSelfThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                // Keep CANCELED subscription visible until it expires
                if (action.payload) {
                    state.currentSubscription = action.payload;
                }
                state.successMessage = "Subscription cancellation scheduled";
            })
            .addCase(revokeUserSubscriptionSelfThunk.rejected, (state, action: PayloadAction<RejectPayload | undefined>) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Failed to revoke subscription";
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

            // CHANGE PLAN (SELF)
            .addCase(changeUserSubscriptionPlanSelfThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(changeUserSubscriptionPlanSelfThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                if (action.payload) {
                    state.currentSubscription = action.payload;
                }
                state.successMessage = action.payload?.message || "Plan change scheduled successfully";
            })
            .addCase(changeUserSubscriptionPlanSelfThunk.rejected, (state, action: PayloadAction<RejectPayload | undefined>) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Failed to change subscription plan";
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

            // Cancel scheduled plan change
            .addCase(cancelScheduledPlanChangeThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                cancelScheduledPlanChangeThunk.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = false;
                    if (action.payload) {
                        state.currentSubscription = action.payload;
                    }
                    state.successMessage = "Scheduled plan change cancelled";
                }
            )
            .addCase(cancelScheduledPlanChangeThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Failed to cancel scheduled change";
            })

            //Checkout
            .addCase(createCheckoutSessionThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createCheckoutSessionThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.checkoutUrl = action.payload.url;

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
    clearSubscriptionSuccess,
    setCheckoutUrl
} = adminSubscriptionSlice.actions;

export default adminSubscriptionSlice.reducer;
