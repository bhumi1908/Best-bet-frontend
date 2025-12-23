"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { routes } from "@/utilities/routes";

export default function PlansPage() {
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  const plans = [
    {
      name: "Basic Plan",
      price: "$9.99",
      period: "per month",
      features: [
        "Daily Pick 3 Predictions",
        "Access to 1 State",
        "Draw History (Last 30 Days)",
        "Email Support",
        "Basic Hit Tracker",
      ],
      popular: false,
      cta: "Get Started",
    },
    {
      name: "Premium Plan",
      price: "$19.99",
      period: "per month",
      features: [
        "Daily Pick 3 Predictions",
        "Access to All States",
        "Full Draw History",
        "Priority Email Support",
        "Advanced Hit Tracker",
        "Weekly Performance Reports",
        "Early Access to New Features",
      ],
      popular: true,
      cta: "Most Popular",
    },
    {
      name: "VIP Plan",
      price: "$39.99",
      period: "per month",
      features: [
        "Everything in Premium",
        "Real-time Predictions",
        "24/7 Priority Support",
        "Custom Prediction Requests",
        "Monthly Strategy Consultation",
        "Exclusive VIP Community Access",
        "Money-Back Guarantee",
      ],
      popular: false,
      cta: "Go VIP",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-yellow-400 mb-4">
            Subscription Plans
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Choose the perfect plan for your Pick 3 prediction needs. All plans
            include our most accurate predictions and real-time draw history.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-black/55 backdrop-blur-md rounded-2xl p-8 border-2 transition-all ${
                plan.popular
                  ? "border-yellow-400 scale-105 shadow-2xl shadow-yellow-400/20"
                  : "border-white/10 hover:border-yellow-400/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-extrabold text-yellow-400">
                    {plan.price}
                  </span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">✓</span>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {isAuthenticated ? (
                <Link
                  href={routes.home}
                  className="block w-full text-center px-6 py-3 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition-colors"
                >
                  {plan.cta}
                </Link>
              ) : (
                <Link
                  href={routes.auth.register}
                  className="block w-full text-center px-6 py-3 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition-colors"
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-black/55 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-8">
          <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
            Why Choose Best Bet?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Most Accurate
              </h3>
              <p className="text-gray-400 text-sm">
                Our predictions have the highest accuracy rate in the industry
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Real-Time Updates
              </h3>
              <p className="text-gray-400 text-sm">
                Get instant updates on draw results and new predictions
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Performance Tracking
              </h3>
              <p className="text-gray-400 text-sm">
                Track your success with detailed hit statistics
              </p>
            </div>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-emerald-300 mb-2">
            💰 30-Day Money-Back Guarantee
          </h3>
          <p className="text-gray-300 text-sm">
            Not satisfied? Get a full refund within 30 days, no questions asked.
          </p>
        </div>
      </div>
    </div>
  );
}

