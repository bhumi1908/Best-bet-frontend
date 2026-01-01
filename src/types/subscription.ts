// subscription.types.ts

/* =========================
   Core domain types
========================= */

export type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "CANCELED" | "REFUNDED";

export interface User {
  id: number;
  name: string;
  email: string;
  phoneNo: string;
  createdAt: string;
  stripeCustomerId:string;
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
  description: string;
  features: Feature[];
}

export interface Payment {
  amount: number;
  paymentMethod: string,
  stripePaymentId: string | null;
  status: string,
  createdAt: Date
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
   stats: SubscriptionDashboardResponse["stats"] | null;
  charts: SubscriptionDashboardResponse["charts"] | null;
}


// Dashboard
export interface ChartPoint {
  label: string;
  value: number;
}

export interface SubscriptionDashboardStats {
  totalRevenue: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  totalSubscriptions: number;
  activePlans: number;
  totalPlans: number;

  totalRevenueGrowth: number;
  monthlyRevenueGrowth: number;
  activeSubscriptionsGrowth: number;
}

export interface SubscriptionDashboardCharts {
  revenueChartData: ChartPoint[];
  subscriptionsChartData: ChartPoint[];
  monthlyRevenueChartData: ChartPoint[];
}

export interface SubscriptionDashboardResponse {
  stats: SubscriptionDashboardStats;
  charts: SubscriptionDashboardCharts;
}
