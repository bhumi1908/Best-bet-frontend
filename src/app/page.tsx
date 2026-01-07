"use client";

import Link from "next/link";
import Image from "next/image";
import { routes } from "@/utilities/routes";
import { useSession } from "next-auth/react";
import { JSX, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { motion, useInView } from "framer-motion";
import {
  Target,
  Zap,
  BarChart3,
  MapPin,
  CheckCircle2,
  Users,
  TrendingUp,
  Shield,
  CreditCard,
  Lock,
  Award,
  Star,
  Calendar,
  Search,
  FileText,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  DollarSign,
  Clock,
  Globe,
  BarChart,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as ReBarChart, Bar } from 'recharts';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { getAllSubscriptionPlansThunk } from "@/redux/thunk/subscriptionPlanThunk";
import PricingCardSkeleton from "@/components/PricingCardSkeleton";

// interface Plan {
//   id: number;
//   name: string;
//   price: string;
//   period: string;
//   description?: string;
//   popular: boolean;
//   discount?: boolean;
//   cta: string;
//   icon: JSX.Element;
//   features: {
//     text: string;
//   }[];
// }


// Chart data for performance section
const monthlyHitRateData = [
  { month: 'Jan', rate: 55 },
  { month: 'Feb', rate: 66 },
  { month: 'Mar', rate: 91 },
  { month: 'Apr', rate: 89 },
  { month: 'May', rate: 80 },
  { month: 'Jun', rate: 94 },
  { month: 'Jul', rate: 98 },
  { month: 'Aug', rate: 91 },
  { month: 'Sep', rate: 97 },
  { month: 'Oct', rate: 93 },
  { month: 'Nov', rate: 94 },
  { month: 'Dec', rate: 99 },
];


// const PLAN_UI_CONFIG: Record<string, { icon: JSX.Element; cta: string }> = {
//   'Basic Plan': {
//     icon: <Target className="w-6 h-6" />,
//     cta: 'Get Started',
//   },
//   'Premium Plan': {
//     icon: <Star className="w-6 h-6" />,
//     cta: 'Most Popular',
//   },
//   'VIP Plan': {
//     icon: <Award className="w-6 h-6" />,
//     cta: 'Go VIP',
//   },
// };

// Testimonials data
const testimonials = [
  {
    quote: "Best Bet completely changed my game. I went from random guesses to strategic plays. Hit 3 times in my first month!",
    initials: "MJ",
    name: "Michael J.",
    membership: "Premium Member",
    gradientFrom: "from-yellow-400",
    gradientTo: "to-yellow-600",
  },
  {
    quote: "The accuracy is unreal. I've tried other prediction services, but nothing comes close to Best Bet's hit rate.",
    initials: "SK",
    name: "Sarah K.",
    membership: "VIP Member",
    gradientFrom: "from-yellow-500",
    gradientTo: "to-yellow-600",
  },
  {
    quote: "Worth every penny. The performance tracking alone has helped me understand patterns I never noticed before.",
    initials: "DT",
    name: "David T.",
    membership: "Premium Member",
    gradientFrom: "from-yellow-400",
    gradientTo: "to-yellow-600",
  },
  {
    quote: "I've been using Best Bet for 6 months now and my win rate has increased dramatically. The predictions are spot on!",
    initials: "RL",
    name: "Robert L.",
    membership: "VIP Member",
    gradientFrom: "from-yellow-500",
    gradientTo: "to-yellow-600",
  },
  {
    quote: "The real-time updates are a game changer. I never miss a draw and always have the latest predictions ready.",
    initials: "EM",
    name: "Emily M.",
    membership: "Premium Member",
    gradientFrom: "from-yellow-400",
    gradientTo: "to-yellow-600",
  },
  {
    quote: "Best investment I've made. The comprehensive draw history feature helps me make better decisions every day.",
    initials: "JW",
    name: "James W.",
    membership: "VIP Member",
    gradientFrom: "from-yellow-500",
    gradientTo: "to-yellow-600",
  },
  {
    quote: "As someone new to lottery predictions, Best Bet made it so easy to get started. The results speak for themselves.",
    initials: "LS",
    name: "Lisa S.",
    membership: "Premium Member",
    gradientFrom: "from-yellow-400",
    gradientTo: "to-yellow-600",
  },
  {
    quote: "The customer support is exceptional, and the predictions are incredibly accurate. I've recommended Best Bet to all my friends!",
    initials: "CP",
    name: "Chris P.",
    membership: "VIP Member",
    gradientFrom: "from-yellow-500",
    gradientTo: "to-yellow-600",
  },
];


// Custom Arrow Components for Slider
function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    >
      <div className="custom-arrow custom-arrow-next">
        <ChevronRight className="w-6 h-6" />
      </div>
    </div>
  );
}

function SamplePrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    >
      <div className="custom-arrow custom-arrow-prev">
        <ChevronLeft className="w-6 h-6" />
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { data: session } = useSession();
  const isAuthenticated = !!session;
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);
  const dispatch = useAppDispatch();
  const { plans, isLoading, error } = useAppSelector(
    (state) => state.subscriptionPlan
  );

  // const mappedPlans: Plan[] = useMemo(() => {
  //   return plans.map((plan, index) => {
  //     const uiConfig = PLAN_UI_CONFIG[plan.name];

  //     // Period derived from duration
  //     const period = plan.duration === 12 ? 'per year' : 'per month';
  //     const hasDiscount = index === 2;


  //     return {
  //       id: plan.id,
  //       name: plan.name,
  //       description: plan.description ?? '',
  //       price: `$${plan.price.toFixed(2)}`,
  //       period,
  //       popular: plan.isRecommended,
  //       discount: hasDiscount,

  //       cta: uiConfig?.cta ?? 'Get Started',
  //       icon: uiConfig?.icon ?? <Target className="w-6 h-6" />,
  //       features: plan.features.map((feature) => ({
  //         text: feature.name,
  //       })),
  //     };
  //   });
  // }, [plans]);

  const staggerContainer = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const staggerItem = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 }
  };


  // const handlePlanClick = (plan: any) => {
  //   console.log('plan', plan)
  // }

  // useEffect(() => {
  //   dispatch(getAllSubscriptionPlansThunk());
  // }, []);


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
      <motion.div className="relative z-10">

        {/* ==================== HERO SECTION ==================== */}
        <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 pb-10 ">
          {/* Background Image */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <Image
              src="/images/landing-hero-bg.png"
              alt="Hero Background"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Dark Overlay - 90% opacity to make image 10% visible */}
          <div className="absolute inset-0 bg-black/70 pointer-events-none"></div>

          {/* Floating Elements Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
            <motion.div
              className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            ></motion.div>
            <motion.div
              className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            ></motion.div>
          </div>

          <motion.div
            className="max-w-7xl mx-auto text-center relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Announcement Badge */}
            <motion.div
              className="flex items-center justify-center gap-2 mb-2 rounded-full "
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              <span className="text-sm text-gray-300 group-hover:text-yellow-400 transition-colors flex items-center gap-2">
                <Target className="w-4 h-4" />
                Join 10,000+ Winners Today
              </span> */}
              <Image
                src="/images/small-logo.png"
                alt="Hero Background"
                width={400}
                height={120}
                priority
              />
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-black mb-6 leading-tight"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Welcome To Your
              <br />
              <motion.span
                className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent animate-gradient pl-2 md:pl-3 lg:pl-4 2xl:pl-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                VIP Source!
              </motion.span>


            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-xl md:text-xl 2xl:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              The <span className="text-gray-200">Most Accurate</span> <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent ">Pick 3 Predictions</span>  On The Planet!
            </motion.p>

            <motion.p
              className="text-xl md:text-xl 2xl:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Real time <span className="text-gray-200">draw history</span> and <span className="text-gray-200">live predictions</span> Daily!
            </motion.p>
            {/* Trust Indicators */}
            {/* <motion.div
              className="flex items-center justify-center gap-6 mb-12 text-sm text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                <span>99.9% Uptime</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                <span>38 States Covered</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                <span>Daily Updates</span>
              </motion.div>
            </motion.div> */}

            {/* CTA Buttons */}
            {/* <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <Button
                type="primary"
                size="large"
                onClick={() => window.location.href = isAuthenticated ? routes.home : routes.auth.register}
                className="px-4 py-3 md:px-6 md:py-3 2xl:px-8 !w-fit h-fit rounded-lg font-semibold !text-lg"
              >
                {isAuthenticated ? "Go to Dashboard" : "Start Winning Now"}
              </Button>
              
              <Link
                href="#how-it-works"
                className="px-4 py-3 md:px-6 md:py-3 2xl:px-8 bg-white/5 backdrop-blur-md border border-white/20 text-white font-semibold text-lg rounded-lg hover:bg-white/10 hover:border-yellow-400/50 transition-all duration-300"
              >
                See How It Works
              </Link> 
            </motion.div> */}
          </motion.div>
        </section>

        {/* ==================== KEY FEATURES SECTION ==================== */}
        <section className="relative py-28 px-4 bg-gradient-to-b from-transparent via-gray-900/5 to-gray-900/5">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <motion.div
              className="text-center mb-20"
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
                <span className="text-yellow-400 text-sm font-semibold capitalize">FEATURES</span>
              </motion.div>
              <motion.h2
                className="text-4xl md:text-6xl font-black mb-6 capitalize leading-tight"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Everything You Need to <br /> <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">Win Consistently</span>
              </motion.h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Unlock real-time predictions, comprehensive draw history, and live performance tracking, all in one powerful platform.
              </p>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
             variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
            >
              {/* Feature 1 */}
              <motion.div
                className="group relative bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-yellow-400/50 transition-all duration-300"
                variants={staggerItem}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                <div className="relative">
                  <motion.div
                    className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-sm shadow-yellow-400/20"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Target className="w-7 h-7 text-black" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-white">Most Accurate Predictions</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Industry-leading accuracy, powered by advanced algorithms and historical data analysis.
                  </p>
                </div>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                className="group relative bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-yellow-400/50 transition-all duration-300"
                variants={staggerItem}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                <div className="relative">
                  <motion.div
                    className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-sm shadow-yellow-400/20"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Zap className="w-7 h-7 text-black" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-white">Real-Time Updates</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Get notifications on new predictions and draw results the moment they're available.
                  </p>
                </div>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                className="group relative bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-yellow-400/50 transition-all duration-300"
                variants={staggerItem}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                <div className="relative">
                  <motion.div
                    className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-sm shadow-yellow-400/20"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <BarChart3 className="w-7 h-7 text-black" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-white">Performance Tracking</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                    Track your hits, analyze and monitor your success with detailed performance metrics.
                  </p>
                </div>
              </motion.div>

              {/* Feature 4 */}
              <motion.div
                className="group relative bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-yellow-400/50 transition-all duration-300"
                variants={staggerItem}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                <div className="relative">
                  <motion.div
                    className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-sm shadow-yellow-400/20"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Globe className="w-7 h-7 text-black" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-white">38 States Covered</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Access predictions in 38 States for each draw.
                  </p>
                </div>
              </motion.div>
            </motion.div>
             {/* CTA Buttons */}
            {/* <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <Button
                type="primary"
                size="large"
                onClick={() => window.location.href = isAuthenticated ? routes.home : routes.auth.register}
                className="px-4 py-3 md:px-6 md:py-3 2xl:px-8 !w-fit h-fit rounded-lg font-semibold !text-lg"
              >
                {isAuthenticated ? "Go to Dashboard" : "Start Winning Now"}
              </Button>
            </motion.div> */}
          </div>
        </section>

          {/* ==================== TRUST & SECURITY SECTION ==================== */}
        <section className="relative py-24 px-4 bg-gradient-to-b from-gray-900/15 via-gray-900/10 to-gray-900/5">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <motion.div
              className="text-center mb-20"
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
                               <span className="text-yellow-400 text-sm font-semibold capitalize">TRUST & SECURITY</span>
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-black mb-6 capitalize">
                Your <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">Security</span> is Our Priority
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                We use industry-leading security measures to protect your data and ensure safe transactions.
              </p>
            </motion.div>

            {/* Security Features Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
            >
              <motion.div
                className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center"
                variants={staggerItem}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <motion.div
                  className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Lock className="w-8 h-8 text-black" />
                </motion.div>
                <h3 className="text-xl font-bold mb-3">SSL Encryption</h3>
                <p className="text-gray-400 text-sm">
                  256-bit SSL encryption protects all data transmission.
                </p>
              </motion.div>

              <motion.div
                className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center"
                variants={staggerItem}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <motion.div
                  className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <CreditCard className="w-8 h-8 text-black" />
                </motion.div>
                <h3 className="text-xl font-bold mb-3">Secure Payments</h3>
                <p className="text-gray-400 text-sm">
                  All payments processed through Stripe's secure platform.
                </p>
              </motion.div>

              <motion.div
                className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center"
                variants={staggerItem}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <motion.div
                  className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Shield className="w-8 h-8 text-black" />
                </motion.div>
                <h3 className="text-xl font-bold mb-3">Privacy Protected</h3>
                <p className="text-gray-400 text-sm">
                  We never share your personal information with third parties.
                </p>
              </motion.div>

              <motion.div
                className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center"
                variants={staggerItem}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <motion.div
                  className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Award className="w-8 h-8 text-black" />
                </motion.div>
                <h3 className="text-xl font-bold mb-3">GDPR Compliant</h3>
                <p className="text-gray-400 text-sm">
                  Full compliance with international data protection standards.
                </p>
              </motion.div>
            </motion.div>

           

             {/* <motion.div
              className="text-center mt-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Button
                type="primary"
                size="large"
                onClick={() => window.location.href = isAuthenticated ? routes.home : routes.auth.register}
                className="px-8 py-4 text-lg !w-fit h-fit rounded-lg"
              >
                Start Winning Today
              </Button>
            </motion.div> */}
          </div>
        </section>

        {/* ==================== HOW IT WORKS SECTION ==================== */}
        <section id="how-it-works" className="relative py-24 px-4 bg-gradient-to-b from-gray-900/15 via-gray-900/20 to-gray-900/5">
          <div className="max-w-7xl mx-auto">
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
               <span className="text-yellow-500 text-sm font-semibold capitalize">LET US PROVE IT!</span>
              </motion.div>
              <motion.h2
                className="text-4xl md:text-6xl font-black mb-6 capitalize leading-tight"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Start Winning  <br /> <span className="bg-gradient-to-r from-yellow-500 to-yellow-400 bg-clip-text text-transparent">For Only $9.99 Per Month!</span>
              </motion.h2>
              <p className="text-green-400 text-xl max-w-2xl mx-auto">
                14 Day Free Trial (No Credit Card & with full access)
              </p>
            </motion.div>

            {/* Steps Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
            >
              {/* Step 1 */}
              <motion.div
                className="relative h-full"
                variants={staggerItem}
                whileHover={{ y: -10 }}
              >
                <div className="absolute -top-4 -left-4 text-8xl font-black text-yellow-400/10">01</div>
                <motion.div
                  className="relative h-full bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-yellow-400/50 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    className="w-12 h-12 mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-xl font-bold shadow-lg shadow-yellow-400/30"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    1
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-white">Create Account</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Sign up in under 60 seconds. No credit card required for trial access.
                  </p>
                </motion.div>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                className="relative h-full"
                variants={staggerItem}
                whileHover={{ y: -10 }}
              >
                <div className="absolute -top-4 -left-4 text-8xl font-black text-yellow-500/10">02</div>
                <motion.div
                  className="relative h-full bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-yellow-500/50 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    className="w-12 h-12 mb-6 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-xl font-bold shadow-lg shadow-yellow-500/30"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    2
                  </motion.div>
                   <h3 className="text-xl font-bold mb-3 text-white">Access Predictions</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Get instant access to daily predictions and comprehensive draw history.
                  </p>
                </motion.div>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                className="relative h-full"
                variants={staggerItem}
                whileHover={{ y: -10 }}
              >
                <div className="absolute -top-4 -left-4 text-8xl font-black text-yellow-400/10">03</div>
                <motion.div
                  className="relative h-full bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-yellow-400/50 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    className="w-12 h-12 mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-xl font-bold shadow-lg shadow-yellow-400/30"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    3
                  </motion.div>
                 <h3 className="text-xl font-bold mb-3 text-white">Track & Win</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Monitor your performance and watch your winnings grow over time.
                  </p>
                </motion.div>
              </motion.div>

              {/* Step 4 */}
              {/* <motion.div
                className="relative h-full"
                variants={staggerItem}
                whileHover={{ y: -10 }}
              >
                <div className="absolute -top-4 -left-4 text-8xl font-black text-yellow-500/10">04</div>
                <motion.div
                  className="relative h-full bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-yellow-500/50 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    className="w-12 h-12 mb-6 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-xl font-bold shadow-lg shadow-yellow-500/30"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    4
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-white">Track & Win</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Monitor your performance and watch your winnings grow over time.
                  </p>
                </motion.div>
              </motion.div> */}
            </motion.div>

             {/* Money-Back Guarantee Banner */}
            <motion.div
              className="bg-gradient-to-r from-yellow-400/10 to-yellow-500/10 backdrop-blur-md rounded-2xl p-8 border border-yellow-400/30 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-2 justify-center mb-4">
                <Shield className="w-8 h-8 text-yellow-400" />
                <h3 className="text-3xl font-bold">Best Bet's Guarantee to You!</h3>
              </div>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                If (your State) does not get at least 15 Hits (Exact or Box / Any) within 30 days, we will refund your $9.99 for that month or give you the next month free, (your choice).
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              className="text-center mt-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Button
                type="primary"
                size="large"
                onClick={() => window.location.href = isAuthenticated ? routes.home : routes.auth.register}
                className="px-8 py-4 text-lg !w-fit h-fit rounded-lg"
              >
                Start Winning Today
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ==================== PERFORMANCE SECTION ==================== */}
        {/* <section className="relative py-24 px-4 bg-gradient-to-b from-gray-900/15 via-gray-900/10 to-gray-900/5">
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
                <span className="text-yellow-400 text-sm font-semibold">PROVEN RESULTS</span>
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-black mb-6">
                Numbers That <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">Speak For Themselves</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Our track record of success has helped thousands achieve their winning goals.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
              <motion.div
                className="lg:col-span-2 lg:sticky lg:top-24"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 relative overflow-hidden"
                  whileHover={{ borderColor: "rgba(251, 191, 36, 0.3)" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl -z-0"></div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Monthly Hit Rate Trend</h3>
                        <p className="text-gray-400 text-sm">12-month performance overview</p>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/30">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        <span className="text-yellow-400 text-xs font-semibold">Live</span>
                      </div>
                    </div>

                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReBarChart data={monthlyHitRateData}>
                          <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#fbbf24" stopOpacity={1} />
                              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.8} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                          <XAxis
                            dataKey="month"
                            stroke="#64748b"
                            fontSize={12}
                            tick={{ fill: '#94a3b8' }}
                          />
                          <YAxis
                            stroke="#64748b"
                            fontSize={12}
                            tick={{ fill: '#94a3b8' }}
                            domain={[0, 100]}
                          />
                          <Tooltip
                            cursor={false}
                            contentStyle={{
                              backgroundColor: '#1e293b',
                              border: '1px solid #334155',
                              borderRadius: '12px',
                              padding: '12px',
                              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                            }}
                            labelStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                            itemStyle={{ color: '#e2e8f0' }}
                          />
                          <Bar
                            dataKey="rate"
                            fill="url(#barGradient)"
                            radius={[8, 8, 0, 0]}
                          />
                        </ReBarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Chart Insights */}
        {/* <div className="mt-6 pt-6 border-t border-white/10">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-gray-400 text-xs mb-1">Peak Performance</div>
                          <div className="text-yellow-400 font-bold text-lg">99%</div>
                          <div className="text-gray-500 text-xs">December 2024</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-xs mb-1">Average Rate</div>
                          <div className="text-yellow-400 font-bold text-lg">87.5%</div>
                          <div className="text-gray-500 text-xs">Year-to-date</div>
                        </div>
                      </div>
                    </div> 
                  </div>
                </motion.div>
              </motion.div>
              <motion.div
                className="lg:col-span-1"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="rounded-2xl py-4 space-y-8">
                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 flex items-center justify-center">
                          <Target className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div>
                          <div className="text-gray-400 text-xs font-medium uppercase tracking-wide">Success Rate</div>
                          <motion.div
                            className="text-md font-black bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, type: "spring" }}
                          >
                            94.8%
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <div className="h-px bg-white/10"></div>

                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center">
                          <Users className="w-5 h-5 text-yellow-500" />
                        </div>
                        <div>
                          <div className="text-gray-400 text-xs font-medium uppercase tracking-wide">Active Members</div>
                          <motion.div
                            className="text-md font-black bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, type: "spring", delay: 0.1 }}
                          >
                            10K+
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <div className="h-px bg-white/10"></div>

                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div>
                          <div className="text-gray-400 text-xs font-medium uppercase tracking-wide">Total Winnings</div>
                          <motion.div
                            className="text-md font-black bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, type: "spring", delay: 0.2 }}
                          >
                            $2.5M+
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <div className="h-px bg-white/10"></div>

                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center">
                          <Globe className="w-5 h-5 text-yellow-500" />
                        </div>
                        <div>
                          <div className="text-gray-400 text-xs font-medium uppercase tracking-wide">States Serviced</div>
                          <motion.div
                            className="text-md font-black bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, type: "spring", delay: 0.3 }}
                          >
                            38
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                </div>
              </motion.div>
            </div>
          </div>
        </section> */}

        {/* ==================== SUBSCRIPTION PLANS SECTION ==================== */}
        {/* <section className="relative py-24 px-4 bg-gradient-to-b from-gray-900/15 via-gray-900/20 to-gray-900/5">
          <div className="max-w-7xl mx-auto">
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
                <span className="text-yellow-500 text-sm font-semibold">PRICING</span>
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-black mb-6">
                Choose Your <span className="bg-gradient-to-r from-yellow-500 to-yellow-400 bg-clip-text text-transparent">Winning Plan</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                All plans include our core prediction engine. Upgrade anytime as your needs grow.
              </p>
            </motion.div>

            {isLoading ? <PricingCardSkeleton /> : <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
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

                    <motion.div
                      className={`relative flex flex-col h-full bg-black/55 backdrop-blur-md rounded-2xl p-8 border-2 transition-all duration-300 ${plan.popular
                        ? "border-yellow-400 shadow-2xl shadow-yellow-400/20"
                        : "border-white/10 hover:border-yellow-400/50"
                        }`}
                      whileHover={{ scale: plan.popular ? 1.05 : 1.02, y: -5 }}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent rounded-2xl transition-opacity duration-300 ${hoveredPlan === index ? "opacity-100" : "opacity-0"
                          }`}
                      />
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


                      {plan.discount && (
                        <motion.div
                          className="absolute -top-1 -right-3 z-20"
                          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <div className="relative">
                            <span className="bg-gradient-to-r from-green-500 to-green-600 text-black px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg shadow-green-500/40 flex items-center gap-1">
                              <span className="text-sm">10%</span>
                              <span>OFF</span>
                            </span>
                            <div className="absolute -bottom-1 right-2 w-2 h-2 bg-green-600 transform rotate-45"></div>
                          </div>
                        </motion.div>
                      )}

                      <div className="relative z-10 mb-6">
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

                      <div className="relative z-10 mb-6">
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-extrabold text-yellow-400">
                            {plan.price}
                          </span>
                          <span className="text-gray-400 text-sm">
                            {plan.period}
                          </span>
                        </div>
                      </div>

                      <ul className="relative z-10 space-y-3 mb-8 flex-grow">
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
                              {feature.text}
                            </span>
                          </motion.li>
                        ))}
                      </ul>

                      <div className="relative z-10 mt-auto">
                        <Button
                          type="primary"
                          size="large"
                          onClick={() => handlePlanClick(plan)}
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

            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href={routes.plans}
                className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors font-semibold"
              >
                View Detailed Plan Comparison
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section> */}

        {/* ==================== GEOGRAPHIC REACH SECTION  ==================== */}
        {/* <section className="relative py-24 px-4 bg-gradient-to-b from-gray-900/15 via-gray-900/10 to-gray-900/5">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-20"
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
                <span className="text-yellow-400 text-sm font-semibold">COVERAGE</span>
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-black mb-6">
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">Nationwide Coverage</span> Across 38 States
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                We provide comprehensive Pick 3 prediction services across the United States, with dedicated support for each region.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
            >
              <motion.div
                className="group relative bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-yellow-400/50 transition-all duration-300 overflow-hidden"
                variants={staggerItem}
                whileHover={{ scale: 1.03, y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-yellow-400 font-bold text-lg">East Coast</h3>
                      <p className="text-gray-500 text-xs">12 States</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-3xl font-black text-yellow-400 mb-1">12</div>
                      <div className="text-gray-400 text-xs">Active States</div>
                    </div>
                    <div className="pt-3 border-t border-white/10">
                      <p className="text-gray-300 text-sm leading-relaxed">New York, New Jersey, Pennsylvania, Massachusetts, and more</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="group relative bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-yellow-400/50 transition-all duration-300 overflow-hidden"
                variants={staggerItem}
                whileHover={{ scale: 1.03, y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="text-yellow-500 font-bold text-lg">West Coast</h3>
                      <p className="text-gray-500 text-xs">8 States</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-3xl font-black text-yellow-500 mb-1">8</div>
                      <div className="text-gray-400 text-xs">Active States</div>
                    </div>
                    <div className="pt-3 border-t border-white/10">
                      <p className="text-gray-300 text-sm leading-relaxed">California, Oregon, Washington, Nevada, and more</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="group relative bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-yellow-400/50 transition-all duration-300 overflow-hidden"
                variants={staggerItem}
                whileHover={{ scale: 1.03, y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-yellow-400 font-bold text-lg">Midwest</h3>
                      <p className="text-gray-500 text-xs">10 States</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-3xl font-black text-yellow-400 mb-1">10</div>
                      <div className="text-gray-400 text-xs">Active States</div>
                    </div>
                    <div className="pt-3 border-t border-white/10">
                      <p className="text-gray-300 text-sm leading-relaxed">Illinois, Michigan, Ohio, Indiana, and more</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="group relative bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-yellow-400/50 transition-all duration-300 overflow-hidden"
                variants={staggerItem}
                whileHover={{ scale: 1.03, y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="text-yellow-500 font-bold text-lg">South</h3>
                      <p className="text-gray-500 text-xs">8 States</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-3xl font-black text-yellow-500 mb-1">38</div>
                      <div className="text-gray-400 text-xs">Total Coverage</div>
                    </div>
                    <div className="pt-3 border-t border-white/10">
                      <p className="text-gray-300 text-sm leading-relaxed">Texas, Florida, Georgia, and all southern states. 24/7 support available nationwide.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-gray-400 mb-6">
                Want to see predictions for your state? Get started today and access all 38 states with Premium or VIP plans.
              </p>
              <Button
                type="primary"
                size="large"
                onClick={() => window.location.href = routes.plans}
                className="px-8 py-4 text-lg !w-fit h-fit rounded-lg"
              >
                View All Plans
              </Button>
            </motion.div>
          </div>
        </section> */}

        {/* ==================== TESTIMONIALS SECTION ==================== */}
        {/* <section className="relative py-24 px-4 bg-gradient-to-b from-gray-900/15 via-gray-900/20 to-gray-900/5">
          <div className="max-w-7xl mx-auto">
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
                <span className="text-yellow-500 text-sm font-semibold">TESTIMONIALS</span>
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-black mb-6">
                What Our <span className="bg-gradient-to-r from-yellow-500 to-yellow-400 bg-clip-text text-transparent">Winners Say</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Join thousands of satisfied members who have transformed their lottery success with Best Bet.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
            >
              <Slider
                dots={true}
                infinite={true}
                speed={500}
                slidesToShow={3}
                slidesToScroll={1}
                // autoplay={true}
                autoplaySpeed={4000}
                pauseOnHover={true}
                nextArrow={<SampleNextArrow />}
                prevArrow={<SamplePrevArrow />}
                responsive={[
                  {
                    breakpoint: 1024,
                    settings: {
                      slidesToShow: 2,
                      slidesToScroll: 1,
                      arrows: true,
                    }
                  },
                  {
                    breakpoint: 640,
                    settings: {
                      slidesToShow: 1,
                      slidesToScroll: 1,
                      arrows: false,
                    }
                  }
                ]}
                className="testimonials-slider"
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="px-4">
                    <motion.div
                      className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-yellow-400/50 transition-all duration-300 h-full"
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-300 mb-6 leading-relaxed">
                        "{testimonial.quote}"
                      </p>
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradientFrom} ${testimonial.gradientTo} flex items-center justify-center text-black font-bold`}>
                          {testimonial.initials}
                        </div>
                        <div>
                          <div className="text-white font-semibold">{testimonial.name}</div>
                          <div className="text-gray-500 text-sm">{testimonial.membership}</div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </Slider>
            </motion.div>
          </div>
        </section> */}

        {/* ==================== DRAW HISTORY PREVIEW SECTION ==================== */}
        {/* <section className="relative py-24 px-4 bg-gradient-to-b from-gray-900/15 via-gray-900/10 to-gray-900/5">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-20"
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
                <span className="text-yellow-400 text-sm font-semibold">INSIGHTS</span>
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-black mb-6">
                Complete <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">Draw History</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Access comprehensive historical data and analyze patterns to make informed decisions.
              </p>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
            >
              <motion.div
                className="group relative bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-yellow-400/50 transition-all duration-300"
                variants={staggerItem}
                whileHover={{ scale: 1.03, y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6 text-yellow-400" />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-white">Complete History</h4>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    Access years of historical draw data for comprehensive pattern analysis and trend identification.
                  </p>
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                      <span>5+ years of historical data</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                      <span>All 38 states covered</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                      <span>Daily & evening draws</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                      <span>Exportable data formats</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                className="group relative bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-yellow-400/50 transition-all duration-300"
                variants={staggerItem}
                whileHover={{ scale: 1.03, y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 flex items-center justify-center mb-4">
                    <Search className="w-6 h-6 text-yellow-400" />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-white">Advanced Filters</h4>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    Powerful filtering options to find exactly what you need from millions of draw records.
                  </p>
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                      <span>Filter by date range</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                      <span>State & region selection</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                      <span>Draw time filtering</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                      <span>Number pattern search</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                className="group relative bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-yellow-400/50 transition-all duration-300"
                variants={staggerItem}
                whileHover={{ scale: 1.03, y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 flex items-center justify-center mb-4">
                    <BarChart className="w-6 h-6 text-yellow-400" />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-white">Pattern Recognition</h4>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    Advanced analytics to identify trends, patterns, and optimize your prediction strategy.
                  </p>
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                      <span>Hot & cold number analysis</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                      <span>Frequency distribution charts</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                      <span>Trend identification</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                      <span>Predictive insights</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Button
                type="primary"
                size="large"
                onClick={() => window.location.href = '/draw-history'}
                className="px-8 py-4 text-lg !w-fit h-fit rounded-lg"
              >
                View Draw History
              </Button>
            </motion.div>

          </div>
        </section> */}

        {/* ==================== FAQ SECTION ==================== */}
        {/* <section className="relative py-24 px-4 bg-gradient-to-b from-gray-900/15 via-gray-900/20 to-gray-900/5">
          <div className="max-w-4xl mx-auto">
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

            <motion.div
              className="space-y-4"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
            >
              {[
                {
                  q: "How accurate are your predictions?",
                  a: "Our predictions maintain an industry-leading 94.8% accuracy rate. We use advanced algorithms combined with historical data analysis to generate the most reliable predictions possible. While no prediction system can guarantee 100% accuracy due to the random nature of lottery draws, our track record speaks for itself."
                },
                {
                  q: "Which states do you cover?",
                  a: "We currently service 38 states across the United States, with North Carolina being our most active market. Premium and VIP members get access to all states, while Basic plan members can choose one state. We're continuously expanding our coverage based on member demand."
                },
                {
                  q: "Can I cancel my subscription anytime?",
                  a: "Yes! All our plans are month-to-month with no long-term commitment. You can cancel anytime from your dashboard, and you'll retain access until the end of your billing period."
                },
                {
                  q: "How do I access the predictions?",
                  a: "Once you sign up and choose a plan, you'll get instant access to your dashboard where all predictions are displayed. We update predictions daily, and Premium/VIP members receive real-time notifications via email when new predictions are available."
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major credit cards (Visa, MasterCard, American Express, Discover) processed securely through Stripe. Your payment information is encrypted and we never store your credit card details on our servers."
                },
                {
                  q: "Do you offer a free trial?",
                  a: "While we don't offer a traditional free trial, new members can access our Basic plan to test the service at just $9.99/month. This gives you full access to one state's predictions and draw history. making it risk-free to try our premium features."
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
                    <div className="px-6 pb-5 text-gray-400 leading-relaxed">
                      <motion.div
                        className="px-6 pb-5 text-gray-400 leading-relaxed"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.1, ease: "easeInOut" }}
                      >
                        {faq.a}
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>

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
        </section> */}

      

        {/* ==================== FINAL CTA SECTION ==================== */}
        {/* <section className="relative py-24 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute top-10 left-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 6, repeat: Infinity }}
              ></motion.div>
              <motion.div
                className="absolute bottom-10 right-10 w-72 h-72 bg-yellow-600/10 rounded-full blur-3xl"
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, delay: 1 }}
              ></motion.div>
            </div>

            <motion.div
              className="relative z-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-yellow-500/10 border border-yellow-500/30"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                <span className="text-sm text-yellow-400 font-semibold">
                  Limited Time: Get 10% Off Your First Year
                </span>
              </motion.div>

              <motion.h2
                className="text-5xl md:text-7xl font-black mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Ready to
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 bg-clip-text text-transparent pl-3">
                  Winning Big?
                </span>
              </motion.h2>

              <motion.p
                className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Join 10,000+ members who are already winning with the most accurate Pick 3 predictions on the planet.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Button
                  type="primary"
                  size="large"
                  onClick={() => window.location.href = isAuthenticated ? routes.home : routes.auth.register}
                  className="px-10 py-5 text-xl !w-fit h-fit rounded-lg"
                >
                  {isAuthenticated ? "Go to Dashboard" : "Start Winning Today"}
                </Button>

                <Link
                  href={routes.plans}
                  className="px-10 py-5 bg-white/10 backdrop-blur-md border-2 border-white/20 text-white font-bold text-xl rounded-xl hover:bg-white/20 hover:border-yellow-400/50 transition-all duration-300"
                >
                  View All Plans
                </Link>
              </motion.div>

              <motion.div
                className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                  <span>Cancel Anytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                  <span>Instant Access</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section> */}
      </motion.div>

      {/* Custom Styles for Animations */}
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        /* Testimonials Slider Styles */
        .testimonials-slider .slick-track{
          padding: 16px 0;
        }
        .testimonials-slider .slick-dots {
          bottom: -50px;
        }
        .testimonials-slider .slick-dots li button:before {
          color: rgba(255, 255, 255, 0.3);
          font-size: 12px;
        }
        .testimonials-slider .slick-dots li.slick-active button:before {
          color: #fbbf24;
        }
        
        /* Custom Arrow Styles */
        .testimonials-slider .slick-prev,
        .testimonials-slider .slick-next {
          z-index: 10;
          width: 50px;
          height: 50px;
        }
        .testimonials-slider .slick-prev {
          left: -60px;
        }
        .testimonials-slider .slick-next {
          right: -60px;
        }
        .testimonials-slider .slick-prev:before,
        .testimonials-slider .slick-next:before {
          display: none;
        }
        .custom-arrow {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fbbf24;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .custom-arrow:hover {
          background: rgba(251, 191, 36, 0.1);
          border-color: #fbbf24;
          transform: scale(1.05);
        }
        .custom-arrow:active {
          transform: scale(0.95);
        }
        @media (max-width: 1280px) {
          .testimonials-slider .slick-prev {
            left: -40px;
          }
          .testimonials-slider .slick-next {
            right: -40px;
          }
        }
        @media (max-width: 1024px) {
          .testimonials-slider .slick-prev {
            left: -30px;
          }
          .testimonials-slider .slick-next {
            right: -30px;
          }
          .custom-arrow {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </motion.div>
  );
}
