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
  game1: '/game-1',
  game2: '/game-2',
  profile: '/profile',

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
      editAdmin: (id: number | string) => `/profile/${id}`,
      changePasswordAdmin: '/profile/change-password'
    },
    subscriptionPlan: {
      getAll: '/subscription-plan',
      admin: {
        getAll: "/admin/subscription-plan",
        getByPlanId: (id: number | string) => `/admin/subscription-plan/${id}`,
        create: "/admin/subscription-plan",
        update: (id: number | string) => `/admin/subscription-plan/${id}`,
        updateStatus: (id: number | string) => `/admin/subscription-plan/${id}/status`,
        delete: (id: number | string) => `/admin/subscription-plan/${id}`,
      },
    },
    subscription: {
      checkout: '/subscription/checkout',
      user: {
        profile: `/subscription/me/subscription`,
        revokeSubscription: `/subscription/me/revoke`,
        changePlanSubscription: `/subscription/me/change-plan`,
        cancelScheduledChange: `/subscription/me/cancel/schedule-plan`,
      },
      admin: {
        dashboard: '/subscription/dashboard',
        getAll: '/subscription/users',
        getSubscriptionDetails: (id: number | string) => `/subscription/users/${id}`,
        revokeSubscription: (id: number | string) => `/subscription/users/${id}/revoke`,
        refundSubscription: (id: number | string) => `/subscription/refund/${id}`,
        changePlanSubscription: (id: number | string) => `/subscription/change-plan/${id}`
      }
    },
    stripe: {
      getIntegrationStatus: '/stripe/status',
    },
    states: {
      getAll: '/states',
    },
    gameTypes: {
      getAll: '/game-types',
    },
    gameHistory: {
      create: '/game-history',
      update: (id: number | string) => `/game-history/${id}`,
      getAll: '/game-histories',
      getById: (id: number | string) => `/game-histories/${id}`,
      delete: (id: number | string) => `/game-histories/${id}`,
    },
  },
} as const;

export type Routes = typeof routes;