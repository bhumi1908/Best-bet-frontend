// types/profile.ts
export interface EditProfilePayload {
  id: string | number;
  firstName: string;
  lastName: string;
  phoneNo?: string;
  stateId?: number;
}

export interface UserProfile {
  id: string | number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNo?: string;
  stateId?: number | null;
  state?: { id: number; name: string; code: string | null } | null;
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