// subscription.types.ts

/* =========================
   Core domain types
========================= */

export type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "CANCELED" | "REFUNDED" | "TRIAL" | "PAST_DUE";

export interface User {
  id: number;
  name: string;
  email: string;
  phoneNo: string;
  createdAt: string;
  stripeCustomerId: string;
  isTrial: boolean;
}

export interface Feature {
  id: number;
  name: string;
  description: string | null;
}

export interface Plan {
  id: number;
  name: string;
  isActive: string;
  price: number;
  trialDays: number;
  duration: number;
  description: string;
  features: Feature[];
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  duration: number;
  trialDays: number;
  description: string;
  features: Feature[];
  stripePriceId?: string;
  discountPercent?: number;
  isRecommended?: boolean;
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
  nextPlan?: SubscriptionPlan | null;
  nextPlanId?: number | null;
  lastPayment?: Payment | null;
  scheduledChangeAt?: string | null;
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
  checkoutUrl: string | null;
  subscriptions: Subscription[];
  selectedSubscription: Subscription | null;
  pagination: Pagination;
  filters: AdminSubscriptionUIFilters;
  stats: SubscriptionDashboardResponse["stats"] | null;
  charts: SubscriptionDashboardResponse["charts"] | null;
  refundResult: RefundResponse | null;
  currentSubscription: Subscription | null;
  successMessage: string | null;
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

export interface RefundRequestPayload {
  amount: number;
  reason?: string;
}

export interface RefundResponse {
  id: string;
  status: string;
  amount: number;
  currency: string;
  [key: string]: any;
}

export interface ChangePlanPayload {
  userId: number;
  newPlanId: number;
}

export interface CheckoutSessionPayload {
  url: string;
  trialActivated?: boolean;
  message?: string;
}
