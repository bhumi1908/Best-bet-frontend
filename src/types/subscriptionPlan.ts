
export interface Feature {
  name: string;
}

export interface SubscriptionPlanPayload {
  name: string;
  price: number;
  duration: number;
  description: string;
  isRecommended: boolean;
  isActive: boolean;
  features: Feature[];
}
export interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  duration: number;
  description: string;
  isRecommended: boolean;
  isActive: boolean;
  features: Feature[];
}

export interface SubscriptionPlanState {
  plans: SubscriptionPlan[];
  planById: SubscriptionPlan | null;
  isLoading: boolean;
  error: string | null;
}

