"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User, LogOut, Menu, X } from "lucide-react";
import { routes } from "@/utilities/routes";

interface DashboardHeaderProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

export default function DashboardHeader({ onMenuToggle, isMenuOpen }: DashboardHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

const capitalize = (value?: string) => {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

const getUserName = () => {
  if (user?.firstName && user?.lastName) {
    return `${capitalize(user.firstName)} ${capitalize(user.lastName)}`;
  }
  return user?.email || "User";
};


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await signOut({ callbackUrl: "/auth/login" });
  };

  const handleProfile = () => {
    setIsDropdownOpen(false);
    router.push(routes.admin.profile);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-bg-primary border-b border-border-primary backdrop-blur-sm">
      <div className="h-full flex items-center justify-between px-4 md:px-6">
        {/* Mobile Menu Button & Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
          <Link href={routes.home} className="flex items-center">
            <span className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              Best Bet
            </span>
          </Link>
        </div>

        {/* User Avatar with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border border-yellow-400/30 hover:border-yellow-400/50 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
            aria-label="User menu"
          >
            <span className="text-yellow-400 font-semibold text-sm">
              {getUserInitials()}
            </span>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 border border-border-primary bg-bg-card rounded-lg shadow-xl backdrop-blur-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-border-primary">
                <p className="text-sm font-medium text-text-primary">{getUserName()}</p>
                <p className="text-xs text-text-tertiary mt-1 truncate">
                  {user?.email}
                </p>
              </div>
              <div className="p-1.5 flex flex-col gap-0.5">
                <button
                  onClick={handleProfile}
                  className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-bg-muted rounded-lg hover:text-accent-primary transition-colors flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-error hover:bg-error-light rounded-lg transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

