"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { routes } from "@/utilities/routes";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Target,
  Award,
  ArrowLeft,
  MapPin,
  Clock,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

// Performance data interfaces
interface PerformanceData {
  period: string;
  hits: number;
  totalPlays: number;
  hitRate: number;
}

interface SummaryCard {
  period: string;
  hits: number;
  totalPlays: number;
  hitRate: number;
  trend?: "up" | "down" | "stable";
}

// US States list
const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming"
];

export default function StateDetailsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("week");
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get state name from URL query parameter
  const stateName = useMemo(() => {
    const name = searchParams.get("name");
    return name || "Florida"; // Default to Florida if no state is specified
  }, [searchParams]);

  // Handle state change
  const handleStateChange = (newState: string) => {
    router.push(`${routes.state}?name=${encodeURIComponent(newState)}`);
    setIsStateDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsStateDropdownOpen(false);
      }
    };

    if (isStateDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isStateDropdownOpen]);

  // Mock performance data - Replace with API call
  const summaryData: SummaryCard[] = [
    {
      period: "This Week",
      hits: 4,
      totalPlays: 14,
      hitRate: 28.5,
      trend: "down",
    },
    {
      period: "This Month",
      hits: 32,
      totalPlays: 60,
      hitRate: 53.3,
      trend: "up",
    },
    {
      period: "Year 2025",
      hits: 265,
      totalPlays: 720,
      hitRate: 36.8,
      trend: "up",
    },
  ];

  const weeklyData: PerformanceData[] = [
    { period: "This Week", hits: 4, totalPlays: 14, hitRate: 28.6 },
    { period: "Last Week", hits: 6, totalPlays: 14, hitRate: 42.9 },
    { period: "2 Weeks Ago", hits: 7, totalPlays: 14, hitRate: 50.0 },
    { period: "3 Weeks Ago", hits: 5, totalPlays: 14, hitRate: 35.7 },
  ];

  const monthlyData: PerformanceData[] = [
    { period: "November 2025", hits: 32, totalPlays: 60, hitRate: 53.3 },
    { period: "October 2025", hits: 28, totalPlays: 60, hitRate: 46.7 },
    { period: "September 2025", hits: 35, totalPlays: 60, hitRate: 58.3 },
  ];

  const yearlyData: PerformanceData[] = [
    { period: "2025", hits: 265, totalPlays: 720, hitRate: 36.8 },
    { period: "2024", hits: 240, totalPlays: 720, hitRate: 33.3 },
    { period: "2023", hits: 255, totalPlays: 720, hitRate: 35.4 },
  ];

  // Get current period data
  const currentData = useMemo(() => {
    switch (selectedPeriod) {
      case "week":
        return weeklyData;
      case "month":
        return monthlyData;
      case "year":
        return yearlyData;
      default:
        return weeklyData;
    }
  }, [selectedPeriod]);

  // Animation variants
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

  const formatHitRate = (rate: number) => {
    return `${rate.toFixed(1)}%`;
  };

  const getTrendIcon = (trend?: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

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
      <div className="relative z-10 pt-20 pb-24">
        {/* ==================== HEADER SECTION ==================== */}
        <section className="relative px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Back Button and State Selector Row */}
            <div className="flex items-center justify-between mb-6">
              <motion.button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </motion.button>

              {/* Premium State Selector */}
              <motion.div
                ref={dropdownRef}
                className="relative"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <button
                  onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
                  className="flex items-center gap-3 px-3 sm:px-6 py-1.5 sm:py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:border-yellow-400/50 transition-all duration-300 group"
                >
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                  <span className="text-white font-semibold text-sm sm:text-base">{stateName}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isStateDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isStateDropdownOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-64 max-h-96 overflow-y-auto bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 state-dropdown"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-2">
                        {US_STATES.map((state) => (
                          <button
                            key={state}
                            onClick={() => handleStateChange(state)}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${state === stateName
                              ? 'bg-yellow-400 text-black font-semibold'
                              : 'text-gray-300 hover:bg-white/10 hover:text-white'
                              }`}
                          >
                            {state}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            <motion.div
              className="text-center mb-8"
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
                <span className="text-yellow-400 text-sm font-semibold">PERFORMANCE OVERVIEW</span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Performance Overview <br /> of  <span className="text-yellow-400">{stateName}</span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                className="text-lg md:text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Sample performance overview for Best Bet's Pick 3 predictions in {stateName}. All
                statistics below are placeholders and will be replaced with live data once we connect
                our final pipeline — stay tuned, we are working hard on our site!
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* ==================== SUMMARY CARDS SECTION ==================== */}
        <section className="relative px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {summaryData.map((card, index) => (
                <motion.div
                  key={index}
                  className="group relative bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-yellow-400/50 transition-all duration-300 overflow-hidden"
                  variants={staggerItem}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>

                  <div className="relative z-10">
                    {/* Period Label */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        {card.period} (Sample)
                      </span>
                      {getTrendIcon(card.trend)}
                    </div>

                    {/* Main Stats */}
                    <div className="mb-4">
                      <div className="text-5xl md:text-6xl font-black text-emerald-400 mb-2">
                        {card.hits}/{card.totalPlays}
                      </div>
                      <div className="text-sm text-gray-500 uppercase tracking-wider">
                        Hits / Total Plays
                      </div>
                    </div>

                    {/* Hit Rate */}
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Hit rate</span>
                        <span className="text-2xl font-bold text-yellow-400">
                          {formatHitRate(card.hitRate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ==================== PERFORMANCE TABLES SECTION ==================== */}
        <section className="relative px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Period Selector */}
            <motion.div
              className="flex items-center gap-2 mb-8 bg-white/5 backdrop-blur-md rounded-xl p-2 border border-white/10 w-fit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {[
                { value: "week", label: "Weekly" },
                { value: "month", label: "Monthly" },
                { value: "year", label: "Yearly" },
              ].map((period) => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value as "week" | "month" | "year")}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${selectedPeriod === period.value
                      ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  {period.label}
                </button>
              ))}
            </motion.div>

            {/* Performance Table */}
            <motion.div
              className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Table Header */}
              <div className="bg-white/5 border-b border-white/10 px-6 py-4">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">
                    {selectedPeriod === "week"
                      ? "Weekly"
                      : selectedPeriod === "month"
                        ? "Monthly"
                        : "Yearly"}{" "}
                    Performance (Sample)
                  </h2>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                        {selectedPeriod === "week"
                          ? "Week"
                          : selectedPeriod === "month"
                            ? "Month"
                            : "Year"}
                      </th>
                      <th className="text-center px-6 py-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                        Hits
                      </th>
                      <th className="text-center px-6 py-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                        Total Plays
                      </th>
                      <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                        Hit %
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((row, index) => (
                      <motion.tr
                        key={index}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                            <span className="text-white font-medium">{row.period}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-emerald-400 font-bold text-lg">{row.hits}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-gray-300 font-medium">{row.totalPlays}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-yellow-400 font-bold text-lg">
                            {formatHitRate(row.hitRate)}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ==================== ADDITIONAL STATS SECTION ==================== */}
        <section className="relative px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
            >
              {[
                {
                  icon: <Target className="w-6 h-6" />,
                  label: "Best Week",
                  value: "50.0%",
                  description: "2 Weeks Ago",
                },
                {
                  icon: <Award className="w-6 h-6" />,
                  label: "Best Month",
                  value: "58.3%",
                  description: "September 2025",
                },
                {
                  icon: <TrendingUp className="w-6 h-6" />,
                  label: "Avg Hit Rate",
                  value: "36.8%",
                  description: "Year 2025",
                },
                {
                  icon: <CheckCircle2 className="w-6 h-6" />,
                  label: "Total Hits",
                  value: "265",
                  description: "This Year",
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 text-center"
                  variants={staggerItem}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <motion.div
                    className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 flex items-center justify-center text-yellow-400"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {stat.icon}
                  </motion.div>
                  <div className="text-3xl font-black text-yellow-400 mb-2">{stat.value}</div>
                  <div className="text-sm font-semibold text-white mb-1">{stat.label}</div>
                  <div className="text-xs text-gray-400">{stat.description}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ==================== CTA SECTION ==================== */}
        <section className="relative px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Want to see real-time predictions for {stateName}?
              </h3>
              <p className="text-gray-400 mb-6">
                Get access to live predictions and advanced analytics with our premium plans.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href={routes.predictions}>
                  <motion.button
                    className="px-8 py-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-yellow-400/30 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Predictions
                  </motion.button>
                </Link>
                <Link href={routes.plans}>
                  <motion.button
                    className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/20 text-white font-bold rounded-lg hover:bg-white/20 hover:border-yellow-400/50 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Plans
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}

