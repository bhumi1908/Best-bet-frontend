// /**
//  * NextAuth Type Extensions
//  * Extends NextAuth types to include custom properties
//  */

import "next-auth";
import "next-auth/jwt";
import { UserRole } from "./auth";
import { SubscriptionStatus } from "./subscription";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    error?: string;
    subscriptionStatus?: SubscriptionStatus | null;
    user: {
      id: string;
      role: UserRole;
      firstName: string;
      lastName: string;
      phoneNo: string;
      stateId?: number | null;
      state?: { id: number; name: string; code: string | null } | null;
    } & DefaultSession["user"];
  }

  /**
   * Session update payload for refreshing subscription status
   * Use this with update() from useSession() to force refresh subscription
   */
  interface SessionUpdate {
    subscriptionStatus?: SubscriptionStatus | null;
    forceRefreshSubscription?: boolean;
    user?: {
      firstName?: string;
      lastName?: string;
      phoneNo?: string;
      stateId?: number | null;
      state?: { id: number; name: string; code: string | null } | null;
    };
  }


  interface User {
    id: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    phoneNo: string;
    stateId?: number | null;
    state?: { id: number; name: string; code: string | null } | null;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    subscriptionStatus?: SubscriptionStatus | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
    firstName: string;
    lastName: string;
    phoneNo: string;
    stateId?: number | null;
    state?: { id: number; name: string; code: string | null } | null;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    subscriptionStatus?: SubscriptionStatus | null;
    subscriptionStatusFetchedAt?: number;
    error?: string;
  }
}