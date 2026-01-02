
export interface Feature {
  name: string;
}

export interface SubscriptionPlanPayload {
  name: string;
  price?: number;
  duration?: number;
  description: string;
  isRecommended: boolean;
  isActive: boolean;
  features: Feature[];
   trialDays?: number; 
   isTrial?: boolean;
   discountPercent?: number;
}
export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  isRecommended: boolean;
  isActive: boolean;
  features: Feature[];
  trialDays?: number;
  price?: number ;
  duration?: number;
  isTrial?: boolean;
  discountPercent?: number;
}

export interface SubscriptionPlanState {
  plans: SubscriptionPlan[];
  planById: SubscriptionPlan | null;
  isLoading: boolean;
  error: string | null;
}

