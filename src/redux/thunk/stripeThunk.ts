import { StripeIntegrationStatus } from "@/types/stripe";
import apiClient from "@/utilities/axios/instance";
import { routes } from "@/utilities/routes";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface RejectPayload {
    message: string;
}

export const getStripeIntegrationStatusThunk = createAsyncThunk<
    StripeIntegrationStatus,
    void,
    { rejectValue: RejectPayload }
>(
    "stripe/getIntegrationStatus",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<{
                data: StripeIntegrationStatus;
                message: string;
            }>(routes.api.stripe.getIntegrationStatus);

            if (response.data && response.data.data) {
                return response.data.data;
            }

            throw new Error("Invalid response format");
        } catch (error: any) {
            const message =
                typeof error.response?.data?.message === "string"
                    ? error.response.data.message
                    : error.message || "Failed to fetch Stripe integration status";

            return rejectWithValue({ message });
        }
    }
);
