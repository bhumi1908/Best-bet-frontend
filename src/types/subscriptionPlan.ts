
export interface Feature {
  id: number;
  name: string;
  description?: string | null;
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  duration: number;
  description?: string | null;
  isRecommended: boolean;
  features: Feature[];
}

export interface SubscriptionPlanState {
  plans: SubscriptionPlan[];
  isLoading: boolean;
  error: string | null;
}