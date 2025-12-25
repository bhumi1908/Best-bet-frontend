// types/profile.ts
export interface EditProfilePayload {
  id: string | number;
  firstName: string;
  lastName: string;
}

export interface UserProfile {
  id: string | number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface ProfileEditState {
  isLoading: boolean;
  error: string | null;
  successConfirmPassMessage: string | null;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}