import { withAuth } from "next-auth/middleware";
import { routes } from "./utilities/routes";

export default withAuth({
  callbacks: {
    authorized({ token, req }) {
      const pathname = req.nextUrl.pathname;

      // Not logged in
      if (!token) return false;

      // Admin routes
      if (pathname.startsWith(routes.admin.dashboard)) {
        return token.role === "ADMIN";
      }

      // User routes
      if (pathname.startsWith(routes.home)) {
        return ["USER", "ADMIN"].includes(token.role as string);
      }

      return true;
    },
  },
});

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
