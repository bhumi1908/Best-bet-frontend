import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getStripeIntegrationStatusThunk } from "../thunk/stripeThunk";
import { StripeIntegrationState, StripeIntegrationStatus } from "@/types/stripe";

const initialState: StripeIntegrationState = {
    isStripeLoading: false,
    stripeError: null,
    data: null,
};

const stripeIntegrationSlice = createSlice({
    name: "stripeIntegration",
    initialState,
    reducers: {
        clearStripeIntegrationError: (state) => {
            state.stripeError = null;
        },
        clearStripeIntegrationData: (state) => {
            state.data = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Stripe Integration Status
            .addCase(getStripeIntegrationStatusThunk.pending, (state) => {
                state.isStripeLoading = true;
                state.stripeError = null;
            })
            .addCase(
                getStripeIntegrationStatusThunk.fulfilled,
                (state, action: PayloadAction<StripeIntegrationStatus>) => {
                    state.isStripeLoading = false;
                    state.stripeError = null;
                    state.data = action.payload;
                }
            )
            .addCase(
                getStripeIntegrationStatusThunk.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isStripeLoading = false;
                    state.data = null;
                    state.stripeError =
                        action.payload?.message ||
                        "Failed to fetch Stripe integration status";
                }
            );
    },
});

export const {
    clearStripeIntegrationError,
    clearStripeIntegrationData,
} = stripeIntegrationSlice.actions;

export default stripeIntegrationSlice.reducer;
