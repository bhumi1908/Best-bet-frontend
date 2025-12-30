// subscription.types.ts

/* =========================
   Core domain types
========================= */

export type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "CANCELED";

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Feature {
  id: number;
  name: string;
  description: string | null;
}

export interface Plan {
  id: number;
  name: string;
  price: number;
  duration: number;
  features: Feature[];
}

export interface Payment {
  amount: number;
  status: string;
  paymentMethod: string,
  stripePaymentId: string | null;
}

export interface Subscription {
  subscriptionId: number;
  user: User;
  plan: Plan;
  payment: Payment | null;
  status: SubscriptionStatus;
  startDate: string;     // ISO string
  endDate: string;       // ISO string
  createdAt: string;     // ISO string
}

/* =========================
   Filters (API-level)
========================= */

export interface SubscriptionFilters {
  search?: string;
  status?: SubscriptionStatus;
  planId?: number;
  plan?: string;
  startDateFrom?: Date;
  startDateTo?: Date;
  sortBy: string;
  sortOrder: "ascend" | "descend";
}

export interface AdminSubscriptionUIFilters {
  search: string;
  status: SubscriptionStatus | "all";
  planId: number | "all";
  startDateFrom: Date | null;
  startDateTo: Date | null;
  sortBy: string;
  sortOrder: "ascend" | "descend";
}

/* =========================
   Pagination
========================= */

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/* =========================
   API responses
========================= */

export interface GetAllSubscriptionsResponse {
  subscriptions: Subscription[];
  pagination: Pagination;
}


/* =========================
   Redux state (Admin)
========================= */

export interface AdminSubscriptionState {
  isLoading: boolean;
  error: string | null;
  subscriptions: Subscription[];
  selectedSubscription: Subscription | null;
  pagination: Pagination;
  filters: AdminSubscriptionUIFilters;
}
