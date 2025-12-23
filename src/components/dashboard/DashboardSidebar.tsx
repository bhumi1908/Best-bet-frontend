"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
} from "lucide-react";
import { routes } from "@/utilities/routes";

const navItems = [
  {
    href: routes.admin.dashboard,
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: routes.admin.user,
    label: "Users", 
    icon: Users,
  },
  // {
  //   href: "/dashboard/subscriptions",
  //   label: "Subscriptions",
  //   icon: CreditCard,
  // },
  // {
  //   href: "/dashboard/games",
  //   label: "Games & History",
  //   icon: Gamepad2,
  // },
  // {
  //   href: "/dashboard/missouri",
  //   label: "Missouri Data",
  //   icon: MapPin,
  // },
  // {
  //   href: "/dashboard/support",
  //   label: "Support/Tickets",
  //   icon: MessageSquare,
  // },
  // {
  //   href: "/dashboard/settings",
  //   label: "Settings",
  //   icon: Settings,
  // },
];

interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function DashboardSidebar({ isOpen = true, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [clickedHref, setClickedHref] = useState<string | null>(null);

  // Reset clicked href when pathname changes (navigation completed)
  useEffect(() => {
    setClickedHref(null);
  }, [pathname]);

  const isActive = (href: string) => {
    // If a link was just clicked, only show that one as active
    if (clickedHref !== null) {
      return clickedHref === href;
    }
    
    // Otherwise, use pathname-based logic
    if (href === routes.admin.dashboard) {
      return pathname === routes.admin.dashboard;
    }
    return pathname.startsWith(href);
  };

  const handleLinkClick = (href: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    // Only set clicked href if it's different from current pathname
    // This prevents setting active state when clicking the same page
    if (href !== pathname) {
      setClickedHref(href);
    }
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-16 bottom-0 w-64 bg-bg-secondary border-r border-border-primary z-40
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <nav className="h-full flex flex-col p-4 space-y-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  handleLinkClick(item.href, e);
                }}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150
                  ${
                    active
                      ? "bg-gradient-to-r from-accent-primary/20 to-accent-tertiary/20 text-accent-primary border border-border-accent shadow-lg shadow-accent-primary/10"
                      : "text-text-tertiary hover:text-accent-hover hover:bg-bg-tertiary"
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

