"use client";

import { routes } from "@/utilities/routes";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Send, Shield, Award, Zap, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    main: [
      { href: routes.state, label: "State" },
      // { href: routes.predictions, label: "Predictions" },
      { href: routes.drawHistory, label: "Draw History" },
      { href: routes.plans, label: "Subscription Plans" },
    ],
    legal: [
      { href: routes.terms, label: "Terms of Service" },
      { href: routes.privacy, label: "Privacy Policy" },
      { href: routes.about, label: "About Us" },
      { href: routes.support, label: "Support" },
    ],
    social: [
      { href: "https://www.facebook.com/", label: "Facebook", icon: Facebook },
      { href: "https://x.com/", label: "Twitter", icon: Twitter },
      { href: "https://www.instagram.com/", label: "Instagram", icon: Instagram },
    ],
  };

  return (
    <footer className="relative bg-black text-white overflow-hidden">
      {/* Ultra Premium Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 via-yellow-900/5 to-black"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-900/10 via-transparent to-transparent"></div>

      {/* Animated Glow Effect */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Top Premium Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent"></div>
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent blur-sm"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section - Enhanced */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <Link href={routes.home} className="inline-block mb-6 group">
              <span className="text-4xl font-black bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent group-hover:from-yellow-300 group-hover:via-yellow-400 group-hover:to-yellow-300 transition-all duration-300">
                Best Bet
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mb-6">
              The Most Accurate Pick 3 Predictions On The Planet! Get real-time
              draw history and live predictions daily. Join thousands of winners
              who trust Best Bet for their lottery predictions.
            </p>

            {/* Premium Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400 hover:text-yellow-400 transition-colors group w-fit">
                <div className="w-8 h-8 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:border-yellow-400/50 group-hover:bg-yellow-400/10 transition-all duration-300">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm">support@bestbet.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 hover:text-yellow-400 transition-colors group w-fit">
                <div className="w-8 h-8 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:border-yellow-400/50 group-hover:bg-yellow-400/10 transition-all duration-300">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm">+1 (512) 361-9158</span>
              </div>
            </div>
          </div>

          {/* Quick Links - Premium Styling */}
          <div className="group">
            <h3 className="text-yellow-400 font-bold mb-6 text-sm uppercase tracking-wider flex items-center gap-2">
              <div className="w-1 h-4 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full"></div>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {footerLinks.main.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-yellow-400 text-sm transition-all duration-300 flex items-center gap-2 group/link"
                  >
                    <span className="w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300 group-hover/link:w-2"></span>
                    <span className="group-hover/link:translate-x-1 transition-transform duration-300">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Support - Premium Styling */}
          <div className="group">
            <h3 className="text-yellow-400 font-bold mb-6 text-sm uppercase tracking-wider flex items-center gap-2">
              <div className="w-1 h-4 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full"></div>
              Legal & Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-yellow-400 text-sm transition-all duration-300 flex items-center gap-2 group/link"
                  >
                    <span className="w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300 group-hover/link:w-2"></span>
                    <span className="group-hover/link:translate-x-1 transition-transform duration-300">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links - Premium Design */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm font-medium">Follow Us:</span>
              <div className="flex items-center gap-3">
                {footerLinks.social.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <Link
                      key={social.label}
                      href={social.href}
                      className="group relative w-10 h-10 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:border-yellow-400/50 hover:bg-yellow-400/10 transition-all duration-300 hover:scale-110"
                      aria-label={social.label}
                    >
                      <IconComponent className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors duration-300" />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  );
                })}
              </div>
            </div>
            <p className="text-gray-500 text-xs">
              © {currentYear} Best Bet. All rights reserved.
            </p>
          </div>
        </div>

        {/* Disclaimer - Premium Styling */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-400 text-xs text-center">
              <strong className="text-yellow-400 font-semibold">Disclaimer:</strong> Best Bet
              provides predictions for entertainment purposes only. Lottery games
              are games of chance, and past results do not guarantee future
              outcomes. Please play responsibly and within your means.
            </p>
          </div>
        </div>

        {/* Premium Bottom Accent */}
        <div className="mt-8 flex justify-center">
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent"></div>
        </div>
      </div>
    </footer>
  );
}

