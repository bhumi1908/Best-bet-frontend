import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSupportThunk } from '../thunk/supportThunk';
import { Support, SupportState } from '@/types/support';

const initialState: SupportState = {
    tickets: [],
    isLoading: false,
    error: null,
    lastUpdated: null,
};

const supportSlice = createSlice({
    name: 'support',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },

    },
    extraReducers: (builder) => {
        builder

            .addCase(createSupportThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createSupportThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tickets.unshift(action.payload);
                state.lastUpdated = new Date().toISOString();
                state.error = null;
            })
            .addCase(createSupportThunk.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Failed to create support ticket';
            });
    },
});

export const {
    clearError
} = supportSlice.actions;

export default supportSlice.reducer;
