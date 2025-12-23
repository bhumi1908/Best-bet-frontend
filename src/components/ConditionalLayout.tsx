"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboardRoute = pathname?.startsWith("/admin");
  const isAuthRoute = pathname?.startsWith("/auth");

  // For dashboard routes, don't show Header and Footer
  if (isDashboardRoute) {
    return <>{children}</>;
  }

  // For auth routes, show Header but hide Footer
  if (isAuthRoute) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="grow">{children}</main>
      </div>
    );
  }

  // For public routes, show Header and Footer
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow">{children}</main>
      <Footer />
    </div>
  );
}

