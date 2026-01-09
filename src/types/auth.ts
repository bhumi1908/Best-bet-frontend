/**
 * Authentication Types
 * Type definitions for authentication-related data structures
 */

// User roles
export type UserRole = 'USER' | 'ADMIN';

// User interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNo: string;
  role?: UserRole;
}

export interface UserRegister {
  email: string;
  firstName: string;
  lastName: string;
  phoneNo: string;
  password: string;
  role?: UserRole;
  stateId?: number;
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Register credentials
export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  confirmPassword?: string;
}

// Auth response from API
export interface AuthResponse {
  user: User;
  token: Token;
}

export interface AuthRefreshResponse {
 data:RefreshTokenData
}

interface RefreshTokenData {
  user: User;
  accessToken: string;
}

export interface Token {
  accessToken: string;
  refreshToken: string;
  
}

// NextAuth user type
export interface NextAuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNo: string;
}

export interface User {
   id: string;
    email: string;
    firstName: string;
  phoneNo: string;
    lastName: string;
    role?: UserRole;
    stateId?: number | null;
    state?: { id: number; name: string; code: string | null } | null;
}

// Auth state interface
export interface AuthState {
  user: User | null;
  // token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  forgotPasswordSuccess?: boolean;
  resetPassSuccessMessage?: string | null;
  
}

// Note: UserListResponse and UpdateUserData have been moved to @/types/user
// Import them from there instead: import { UserListResponse, UpdateUserData } from '@/types/user';



