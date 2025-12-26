import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/utilities/axios/instance';
import { routes } from '@/utilities/routes';
import { ChangePasswordPayload, EditProfilePayload, UserProfile } from '@/types/profile';

export interface RejectPayload {
  message: string;
}

export const editAdminProfileThunk = createAsyncThunk<
  UserProfile,
  EditProfilePayload,
  { rejectValue: RejectPayload }
>(
  'profile/editAdmin',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiClient.put<{
        data: { user: UserProfile };
        message: string;
      }>(
        `${routes.api.profile.editAdmin(payload.id)}`,
        {
          firstName: payload.firstName,
          lastName: payload.lastName,
        }
      );

      if (response.data && response.data.data?.user) {
        return response.data.data.user;
      }

      throw new Error('Invalid response format');
    } catch (error: any) {
      const message =
        typeof error.response?.data?.message === 'string'
          ? error.response.data.message
          : error.message || 'Failed to update profile';

      return rejectWithValue({ message });
    }
  }
);

export const changeAdminPasswordThunk = createAsyncThunk<
  string,
  ChangePasswordPayload,
  { rejectValue: RejectPayload }
>(
  "profile/changeAdminPassword",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiClient.put<{
        data: null;
        message: string;
      }>(`${routes.api.profile.changePasswordAdmin}`, {
        currentPassword: payload.currentPassword,
        newPassword: payload.newPassword,
      });

      if (response.data && response.data.message) {
        return response.data.message;
      }

      throw new Error("Invalid response format");
    } catch (error: any) {
      const message =
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : error.message || "Failed to change password";

      return rejectWithValue({ message });
    }
  }
);
