export interface StripeIntegrationStatus {
  apiStatus: "connected" | "not_connected";
  webhookStatus: "active" | "inactive";
  mode: "test" | "live";
  paymentMethods: {
    creditCards: boolean;
    bankTransfer: boolean;
    digitalWallets: boolean;
  };
}

export interface StripeIntegrationState {
  isStripeLoading: boolean;
  stripeError: string | null;
  data: StripeIntegrationStatus | null;
}