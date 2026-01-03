import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSubscriptionPlanThunk, deleteSubscriptionPlanThunk, getAllSubscriptionPlansAdminThunk, getAllSubscriptionPlansThunk, getSubscriptionPlansByIdAdminThunk, RejectPayload, toggleSubscriptionPlanStatusThunk, updateSubscriptionPlanThunk } from '../thunk/subscriptionPlanThunk';
import { SubscriptionPlan, SubscriptionPlanState } from '@/types/subscriptionPlan';

const initialState: SubscriptionPlanState = {
    plans: [],
    planById: null,
    isLoading: false,
    error: null,
};

const subscriptionPlanSlice = createSlice({
    name: 'subscriptionPlan',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        cleanPlanById: (state) => {
            state.planById = null;
        },
        togglePlanActiveStatus: (state, action: PayloadAction<number | string>) => {
            const plan = state.plans.find((p) => p.id === action.payload);
            if (plan) plan.isActive = !plan.isActive;
        },
    },
    extraReducers: (builder) => {
        builder

            // GET ALL PLAN FOR USERS
            .addCase(getAllSubscriptionPlansThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                getAllSubscriptionPlansThunk.fulfilled,
                (state, action: PayloadAction<SubscriptionPlan[]>) => {
                    state.isLoading = false;
                    state.plans = action.payload;
                    state.error = null;
                }
            )
            .addCase(
                getAllSubscriptionPlansThunk.rejected,
                (state, action: PayloadAction<RejectPayload | any>) => {
                    state.isLoading = false;
                    state.error = action.payload?.message || 'Failed to fetch subscription plans';
                }
            )

            // GET ALL PLAN FOR ADMIN
            .addCase(getAllSubscriptionPlansAdminThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                getAllSubscriptionPlansAdminThunk.fulfilled,
                (state, action: PayloadAction<SubscriptionPlan[]>) => {
                    state.isLoading = false;
                    state.plans = action.payload;
                }
            )
            .addCase(
                getAllSubscriptionPlansAdminThunk.rejected,
                (state, action: PayloadAction<RejectPayload | any>) => {
                    state.isLoading = false;
                    state.error = action.payload?.message || 'Failed to fetch subscription plans';
                }
            )

            // GET By Id PLAN FOR ADMIN
            .addCase(getSubscriptionPlansByIdAdminThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                getSubscriptionPlansByIdAdminThunk.fulfilled,
                (state, action: PayloadAction<SubscriptionPlan>) => {
                    state.isLoading = false;
                    state.planById = action.payload;
                }
            )
            .addCase(
                getSubscriptionPlansByIdAdminThunk.rejected,
                (state, action: PayloadAction<RejectPayload | any>) => {
                    state.isLoading = false;
                    state.error = action.payload?.message || 'Failed to fetch subscription plans';
                    state.planById = null;
                }
            )

            // CREATE PLAN 
            .addCase(createSubscriptionPlanThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                createSubscriptionPlanThunk.fulfilled,
                (state, action: PayloadAction<SubscriptionPlan>) => {
                    state.isLoading = false;
                    state.plans.unshift(action.payload);
                }
            )
            .addCase(
                createSubscriptionPlanThunk.rejected,
                (state, action: PayloadAction<RejectPayload | any>) => {
                    state.isLoading = false;
                    state.error = action.payload?.message || 'Failed to create subscription plan';
                }
            )

            //EDIT PLAN 
            .addCase(updateSubscriptionPlanThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                updateSubscriptionPlanThunk.fulfilled,
                (state, action: PayloadAction<SubscriptionPlan>) => {
                    state.isLoading = false;
                    const index = state.plans.findIndex((plan) => plan.id === action.payload.id);
                    if (index !== -1) state.plans[index] = action.payload;
                }
            )
            .addCase(
                updateSubscriptionPlanThunk.rejected,
                (state, action: PayloadAction<RejectPayload | any>) => {
                    state.isLoading = false;
                    state.error = action.payload?.message || 'Failed to update subscription plan';
                }
            )

            // TOGGLE PLAN STATUS
            .addCase(toggleSubscriptionPlanStatusThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                toggleSubscriptionPlanStatusThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<{ id: number; isActive: boolean }>
                ) => {
                    state.isLoading = false;

                    const plan = state.plans.find(
                        (p) => p.id === action.payload.id
                    );

                    if (plan) {
                        plan.isActive = action.payload.isActive;
                    }
                }
            )
            .addCase(
                toggleSubscriptionPlanStatusThunk.rejected,
                (state, action: PayloadAction<RejectPayload | any>) => {
                    state.isLoading = false;
                    state.error =
                        action.payload?.message || 'Failed to update plan status';
                }
            )


            //DELETE PLAN
            .addCase(deleteSubscriptionPlanThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                deleteSubscriptionPlanThunk.fulfilled,
                (state, action: PayloadAction<number | string>) => {
                    state.isLoading = false;
                    state.plans = state.plans.filter((plan) => plan.id !== action.payload); // Immediate UI update
                }
            )
            .addCase(
                deleteSubscriptionPlanThunk.rejected,
                (state, action: PayloadAction<RejectPayload | any>) => {
                    state.isLoading = false;
                    state.error = action.payload?.message || 'Failed to delete subscription plan';
                }
            );
    },
});

export const { clearError, cleanPlanById, togglePlanActiveStatus } = subscriptionPlanSlice.actions;

export default subscriptionPlanSlice.reducer;
