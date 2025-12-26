import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { changeAdminPasswordThunk, editAdminProfileThunk } from '../thunk/profileThunk';
import { ProfileEditState } from '@/types/profile';


const initialState: ProfileEditState = {
    isLoading: false,
    error: null,
    successConfirmPassMessage: null
};


const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccessMessage: (state) => {
            state.successConfirmPassMessage = null;
        },
    }, extraReducers: (builder) => {
        builder
            // Edit profile information
            .addCase(editAdminProfileThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })

            .addCase(editAdminProfileThunk.fulfilled, (state, action) => {
                state.isLoading = false;
            })

            .addCase(editAdminProfileThunk.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.error =
                    action.payload?.message || 'Failed to update profile';
            })

            // Change password
            .addCase(changeAdminPasswordThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.successConfirmPassMessage = null;
            })
            .addCase(changeAdminPasswordThunk.fulfilled, (state, action: PayloadAction<string>) => {
                state.isLoading = false;
                state.error = null;
                state.successConfirmPassMessage = action.payload;
            })
            .addCase(changeAdminPasswordThunk.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.successConfirmPassMessage = null;
                state.error = action.payload?.message || 'Failed to change password';
            });
    },
});

export const { clearError, clearSuccessMessage } = profileSlice.actions;

export default profileSlice.reducer;
