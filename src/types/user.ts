/**
 * User Types
 * Centralized type definitions for user-related data structures
 */

import { UserRole } from './auth';

// ============================================================================
// Base User Types
// ============================================================================

/**
 * User from backend API (matches database schema)
 * Uses number ID and isInactive flag
 */
export interface User {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  isInactive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * User for UI components (converted from backend format)
 * Uses string ID and isActive flag for better UI compatibility
 */
export interface UIUser {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  name?: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * User for context provider (simplified for navigation)
 */
export interface UserContextUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  role: UserRole;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * User detail with extended information
 */
export interface UserDetail extends UserContextUser {
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  subscriptions?: UserSubscription[];
  tickets?: UserTicket[];
  gameHistory?: UserGameHistory[];
}

// ============================================================================
// Related Entity Types
// ============================================================================

export interface UserSubscription {
  id: string;
  plan: string;
  status: string;
  date: string;
  amount: number;
}

export interface UserTicket {
  id: string;
  subject: string;
  status: string;
  createdAt: string;
}

export interface UserGameHistory {
  id: string;
  gameType: string;
  outcome: string;
  date: string;
}

// ============================================================================
// Pagination & Filter Types
// ============================================================================

/**
 * Pagination information
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * User list filters for query parameters
 */
export interface UserFilters {
  role?: UserRole;
  isInactive?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// Redux State Types
// ============================================================================

/**
 * User management state in Redux store
 */
export interface UserState {
  users: User[];
  pagination: Pagination;
  filters: UserFilters;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

/**
 * Response from get all users API
 */
export interface GetAllUsersResponse {
  users: User[];
  pagination: Pagination;
}

/**
 * Payload for updating a user
 */
export interface UpdateUserPayload {
  id: number;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isInactive?: boolean;
}

/**
 * User list response (legacy format, kept for compatibility)
 */
export interface UserListResponse {
  users: Array<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    createdAt?: string;
    updatedAt?: string;
  }>;
  total: number;
}

/**
 * Update user data (form data format)
 */
export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: UserRole;
}

// ============================================================================
// Form Types
// ============================================================================

/**
 * User form data for editing
 */
export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

// ============================================================================
// Type Guards & Utilities
// ============================================================================

/**
 * Convert backend User to UIUser format
 */
export const userToUIUser = (user: User): UIUser => {
  return {
    id: user.id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    name: user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.firstName || user.lastName || 'N/A',
    role: user.role,
    isActive: !user.isInactive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

/**
 * Convert UIUser to UserContextUser format
 */
export const uiUserToContextUser = (user: UIUser): UserContextUser => {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName || undefined,
    lastName: user.lastName || undefined,
    name: user.name,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

