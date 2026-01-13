import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { routes } from "./utilities/routes";
import { SubscriptionStatus } from "./types/subscription";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

async function fetchLiveSubscriptionStatus(accessToken: string): Promise<SubscriptionStatus | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(
      `${API_URL}${routes.api.subscription.user.profile}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    if (!res.ok) {
      if (res.status === 404) {
        // No subscription for user
        return null;
      }
      // For other errors, fall back to existing token status
      return null;
    }

    const json = await res.json();

    if (!json?.data) {
      return null;
    }

    return json.data.status as SubscriptionStatus;
  } catch {
    // Network / timeout / other errors: do not break auth, keep existing token status
    return null;
  }
}

export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl.pathname;
    const token = req.nextauth.token;

    if (pathname.startsWith(routes.game1) || pathname.startsWith(routes.game2)) {
      // Safety check: Token should exist (authorized callback ensures it)
      if (!token) {
        const loginUrl = new URL(routes.auth.login, req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Admin users always have full access (bypass subscription check)
      if (token.role === "ADMIN") {
        return NextResponse.next();
      }

      // Start with subscription status from JWT
      let effectiveStatus = token.subscriptionStatus as SubscriptionStatus | null | undefined;

      // On each game route request, validate against live backend subscription state
      // This ensures admin-triggered actions (revoke, change, refund) take effect immediately
      if (token.accessToken) {
        const liveStatus = await fetchLiveSubscriptionStatus(token.accessToken as string);
        if (liveStatus !== null) {
          effectiveStatus = liveStatus;
        } else if (liveStatus === null) {
          // Explicit null means "no active subscription"
          effectiveStatus = null;
        }
      }

      // Only allow ACTIVE or TRIAL subscription status
      if (effectiveStatus !== "ACTIVE" && effectiveStatus !== "TRIAL") {
        const plansUrl = new URL(routes.plans, req.url);
        plansUrl.searchParams.set("message", "active_subscription_required");
        return NextResponse.redirect(plansUrl);
      }
    }

    // ============================================
    // ADMIN ROUTES PROTECTION
    // ============================================
    // Admin routes require ADMIN role
    if (pathname.startsWith(routes.admin.dashboard)) {
      // Safety check: Token should exist
      if (!token) {
        const loginUrl = new URL(routes.auth.login, req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Only ADMIN role can access admin routes
      if (token.role !== "ADMIN") {
        const unauthorizedUrl = new URL(routes.unauthorized || "/", req.url);
        return NextResponse.redirect(unauthorizedUrl);
      }
    }

    // Allow access to all other routes
    return NextResponse.next();
  },
  {
    callbacks: {
      /**
       * Authorized Callback - Determines if a request is authorized
       * This runs before the middleware function and checks authentication
       */
      authorized({ token, req }) {
        const pathname = req.nextUrl.pathname;

        // ============================================
        // PUBLIC ROUTES - Always accessible
        // ============================================
        // These routes don't require authentication
        const publicRoutes = [
          routes.auth.login,
          routes.auth.register,
          routes.auth.forgotPassword,
          routes.auth.resetPassword,
          routes.home,
          routes.landing,
          routes.plans,
          routes.terms,
          routes.privacy,
          routes.about,
          routes.support,
          routes.drawHistory,
          routes.predictions,
          routes.state,
        ];

        // Check if current path is a public route
        const isPublicRoute = publicRoutes.some((route) =>
          pathname === route || pathname.startsWith(route + "/")
        );

        if (isPublicRoute) {
          return true; // Allow access without authentication
        }

        // ============================================
        // PROTECTED ROUTES - Require authentication
        // ============================================
        
        // Game routes - require authentication
        // Subscription check happens in middleware function above
        if (pathname.startsWith(routes.game1) || pathname.startsWith(routes.game2)) {
          return !!token; // Must be logged in
        }

        // Admin routes - require authentication
        // Role check happens in middleware function above
        if (pathname.startsWith(routes.admin.dashboard)) {
          return !!token; // Must be logged in
        }

        // Profile and other protected routes - require authentication
        if (pathname.startsWith("/profile")) {
          return !!token; // Must be logged in
        }

        // Default: require authentication for all other routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/game-1",
    "/game-2",
    "/profile/:path*",
  ],
};
