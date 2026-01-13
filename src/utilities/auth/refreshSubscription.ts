import { Session } from "next-auth";
import axios from "axios";
import { routes } from "@/utilities/routes";
import { SubscriptionStatus } from "@/types/subscription";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * Configuration for subscription API retry mechanism
 */
const RETRY_CONFIG = {
  maxRetries: 5,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
};

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Interface for subscription API response
 */
interface SubscriptionApiResponse {
  status: string;
  message: string;
  data: {
    id: number;
    status: SubscriptionStatus;
    startDate: string;
    endDate: string;
    plan: any;
    [key: string]: any;
  } | null;
}

/**
 * Fetches subscription status directly from the API with retry mechanism
 * This handles webhook processing delays by retrying the API call
 * 
 * @param accessToken - The user's access token
 * @param options - Optional retry configuration
 * @returns Promise resolving to SubscriptionStatus or null
 */
async function fetchSubscriptionStatusWithRetry(
  accessToken: string,
  options?: {
    maxRetries?: number;
    initialDelay?: number;
    onRetry?: (attempt: number, delay: number) => void;
  }
): Promise<SubscriptionStatus | null> {
  const maxRetries = options?.maxRetries ?? RETRY_CONFIG.maxRetries;
  const initialDelay = options?.initialDelay ?? RETRY_CONFIG.initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.get<SubscriptionApiResponse>(
        `${API_URL}${routes.api.subscription.user.profile}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          timeout: 5000,
        }
      );

      // If we got a valid response with subscription data, return the status
      if (response.data.data) {
        const status = response.data.data.status as SubscriptionStatus;
        return status;
      }

      // No subscription found - this is valid (user doesn't have subscription)
      if (attempt === 0) {
        // On first attempt, wait a bit for webhook to process
        await sleep(500);
        continue;
      }

      // After retries, if still no subscription, return null
      return null;
    } catch (error: any) {
      // 404 or empty response means no subscription - this is valid
      if (error.response?.status === 404 || (error.response?.status === 200 && !error.response.data?.data)) {
        if (attempt === 0) {
          // On first attempt, wait a bit for webhook to process
          await sleep(500);
          continue;
        }
        return null;
      }

      // Network or server errors - retry with exponential backoff
      if (attempt < maxRetries) {
        const delay = Math.min(
          initialDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt),
          RETRY_CONFIG.maxDelay
        );

        if (options?.onRetry) {
          options.onRetry(attempt + 1, delay);
        }
        await sleep(delay);
        continue;
      }

      // All retries exhausted
      console.error(
        `[Auth] Failed to fetch subscription status after ${maxRetries + 1} attempts:`,
        error.response?.data?.message || error.message
      );
      // Return null instead of throwing to prevent breaking the session
      return null;
    }
  }

  return null;
}

/**
 * Refreshes the subscription status in the current session
 * This function:
 * 1. Fetches subscription status from API with retries (handles webhook delays)
 * 2. Updates the session ONCE with the fetched status
 * 
 * @param update - The update function from useSession() hook
 * @param accessToken - The user's access token (optional, will be fetched from session if not provided)
 * @param options - Optional configuration for retry behavior
 * @returns Promise that resolves when session is updated with the latest status
 */
export async function refreshSubscriptionStatus(
  update: (data?: Partial<Session>) => Promise<Session | null>,
  accessToken?: string,
  options?: {
    maxRetries?: number;
    initialDelay?: number;
    onRetry?: (attempt: number, delay: number) => void;
  }
): Promise<Session | null> {
  try {
    // Get access token from current session if not provided
    let token: string;
    
    if (accessToken) {
      token = accessToken;
    } else {
      // We need to get the current session to extract the token
      // Since we're in a client component, we'll need to pass it from the component
      console.warn("[Auth] Access token not provided, attempting to fetch from session...");
      // Try to get session first
      const currentSession = await update();
      if (!currentSession || !(currentSession as any).accessToken) {
        throw new Error("Unable to get access token for subscription refresh");
      }
      const sessionToken = (currentSession as any).accessToken;
      if (!sessionToken || typeof sessionToken !== 'string') {
        throw new Error("Invalid access token in session");
      }
      token = sessionToken;
    }

    // Fetch subscription status from API with retries
    // This handles webhook processing delays
    const subscriptionStatus = await fetchSubscriptionStatusWithRetry(token, options);

    // Update session ONCE with the fetched status
    const updatedSession = await updateSubscriptionStatus(update, subscriptionStatus);
    return updatedSession;
  } catch (error: any) {
    console.error("[Auth] Failed to refresh subscription status:", error);
    // Don't throw - return null to prevent breaking the user experience
    // The webhook will eventually process and next refresh will work
    return null;
  }
}

/**
 * Updates subscription status directly in session (if you already have the new status)
 * Use this when you've already fetched the subscription status and want to update the session  
 * This bypasses the backend API call and immediately updates the session
 * 
 * @param update - The update function from useSession() hook
 * @param subscriptionStatus - The new subscription status to set (e.g., "ACTIVE", "CANCELED", null)
 * @returns Promise that resolves when session is updated
 */
export async function updateSubscriptionStatus(
  update: (data?: Partial<Session>) => Promise<Session | null>,
  subscriptionStatus: string | null
): Promise<Session | null> {
  try {
    const session = await update({
      subscriptionStatus: subscriptionStatus as any,
    } as any);
    
    return session;
  } catch (error) {
    console.error("[Auth] Failed to update subscription status directly:", error);
    throw error;
  }
}

