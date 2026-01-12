import { Session } from "next-auth";

/**
 * Refreshes the subscription status in the current session
 * This triggers NextAuth's JWT callback to fetch the latest subscription from the backend
 * 
 * @param update - The update function from useSession() hook
 * @returns Promise that resolves when session is updated
 */
export async function refreshSubscriptionStatus(
  update: (data?: Partial<Session>) => Promise<Session | null>
): Promise<void> {
  try {
    console.log('FIRE-1.1');
    // Trigger session update with forceRefreshSubscription flag
    // This tells the JWT callback to fetch fresh subscription status from backend
    await update({
      forceRefreshSubscription: true,
    } as any);
  } catch (error) {
    console.log('FIRE-1.2');
    console.error("[Auth] Failed to refresh subscription status:", error);
    throw error;
  }
}

/**
 * Updates subscription status directly in session (if you already have the new status)
 * Use this when you've already fetched the subscription status and want to update the session
 * 
 * @param update - The update function from useSession() hook
 * @param subscriptionStatus - The new subscription status to set
 * @returns Promise that resolves when session is updated
 */
export async function updateSubscriptionStatus(
  update: (data?: Partial<Session>) => Promise<Session | null>,
  subscriptionStatus: string | null
): Promise<void> {
  try {
    await update({
      subscriptionStatus: subscriptionStatus as any,
    } as any);
  } catch (error) {
    console.error("[Auth] Failed to update subscription status:", error);
    throw error;
  }
}
