"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { JSX, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { routes } from "@/utilities/routes";
import { Button } from "@/components/ui/Button";
import {
  CheckCircle2,
  Star,
  Award,
  ArrowRight,
  Target,
  ChevronDown,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { getAllSubscriptionPlansThunk } from "@/redux/thunk/subscriptionPlanThunk";
import PricingCardSkeleton from "@/components/PricingCardSkeleton";
import { Skeleton } from "@/components/ui/Skeleton";
import { createCheckoutSessionThunk } from "@/redux/thunk/subscriptionThunk";
import { toast } from "react-toastify";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { refreshSubscriptionStatus } from "@/utilities/auth/refreshSubscription";

type PlanTier = 1 | 2 | 3;

interface Plan {
  id: number;
  name: string;
  trialDays?: number;
  tier: PlanTier;
  originalPrice?: number;
  price: number;
  period: string;
  description?: string;
  popular: boolean;
  cta: string;
  icon: JSX.Element;
  discountPercent?: number;
  features: {
    name: string;
  }[];
}


const PLAN_TIER_MAP: Record<string, PlanTier> = {
  'Free Plan': 1,
  'Yearly Plan': 2,
  'Monthly Plan': 3,
};

const PLAN_UI_CONFIG: Record<string, { icon: JSX.Element; cta: string }> = {
  'Basic Plan': {
    icon: <Target className="w-6 h-6" />,
    cta: 'Get Started',
  },
  'Premium Plan': {
    icon: <Star className="w-6 h-6" />,
    cta: 'Most Popular',
  },
  'VIP Plan': {
    icon: <Award className="w-6 h-6" />,
    cta: 'Go VIP',
  },
};

export default function PlansPage() {
  const { data: session, update } = useSession();
  const isAuthenticated = !!session;

  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPath =
    searchParams.toString().length > 0
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

  const dispatch = useAppDispatch();
  const { userPlans: plans, isLoading } = useAppSelector(
    (state) => state.subscriptionPlan
  );
  const { isLoading: subscriptionLoading } = useAppSelector((state) => state.subscription)

  const mappedPlans: Plan[] = useMemo(() => {
    return plans.map((plan, index) => {
      const uiConfig = PLAN_UI_CONFIG[plan.name];

      // Period derived from duration
      const period = plan.duration === 12 ? 'per year' : 'per month';

      const basePrice = Number(plan.price) ?? 0;
      const discountPercent = Number(plan.discountPercent) ?? 0;

      const discountedPrice =
        discountPercent > 0
          ? Number((basePrice * (1 - discountPercent / 100)).toFixed(2))
          : basePrice;

      return {
        id: plan.id,
        name: plan.name,
        description: plan.description ?? '',
        price: discountedPrice,
        originalPrice: plan.price,
        period,
        trialDays: plan.trialDays,
        popular: plan.isRecommended ?? false,
        discountPercent: plan.discountPercent,
        tier: PLAN_TIER_MAP[plan.name],
        cta: uiConfig?.cta ?? 'Get Started',
        icon: uiConfig?.icon ?? <Target className="w-6 h-6" />,
        features: plan.features.map((feature) => ({
          name: feature.name,
        })),
      };
    });
  }, [plans]);

  const allFeatures = useMemo(() => {
    const featureSet = new Set<string>();

    mappedPlans.forEach((plan) => {
      plan.features.forEach((feature) => {
        featureSet.add(feature.name);
      });
    });

    return Array.from(featureSet);
  }, [mappedPlans]);


  const planFeatureMap = useMemo(() => {
    return mappedPlans.map((plan) => ({
      ...plan,
      featureSet: new Set(plan.features.map((f) => f.name)),
    }));
  }, [mappedPlans]);

  const staggerContainer = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const staggerItem = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  };

  const handleSubscribe = async (plan: Plan, index: number) => {
    setLoadingIndex(index)
    if (!isAuthenticated) {
      router.push(
        `${routes.auth.login}?from=${encodeURIComponent(currentPath)}`
      );
      return;
    }

    try {
      const payload = await dispatch(
        createCheckoutSessionThunk(plan.id)
      ).unwrap();

      if (payload.message && !payload.trialActivated && !payload.url) {
        toast.error(payload.message);
        return;
      }

      if (payload.trialActivated) {
        toast.success(payload.message ?? "Trial plan activated successfully!");
        router.push(routes.home);
        return;
      }

      if (payload.url) {
        toast.info("Redirecting to Stripe for payment...");
        window.location.href = payload.url;
        return;
      }

    } catch (error: any) {
      router.push(routes.profile)
    } finally {
      setLoadingIndex(null)
    }
  };

  useEffect(() => {
    dispatch(getAllSubscriptionPlansThunk());
  }, []);



  return (
    <motion.div
      className="min-h-screen bg-black text-white overflow-hidden"
      initial="initial"
      animate="animate"
    >
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-yellow-900/20 via-transparent to-transparent"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
        ></motion.div>
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-yellow-800/10 via-transparent to-transparent"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        ></motion.div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 pt-20 bg-gradient-to-b from-gray-900/15 via-gray-900/10 to-gray-900/5">
        {/* ==================== HERO SECTION ==================== */}
        <section className="relative px-4 py-16">
          <div className="max-w-7xl mx-auto mb-24">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <motion.div
                className="inline-block px-4 py-2 mb-6 rounded-full bg-yellow-400/10 border border-yellow-400/30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-yellow-400 text-sm font-semibold">PRICING</span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-black mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Choose Your{" "}
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent animate-gradient">
                  Winning Plan
                </span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                All plans include our core prediction engine. Upgrade anytime as your needs grow.
              </motion.p>

            </motion.div>
          </div>

          {/* ==================== PLANS GRID SECTION ==================== */}
          <div className="max-w-7xl mx-auto">
            {isLoading ? <div className="mb-8"><PricingCardSkeleton /></div> : <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {mappedPlans.map((plan, index) => {
                return (
                  <motion.div
                    key={index}
                    className={`relative flex flex-col h-full ${plan.popular ? "md:-mt-4 md:mb-4" : ""
                      }`}
                    variants={staggerItem}
                    onMouseEnter={() => setHoveredPlan(index)}
                    onMouseLeave={() => setHoveredPlan(null)}
                  >

                    {/* Plan Card */}
                    <motion.div
                      className={`relative flex flex-col h-full bg-black/55 backdrop-blur-md rounded-2xl p-8 border-2 transition-all duration-300 ${plan.popular
                        ? "border-yellow-400 shadow-2xl shadow-yellow-400/20"
                        : "border-white/10 hover:border-yellow-400/50"
                        }`}
                      whileHover={{ scale: plan.popular ? 1.05 : 1.02, y: -5 }}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      {/* Gradient Overlay on Hover */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent rounded-2xl transition-opacity duration-300 ${hoveredPlan === index ? "opacity-100" : "opacity-0"
                          }`}
                      />
                      {/* Popular Badge */}
                      {plan.popular && (
                        <motion.div
                          className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <span className="bg-yellow-400 text-black px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-yellow-400/30">
                            Most Popular
                          </span>
                        </motion.div>
                      )}

                      {(plan.discountPercent ?? 0) > 0 && (
                        <motion.div
                          className="absolute -top-1 -right-3 z-20"
                          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <div className="relative">
                            <span className="bg-gradient-to-r from-green-500 to-green-600 text-black px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg shadow-green-500/40 flex items-center gap-1">
                              <span className="text-sm">{plan.discountPercent}%</span>
                              <span>OFF</span>
                            </span>
                            {/* Small triangle for ribbon effect */}
                            <div className="absolute -bottom-1 right-2 w-2 h-2 bg-green-600 transform rotate-45"></div>
                          </div>
                        </motion.div>
                      )}



                      {/* Plan Icon */}
                      <div className="relative z-10 mb-4">
                        <motion.div
                          className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black mb-4 shadow-lg shadow-yellow-400/20"
                          transition={{ duration: 0.6 }}
                        >
                          {plan.icon}
                        </motion.div>
                        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                        {plan.description && (
                          <p className="text-gray-400 text-sm">{plan.description}</p>
                        )}
                      </div>

                      {/* Price */}
                      <div className="relative z-10 mb-2">
                        {plan.trialDays ? (
                          <p className="text-3xl font-extrabold text-yellow-400">
                            {plan.trialDays}-day Free Trial
                          </p>
                        ) : (
                          <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-extrabold text-yellow-400">
                              ${plan.price != null ? plan.price.toFixed(2) : '0.00'}
                            </span>
                            <span className="text-gray-400 text-sm">{plan.period}</span>
                          </div>
                        )}
                      </div>
                      {(plan.discountPercent ?? 0) > 0 && (
                        <div className="flex items-baseline gap-1">
                          <span className="text-gray-400 text-2xl line-through">
                            ${plan.originalPrice != null ? plan.originalPrice.toFixed(2) : 'N/A'}
                          </span>
                          <span className="text-gray-400 text-sm">{plan.period}</span>
                        </div>
                      )}


                      {/* Features List */}
                      <ul className="relative z-10 space-y-3 mb-8 flex-grow mt-6">
                        {plan.features.map((feature, featureIndex) => (
                          <motion.li
                            key={featureIndex}
                            className="flex items-start gap-3"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + featureIndex * 0.05 }}
                          >
                            <CheckCircle2 className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />

                            <span
                              className={`text-sm text-gray-300`}
                            >
                              {feature.name}
                            </span>
                          </motion.li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      <div className="relative z-10 mt-auto">
                        <Button
                          type="primary"
                          size="large"
                          loading={loadingIndex === index}
                          onClick={() => handleSubscribe(plan, index)}
                          className={`w-full py-4 rounded-lg font-semibold text-lg ${plan.popular
                            ? "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 text-black shadow-lg shadow-yellow-400/30"
                            : ""
                            }`}
                        >
                          {plan.cta}
                        </Button>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}

            </motion.div>}
          </div>
        </section>

        {/* ==================== FEATURE COMPARISON TABLE ==================== */}
        <section className="relative px-4 py-24 bg-gradient-to-b from-gray-900/15 via-gray-900/10 to-gray-900/5">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="inline-block px-4 py-2 mb-6 rounded-full bg-yellow-500/10 border border-yellow-500/30"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-yellow-500 text-sm font-semibold">COMPARISON</span>
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-black mb-6">
                Detailed <span className="bg-gradient-to-r from-yellow-500 to-yellow-400 bg-clip-text text-transparent">Feature Comparison</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Compare all features side-by-side to find the perfect plan for your needs.
              </p>
            </motion.div>

            {/* Comparison Table */}
            <motion.div
              className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-6 text-white font-bold">Features</th>
                      {mappedPlans.map((plan, index) => (
                        <th
                          key={index}
                          className={`text-center p-6 font-bold ${plan.popular ? "text-yellow-400" : "text-white"
                            }`}
                        >
                          {plan.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (<>
                      {Array.from({ length: 11 }).map((_, rowIndex) => (
                        <tr
                          key={rowIndex}
                          className="border-b border-white/5"
                        >
                          <td className="p-6">
                            <Skeleton className="h-5 w-48 bg-white/10" />
                          </td>
                          {Array.from({ length: 3 }).map((_, colIndex) => (
                            <td key={colIndex} className="p-6 text-center">
                              <Skeleton className="h-6 w-6 rounded-full mx-auto bg-white/10" />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </>) : (

                      allFeatures.map((feature, featureIndex) => (
                        <motion.tr
                          key={featureIndex}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: featureIndex * 0.05 }}
                        >
                          <td className="p-6 text-gray-300">{feature}</td>
                          {mappedPlans.map((plan, planIndex) => {
                            const isAvailable = planFeatureMap.some(
                              (p) =>
                                p.tier <= plan.tier &&
                                p.featureSet.has(feature)
                            );

                            return (
                              <td key={planIndex} className="p-6 text-center">
                                {isAvailable ? (
                                  <CheckCircle2 className="w-6 h-6 text-yellow-400 mx-auto" />
                                ) : (
                                  <div className="w-6 h-6 rounded-full border-2 border-gray-600 mx-auto" />
                                )}
                              </td>
                            );
                          })}
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ==================== WHY CHOOSE US SECTION ==================== */}
        {/* <section className="relative px-4 py-24 bg-gradient-to-b from-gray-900/15 via-gray-900/10 to-gray-900/5">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="inline-block px-4 py-2 mb-6 rounded-full bg-yellow-400/10 border border-yellow-400/30"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-yellow-400 text-sm font-semibold">WHY CHOOSE US</span>
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-black mb-6">
                Why Choose <span className="text-yellow-400">Best Bet?</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Discover what makes us the leading choice for Pick 3 predictions
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
            >
              {[
                {
                  icon: <Target className="w-7 h-7" />,
                  title: "Most Accurate",
                  description:
                    "Industry-leading 94.8% accuracy rate powered by advanced algorithms and historical data analysis.",
                  stat: "94.8%",
                  statLabel: "Accuracy Rate",
                },
                {
                  icon: <Zap className="w-7 h-7" />,
                  title: "Real-Time Updates",
                  description:
                    "Get instant notifications on new predictions and draw results the moment they're available.",
                  stat: "24/7",
                  statLabel: "Live Updates",
                },
                {
                  icon: <BarChart3 className="w-7 h-7" />,
                  title: "Performance Tracking",
                  description:
                    "Track your hits, analyze patterns, and monitor your success with detailed performance metrics.",
                  stat: "10K+",
                  statLabel: "Active Users",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="group relative bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-yellow-400 transition-all duration-300 overflow-hidden"
                  variants={staggerItem}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  {/* Solid colored accent bar on hover */}
        {/* <div className="absolute top-0 left-0 right-0 h-1 bg-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div> */}

        {/* Subtle background pattern 
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute bottom-4 left-4 w-24 h-24 border border-yellow-400 rounded-full"></div>
                  </div>

                  <div className="relative z-10">
                    {/* Icon with solid background 
                    <motion.div
                      className="w-14 h-14 mb-6 rounded-xl bg-yellow-400 flex items-center justify-center text-black shadow-lg shadow-yellow-400/30"
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {item.icon}
                    </motion.div>

                    {/* Stat Display 
                    <div className="mb-4 pb-4 border-b border-white/10">
                      <div className="text-3xl font-black text-yellow-400 mb-1">{item.stat}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">{item.statLabel}</div>
                    </div>

                    {/* Title and Description 
                    <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section> */}

        {/* ==================== FAQ SECTION ==================== */}
        <section className="relative py-24 px-4 bg-gradient-to-b from-gray-900/15 via-gray-900/20 to-gray-900/5">
          <div className="max-w-4xl mx-auto">
            {/* Section Header */}
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="inline-block px-4 py-2 mb-6 rounded-full bg-yellow-500/10 border border-yellow-500/30"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-yellow-500 text-sm font-semibold">FAQ</span>
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-black mb-6">
                Frequently Asked <span className="bg-gradient-to-r from-yellow-500 to-yellow-400 bg-clip-text text-transparent">Questions</span>
              </h2>
              <p className="text-gray-400 text-lg">
                Everything you need to know about Best Bet and our prediction services.
              </p>
            </motion.div>

            {/* FAQ Accordion */}
            <motion.div
              className="space-y-4"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
            >
              {[
                {
                  q: "What's the difference between Basic, Premium, and VIP plans?",
                  a: "Basic Plan ($9.99/month) gives you daily predictions for one state, 30 days of draw history, and email support. Premium Plan ($19.99/month) includes all states, full draw history, advanced analytics, weekly reports, and priority support. VIP Plan ($39.99/month) adds real-time predictions, 24/7 support, custom requests, monthly strategy consultations, and a money-back guarantee."
                },
                {
                  q: "Can I upgrade or downgrade my plan anytime?",
                  a: "Yes! You can change your plan at any time from your dashboard. When you upgrade, you'll get immediate access to the new features. When you downgrade, the changes take effect at the start of your next billing cycle. We'll prorate any charges or credits automatically."
                },
                {
                  q: "What's the difference between monthly and annual billing?",
                  a: "Annual billing offers significant savings - you save up to 17% compared to monthly billing. For example, Premium Plan is $19.99/month ($239.88/year) with monthly billing, but only $199.99/year with annual billing. All features are identical regardless of billing period."
                },
                {
                  q: "Can I cancel my subscription and get a refund?",
                  a: "Yes, you can cancel anytime from your dashboard. Your access continues until the end of your current billing period. VIP members get a 30-day money-back guarantee - if you're not satisfied within the first 30 days, we'll provide a full refund. Monthly subscribers can cancel anytime with no penalty."
                },
                {
                  q: "What happens if I exceed my plan's limits?",
                  a: "If you're on the Basic plan and need access to additional states, you'll need to upgrade to Premium or VIP. We'll notify you when you're approaching your plan limits. You can upgrade instantly to continue using the service without interruption."
                },
                {
                  q: "Do you offer discounts for annual subscriptions?",
                  a: "Yes! Annual subscriptions save you 17% compared to monthly billing. For example, the Premium Plan costs $199.99/year (equivalent to $16.67/month) versus $19.99/month with monthly billing. The longer you commit, the more you save while getting the same great features."
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major credit cards (Visa, MasterCard, American Express, Discover) and debit cards processed securely through Stripe. Your payment information is encrypted and we never store your credit card details on our servers. All transactions are PCI-DSS compliant."
                },
                {
                  q: "Will I lose my data if I downgrade my plan?",
                  a: "No, your account data and prediction history are always preserved. When you downgrade, you'll retain access to your historical data, but some features may become limited based on your new plan. For example, downgrading from Premium to Basic would limit you to one state, but your previous data remains accessible."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  className={`bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden hover:border-yellow-400/50 transition-all duration-300 ${openFaq === index ? 'border-yellow-400' : ''}`}
                  variants={staggerItem}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left"
                  >
                    <span className="font-semibold text-white pr-4">{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-yellow-400 flex-shrink-0 transition-transform ${openFaq === index ? 'rotate-180' : ''
                        }`}
                    />
                  </button>
                  {openFaq === index && (
                    <motion.div
                      className="px-6 pb-5 text-gray-400 leading-relaxed"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.1, ease: "easeInOut" }}
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* More Questions CTA */}
            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-gray-400 mb-4">Still have questions?</p>
              <Link
                href={routes.support}
                className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-semibold"
              >
                Contact Our Support Team
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ==================== FINAL CTA SECTION ==================== */}
        <section className="relative px-4 py-24 bg-gradient-to-b from-gray-900/15 via-gray-900/10 to-gray-900/5">
          <div className="max-w-5xl mx-auto text-center">
            {/* Announcement */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-yellow-500/10 border border-yellow-500/30"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              <span className="text-sm text-yellow-400 font-semibold">
                Limited Time: Get 20% Off Your First Month
              </span>
            </motion.div>
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.h2
                className="text-4xl md:text-6xl font-black mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                Ready to Start{" "}
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 bg-clip-text text-transparent">
                  Winning?
                </span>
              </motion.h2>

              <motion.p
                className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Join 10,000+ members who are already winning with the most accurate Pick 3
                predictions.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Link
                  href={isAuthenticated
                    ? routes.home
                    : routes.auth.register}
                  className="px-10 py-5 bg-white/10 backdrop-blur-md border-2 border-white/20 text-white font-bold text-xl rounded-xl hover:bg-white/20 hover:border-yellow-400/50 transition-all duration-300"
                >
                  {isAuthenticated ? "Go to Dashboard" : "Start Winning Today"}
                </Link>

                <Button
                  type="primary"
                  size="large"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                  className="px-10 py-5 text-xl !w-fit h-fit rounded-lg"
                >
                  Subscribe Now
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Custom Styles for Animations */}
      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </motion.div>
  );
}
