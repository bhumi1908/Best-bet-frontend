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
  state: '/state',
  terms: '/terms',
  privacy: '/privacy',
  about: '/about-us',
  support: '/support',

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
    subscriptions: '/admin/dashboard/subscription',
    history: '/admin/dashboard/history',
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
      refreshToken: '/auth/refresh-token',
    },
    user: {
      getAll: '/users',
      getById: (id: number | string) => `/users/${id}`,
      update: (id: number | string) => `/users/${id}`,
    },
    support: {
      create: '/support/create'
    },
    profile: {
      editAdmin: (id: number | string) => `/admin/profile/${id}`,
      changePasswordAdmin: '/admin/profile/change-password'
    },
    subscriptionPlan: {
      getAll: '/subscription-plan',
      admin: {
        getAll: "/admin/subscription-plan",
        create: "/admin/subscription-plan",
        update: (id: number | string) => `/admin/subscription-plan/${id}`,
        delete: (id: number | string) => `/admin/subscription-plan/${id}`,
      },
    }
  },
} as const;

export type Routes = typeof routes;