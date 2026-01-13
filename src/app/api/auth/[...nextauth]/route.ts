// /**
//  * NextAuth API Route
//  * Credentials provider configuration for NextAuth
//  */

// import NextAuth, { NextAuthOptions } from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import { apiClient } from '@/utilities/axios/instance';
// import { LoginCredentials, AuthResponse } from '@/types/auth';
// import { cookies } from 'next/headers';

// /**
//  * NextAuth configuration
//  */
// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: { label: 'Email', type: 'email' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error('Email and password are required');
//         }

//         try {

//           // Call your API to authenticate user
//           const response = await apiClient.post<{ data: AuthResponse }>('/auth/login', {
//             email: credentials.email,
//             password: credentials.password,
//           } as LoginCredentials);

//           const data = response.data.data;


//           // if (!data || !data.user) return null;
//           const cookieStore = await cookies();

//           cookieStore.set('accessToken', data.token.accessToken, {
//             httpOnly: true,
//             path: '/',
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'lax',

//           });

//           // Refresh token cookie (if your API returns it)
//           if (data.token.refreshToken) {
//             cookieStore.set('refreshToken', data.token.refreshToken, {
//               httpOnly: true,
//               path: '/',
//               secure: process.env.NODE_ENV === 'production',
//               sameSite: 'lax',
//             });
//           }

//           return {
//             id: data.user.id,
//             email: data.user.email,
//             name: `${data.user.firstName} ${data.user.lastName}`,
//             role: data.user.role || 'USER',
//             accessToken: data.token.accessToken,
//           };
//         } catch (error: any) {
//           const errorMessage =
//             error.response?.data?.message || 'Invalid credentials';
//           throw new Error(errorMessage);
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       // Initial sign in
//       if (user) {
//         token.accessToken = (user as any).accessToken;
//         token.id = user.id;
//         token.role = (user as any).role || 'USER';
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       // Send properties to the client
//       if (session.user) {
//         (session.user as any).id = token.id;
//         (session.user as any).role = token.role || 'USER';
//         (session as any).accessToken = token.accessToken;
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: '/auth/login',
//     error: '/auth/login',
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };



import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { AuthRefreshResponse, AuthResponse, UserRole } from "@/types/auth";
import { jwtDecode } from "jwt-decode";
import { routes } from "@/utilities/routes";
import { signOut } from "next-auth/react";
import { SubscriptionStatus } from "@/types/subscription";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface DecodedToken {
  id: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

interface BackendSubscriptionResponse {
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
 * Fetches the current subscription status for a user from the backend API
 * @param accessToken - The user's access token for API authentication
 * @returns Promise resolving to SubscriptionStatus or null if no subscription
 */
async function fetchSubscriptionStatus(accessToken: string): Promise<SubscriptionStatus | null> {
  try {
    const response = await axios.get<BackendSubscriptionResponse>(
      `${API_URL}${routes.api.subscription.user.profile}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        timeout: 5000, // 5 second timeout to prevent hanging requests
      }
    );

    if (!response.data.data) {
      // No subscription found - user doesn't have an active subscription
      return null;
    }

    const status = response.data.data.status as SubscriptionStatus | null;
    return status;
  } catch (error: any) {
    // 404 or empty response means no subscription - this is valid
    if (error.response?.status === 404 || (error.response?.status === 200 && !error.response.data?.data)) {
      return null;
    }

    // Log other errors for debugging but don't throw
    // This prevents breaking the session if subscription API is temporarily unavailable
    console.error("[NextAuth] Failed to fetch subscription status:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      code: error.code,
    });

    // Return null on error to prevent breaking the session
    // The retry mechanism in refreshSubscriptionStatus will handle retries
    return null;
  }
}

async function refreshAccessToken(data: any) {
  try {
    const response = await axios.post<AuthRefreshResponse>(
      `${API_URL}${routes.api.auth.refreshToken}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${data.refreshToken}`,
        },
      }
    );

    const decoded = jwtDecode<DecodedToken>(
      response.data.data.accessToken
    );

    data.accessToken = response.data.data.accessToken;
    data.accessTokenExpires = decoded.exp * 1000;
    data.refreshToken = data.refreshToken;


    return data;
  } catch (error) {
    console.error("Refresh token failed", error);
    data.error = "RefreshAccessTokenError";
    await signOut({ callbackUrl: "/auth/login" });
    return data;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },

      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials.password) return null;

          const res = await axios.post<{ data: AuthResponse }>(
            `${API_URL}/auth/login`,
            credentials
          );

          const data = res.data.data;
          const decoded: { exp: number } = jwtDecode(data.token.accessToken);

          // Fetch subscription status during login
          const subscriptionStatus = await fetchSubscriptionStatus(data.token.accessToken);

          return {
            id: data.user.id,
            email: data.user.email,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            phoneNo: data.user.phoneNo,
            stateId: data.user.stateId,
            state: data.user.state,
            role: data.user.role ?? 'USER',
            accessToken: data.token.accessToken,
            refreshToken: data.token.refreshToken,
            accessTokenExpires: decoded.exp,
            subscriptionStatus,
          };
        }
        catch (error: any) {
          const message =
            error.response?.data?.message || 'Login failed. Please try again.';
          throw new Error(message);
        }
      }


    },
    ),
  ],

  callbacks: {
    /**
     * JWT Callback - Handles token creation and updates
     */
    async jwt({ token, user, trigger, session }) {
      // ============================================
      // INITIAL LOGIN - Store user data in JWT
      // ============================================
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.phoneNo = user.phoneNo;
        token.stateId = user.stateId;
        token.state = user.state;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = user.accessTokenExpires;
        token.subscriptionStatus = user.subscriptionStatus || null;
        token.subscriptionStatusFetchedAt = Date.now();

        return token;
      }

      // ============================================
      // SESSION UPDATE TRIGGER - Event-driven refresh
      // ============================================
      if (trigger === "update") {
        // Update user profile data if provided
        if (session?.user) {
          token.firstName = session.user.firstName;
          token.lastName = session.user.lastName;
          token.phoneNo = session.user.phoneNo;
          token.stateId = session.user.stateId;
          token.state = session.user.state;
        }
        
        // Force refresh subscription status from backend when explicitly requested   
        if (session?.forceRefreshSubscription === true) {
          try {
            const subscriptionStatus = await fetchSubscriptionStatus(token.accessToken as string);
            
            // Only update if we got a valid response (including null for no subscription)
            // This ensures we don't overwrite with stale data on errors
            token.subscriptionStatus = subscriptionStatus;  
            token.subscriptionStatusFetchedAt = Date.now();
            
          } catch (error) {
            console.error("[NextAuth] Failed to refresh subscription status via session.update():", error);
            // Keep existing status on error to prevent breaking the session
            // The retry mechanism in refreshSubscriptionStatus will handle retries
          }
        }
        // Direct subscription status update (if provided directly)
        // This bypasses the API call and immediately updates the session
        // Use this when you already know the new status (e.g., from webhook confirmation)
        else if (session?.subscriptionStatus !== undefined) {
          token.subscriptionStatus = session.subscriptionStatus;
          token.subscriptionStatusFetchedAt = Date.now();
        }
      }

      // ============================================
      // ACCESS TOKEN VALIDITY CHECK
      // ============================================
      // Check if access token is still valid (with 30 second buffer)
      const now = Date.now();
      if (
        token.accessTokenExpires &&
        now < token.accessTokenExpires - 30000
      ) {
        return token;
      }

      // ============================================
      // ACCESS TOKEN REFRESH
      // ============================================
      // Access token expired → refresh it
      const refreshedToken = await refreshAccessToken(token);

      // After refreshing access token, also refresh subscription status
      // This ensures subscription info stays in sync with token lifecycle
      if (refreshedToken.accessToken) {
        try {
          const subscriptionStatus = await fetchSubscriptionStatus(refreshedToken.accessToken as string);
          refreshedToken.subscriptionStatus = subscriptionStatus || null;
          refreshedToken.subscriptionStatusFetchedAt = Date.now();
        } catch (error) {
          console.error("[NextAuth] Failed to refresh subscription status after token refresh:", error);
          // Keep existing status on error
        }
      }

      return refreshedToken;
    },

    /**
     * Session Callback - Maps JWT token data to session object
     */
    async session({ session, token }) {
      // Map user data from token to session
      session.user = {
        ...session.user,
        id: token.id as string,
        role: token.role as UserRole,
        firstName: token.firstName as string,
        lastName: token.lastName as string,
        phoneNo: token.phoneNo as string,
        stateId: token.stateId as number | null | undefined,
        state: token.state as { id: number; name: string; code: string | null } | null | undefined,
      };

      // Include access token and subscription status in session
      session.accessToken = token.accessToken as string;
      session.error = token.error as string | undefined;

      // Subscription status from JWT (updated via session.update() when changes occur)
      session.subscriptionStatus = (token.subscriptionStatus as SubscriptionStatus | null | undefined) || null;

      return session;
    }

  },

  pages: {
    signIn: "/auth/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
