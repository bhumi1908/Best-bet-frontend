'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { UserRole } from '@/types/auth';
import { routes } from '@/utilities/routes';

interface AuthWrapperProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function AuthWrapper({
  children,
  allowedRoles,
}: AuthWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isAuthRoute = pathname.startsWith('/auth');
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  useEffect(() => {
    if (isLoading) return;

    // Logged-in user visiting auth pages
    if (isAuthenticated && isAuthRoute) {
      router.replace(
        session.user.role === 'ADMIN'
          ? routes.admin.dashboard
          : routes.home
      );
      return;
    }

    // Not logged in
    if (!isAuthenticated && !isAuthRoute) {
      router.replace(routes.auth.login);
      return;
    }

    // Role not allowed
    if (
      allowedRoles &&
      isAuthenticated &&
      !allowedRoles.includes(session.user.role)
    ) {
      router.replace(routes.unauthorized);
    }
  }, [
    isAuthenticated,
    isLoading,
    isAuthRoute,
    session,
    allowedRoles,
    router,
  ]);

  // Loader while checking session
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span>Loading...</span>
      </div>
    );
  }

  return <>{children}</>;
}
