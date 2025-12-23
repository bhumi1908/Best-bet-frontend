/**
 * Application Routes
 * Centralized route definitions for the application
 */

export const routes = {
  // Public routes
  home: '/',
  landing: '/landing',
  predictions: '/predictions',
  drawHistory: '/draw-history',
  plans: '/plans',
  unauthorized: '/unauthorized',
  terms: '/terms',
  privacy: '/privacy',
  contact: '/contact',

  // Auth routes
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    logout: '/auth/logout',
  },

  // Protected routes
  dashboard: '/dashboard',
  admin: {
    dashboard: '/admin/dashboard',
    user: '/admin/dashboard/user',
    profile: '/admin/dashboard/profile',
  },

  // API routes
  api: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      forgotPassword: '/auth/forgot-password',
      resetPassword: 'auth/reset-password',
      refreshToken: '/auth/refresh-token'
    },
    user: {
      getAll: '/users',
      getById: '/users/:id',
      update: '/users/:id',
    },
  },
} as const;

export type Routes = typeof routes;