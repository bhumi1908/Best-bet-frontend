"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { routes } from "@/utilities/routes";
import { useEffect, useRef, useState } from "react";
import { HelpCircle, Lock, LogOut, Menu, X, ChevronDown, User } from "lucide-react";
import { Button } from "./ui/Button";

export default function Header() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const user = session?.user
  const pathname = usePathname();
  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const gamesDropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isGamesDropdownOpen, setIsGamesDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const getUserName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.email || "User";
  };

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     dispatch(setAuthenticated({ user: session?.user }));
  //   } else {
  //     dispatch(setAuthenticated(null));
  //   }
  // }, [status, session, dispatch]);


  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await signOut({ callbackUrl: "/auth/login" });
  };

  const handleProfile = () => {
    router.push(routes.profile);
  }

  const handleSupportUs = () => {
    router.push(routes.support);
  }

  const navLinks = [
    { href: routes.state, label: "State Performance" },
    // { href: routes.predictions, label: "Predictions", requiresAuth: true, },
    { href: routes.drawHistory, label: "Draw History" },
    { href: routes.plans, label: "Subscription Plans" },
    { href: routes.about, label: "About Us" },
  ];

  const isActive = (href: string) => pathname === href;
  
  const isGameRoute = () => {
    return pathname === routes.game1 || pathname === routes.game2;
  };

  const handleLinkClick = (href: string, requiresAuth: boolean) => {
    if (requiresAuth && !isAuthenticated) {
      // Middleware will handle redirect, but we can also handle it here
      window.location.href = `${routes.auth.login}?callbackUrl=${encodeURIComponent(href)}`;
    }
  };
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDashboardClick = () => {
    router.push(routes.admin.dashboard)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        gamesDropdownRef.current &&
        !gamesDropdownRef.current.contains(event.target as Node)
      ) {
        setIsGamesDropdownOpen(false);
      }
    };

    if (isDropdownOpen || isGamesDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, isGamesDropdownOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">

            {/* Mobile Menu Button */}
            <button
              onClick={handleMenuToggle}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
            {/* Logo */}
            <Link href={routes.home} className="flex items-center space-x-2">
              <span className="text-2xl font-extrabold text-yellow-400">
                Best Bet
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-5">
            {/* Games Dropdown */}
            <div className="relative" ref={gamesDropdownRef}>
              <button
                onClick={() => setIsGamesDropdownOpen(!isGamesDropdownOpen)}
                className={`relative py-2 flex gap-1 items-center rounded-lg text-sm font-medium transition-colors ${isGameRoute()
                  ? "text-yellow-400"
                  : "text-white hover:text-yellow-300"
                  }`}
              >
                Games
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${isGamesDropdownOpen ? "rotate-180" : ""
                    }`}
                />
                <span
                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 rounded-lg bg-yellow-400 transition-all duration-400 ${isGameRoute() ? "w-full" : "w-0"
                    }`}
                ></span>
              </button>

              {/* Games Dropdown Menu */}
              {isGamesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-24 border border-white/10 bg-black/95 backdrop-blur-md rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-1.5 flex flex-col gap-0.5">
                    <Link
                      href={routes.game1}
                      onClick={() => setIsGamesDropdownOpen(false)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 justify-center ${pathname === routes.game1
                        ? "bg-yellow-400/20 text-yellow-400"
                        : "text-white hover:bg-white/10 hover:text-yellow-300"
                        }`}
                    >
                      Game 1
                    </Link>
                    <Link
                      href={routes.game2}
                      onClick={() => setIsGamesDropdownOpen(false)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 justify-center ${pathname === routes.game2
                        ? "bg-yellow-400/20 text-yellow-400"
                        : "text-white hover:bg-white/10 hover:text-yellow-300"
                        }`}
                    >
                      Game 2
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => {
                }}
                className={`relative py-2 flex gap-0.5 items-center rounded-lg text-sm font-medium transition-colors ${isActive(link.href)
                  ? "text-yellow-400"
                  : "text-white hover:text-yellow-300"
                  }`}
              >
                {link.label}
                <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 rounded-lg bg-yellow-400 transition-all duration-400 ${isActive(link.href) ? "w-full" : "w-0"}`}></span>

              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {(session?.user as any)?.role === 'ADMIN' && (
                  <Button type="primary" className="!px-4 rounded-lg whitespace-nowrap" onClick={handleDashboardClick}>Dashboard</Button>
                )}
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
                        <p className="text-sm font-medium text-text-primary capitalize">{getUserName()}</p>
                        <p className="text-xs text-text-tertiary mt-1 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <div className="p-1.5 flex flex-col gap-0.5">
                        <button
                          onClick={handleProfile}
                          className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-bg-muted rounded-lg transition-colors flex items-center gap-2"
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </button>
                        <button
                          onClick={handleSupportUs}
                          className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-bg-muted rounded-lg transition-colors flex items-center gap-2"
                        >
                          <HelpCircle className="w-4 h-4" />
                          <span>Support Us</span>
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
              </>
            ) : (
              <>
                <Button className="!px-4 rounded-lg" onClick={() => router.push(routes.auth.login)}> Login</Button>
                <Button type="primary" className="!px-4 rounded-lg whitespace-nowrap" onClick={() => router.push(routes.auth.register)}> Sign Up</Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className={`md:hidden pb-4 space-y-2 ${isMenuOpen ? "block" : "hidden"}`}>
          {/* Games Dropdown - Mobile */}
          <div className="space-y-1">
            <button
              onClick={() => setIsGamesDropdownOpen(!isGamesDropdownOpen)}
              className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isGameRoute()
                ? "bg-yellow-400/20 text-yellow-400"
                : "text-white hover:text-yellow-300 hover:bg-white/5"
                }`}
            >
              <span>Games</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${isGamesDropdownOpen ? "rotate-180" : ""
                  }`}
              />
            </button>
            {isGamesDropdownOpen && (
              <div className="pl-4 space-y-1">
                <Link
                  href={routes.game1}
                  onClick={() => {
                    setIsGamesDropdownOpen(false);
                    setIsMenuOpen(false);
                  }}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === routes.game1
                    ? "bg-yellow-400/20 text-yellow-400"
                    : "text-white hover:text-yellow-300 hover:bg-white/5"
                    }`}
                >
                  Game 1
                </Link>
                <Link
                  href={routes.game2}
                  onClick={() => {
                    setIsGamesDropdownOpen(false);
                    setIsMenuOpen(false);
                  }}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === routes.game2
                    ? "bg-yellow-400/20 text-yellow-400"
                    : "text-white hover:text-yellow-300 hover:bg-white/5"
                    }`}
                >
                  Game 2
                </Link>
              </div>
            )}
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => {
              }}
              className={`block flex gap-1 items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(link.href)
                ? "bg-yellow-400/20 text-yellow-400"
                : "text-white hover:text-yellow-300 hover:bg-white/5"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

