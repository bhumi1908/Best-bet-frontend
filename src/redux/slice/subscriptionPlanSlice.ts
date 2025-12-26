import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSubscriptionPlanThunk, deleteSubscriptionPlanThunk, getAllSubscriptionPlansAdminThunk, getAllSubscriptionPlansThunk, RejectPayload, updateSubscriptionPlanThunk } from '../thunk/subscriptionPlanThunk';
import { SubscriptionPlan, SubscriptionPlanState } from '@/types/subscriptionPlan';

const initialState: SubscriptionPlanState = {
    plans: [],
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

export const { clearError } = subscriptionPlanSlice.actions;

export default subscriptionPlanSlice.reducer;
