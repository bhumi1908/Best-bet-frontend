import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllSubscriptionPlansThunk } from '../thunk/subscriptionPlanThunk';
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
                (state, action: PayloadAction<any>) => {
                    state.isLoading = false;
                    state.error = action.payload?.message || 'Failed to fetch subscription plans';
                }
            );
    },
});

export const { clearError } = subscriptionPlanSlice.actions;

export default subscriptionPlanSlice.reducer;
