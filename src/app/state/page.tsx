"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { routes } from "@/utilities/routes";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { getAllStatesThunk } from "@/redux/thunk/statesThunk";
import { getStatePerformanceThunk } from "@/redux/thunk/statePerformanceThunk";
import { StatePerformanceSummaryCardSkeleton } from "@/components/ui/StatePerformanceSummaryCardSkeleton";
import { StatePerformanceTableSkeleton } from "@/components/ui/StatePerformanceTableSkeleton";
import { StatePerformanceStatsSkeleton } from "@/components/ui/StatePerformanceStatsSkeleton";
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
import { PerformancePeriod } from "@/types/gameHistory";

export default function StateDetailsPage() {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const userStateName = session?.user?.state?.name ?? "";
  const { states, isLoading: statesLoading } = useAppSelector(
    (state) => state.states
  );
  const { data: performanceData, isLoading: performanceLoading } = useAppSelector(
    (state) => state.statePerformance
  );

  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("week");
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch states on mount if not loaded
  useEffect(() => {
    if (states.length === 0) {
      dispatch(getAllStatesThunk());
    }
  }, [dispatch, states.length]);

  // Get state name from URL query parameter or fall back to user / default state
  const stateName = useMemo(() => {
    const fromQuery = searchParams.get("name");
    if (fromQuery) return fromQuery;
    if (userStateName) return userStateName;
    return "North Carolina"; // default state if user not logged in
  }, [searchParams, userStateName]);

  // Fetch performance data when state name changes
  useEffect(() => {
    if (stateName) {
      dispatch(getStatePerformanceThunk({ state: stateName }));
    }
  }, [dispatch, stateName]);

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

  // Helper function to get start of week (Monday)
  const getStartOfWeek = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    return new Date(d.setDate(diff));
  };

  // Helper function to format week period label
  const formatWeekPeriodLabel = (): string => {
    const now = new Date();
    const weekStart = getStartOfWeek(now);
    const monthName = weekStart.toLocaleString('default', { month: 'short' });
    const day = String(weekStart.getDate()).padStart(2, '0');
    const year = weekStart.getFullYear();
    return `THIS WEEK (Start from ${monthName}, ${day}-${year})`;
  };

  // Helper function to format month period label
  const formatMonthPeriodLabel = (): string => {
    const now = new Date();
    const monthName = now.toLocaleString('default', { month: 'short' });
    const day = String(now.getDate()).padStart(2, '0');
    return `THIS MONTH (${monthName}, ${day})`;
  };

  // Helper function to format year period label
  const formatYearPeriodLabel = (): string => {
    const year = new Date().getFullYear();
    return `Year ${year}`;
  };

  // Calculate summary data from performance data
  const summaryData = useMemo(() => {
    if (!performanceData) return [];

    const currentYear = new Date().getFullYear();
    const currentYearData = performanceData.yearly.find(
      (y) => y.period === String(currentYear)
    );

    // Get latest week and month
    const latestWeek = performanceData.weekly[0];
    const latestMonth = performanceData.monthly[0];

    // Calculate trends
    const getWeekTrend = (): "up" | "down" | "stable" => {
      if (performanceData.weekly.length < 2) return "stable";
      const current = performanceData.weekly[0]?.hitRate || 0;
      const previous = performanceData.weekly[1]?.hitRate || 0;
      if (current > previous) return "up";
      if (current < previous) return "down";
      return "stable";
    };

    const getMonthTrend = (): "up" | "down" | "stable" => {
      if (performanceData.monthly.length < 2) return "stable";
      const current = performanceData.monthly[0]?.hitRate || 0;
      const previous = performanceData.monthly[1]?.hitRate || 0;
      if (current > previous) return "up";
      if (current < previous) return "down";
      return "stable";
    };

    const getYearTrend = (): "up" | "down" | "stable" => {
      if (performanceData.yearly.length < 2) return "stable";
      const current = performanceData.yearly[0]?.hitRate || 0;
      const previous = performanceData.yearly[1]?.hitRate || 0;
      if (current > previous) return "up";
      if (current < previous) return "down";
      return "stable";
    };

    return [
      {
        period: formatWeekPeriodLabel(),
        hits: latestWeek?.hits || 0,
        totalPlays: latestWeek?.totalPlays || 0,
        hitRate: latestWeek?.hitRate || 0,
        trend: getWeekTrend(),
      },
      {
        period: formatMonthPeriodLabel(),
        hits: latestMonth?.hits || 0,
        totalPlays: latestMonth?.totalPlays || 0,
        hitRate: latestMonth?.hitRate || 0,
        trend: getMonthTrend(),
      },
      {
        period: formatYearPeriodLabel(),
        hits: currentYearData?.hits || 0,
        totalPlays: currentYearData?.totalPlays || 0,
        hitRate: currentYearData?.hitRate || 0,
        trend: getYearTrend(),
      },
    ];
  }, [performanceData]);

  // Get current period data
  const currentData = useMemo(() => {
    if (!performanceData) return [];
    switch (selectedPeriod) {
      case "week":
        return performanceData.weekly;
      case "month":
        return performanceData.monthly;
      case "year":
        return performanceData.yearly;
      default:
        return performanceData.weekly;
    }
  }, [selectedPeriod, performanceData]);

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
                        {states.map((state) => (
                          <button
                            key={state.id}
                            onClick={() => handleStateChange(state.state_name)}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${state.state_name === stateName
                              ? 'bg-yellow-400 text-black font-semibold'
                              : 'text-gray-300 hover:bg-white/10 hover:text-white'
                              }`}
                          >
                            {state.state_name}
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
                Performance overview for Best Bet's Pick 3 predictions in {stateName}. Track
                hit rates, total plays, and performance metrics across different time periods.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* ==================== SUMMARY CARDS SECTION ==================== */}
        <section className="relative px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {performanceLoading ? (
              <StatePerformanceSummaryCardSkeleton />
            ) : (
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
                          {card.period}
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
            )}
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
            {performanceLoading ? (
              <StatePerformanceTableSkeleton />
            ) : (
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
                      Performance
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
                      {currentData.length > 0 ? (
                        currentData.map((row, index) => (
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
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                            No data available for this period
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* ==================== ADDITIONAL STATS SECTION ==================== */}
        <section className="relative px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {performanceLoading ? (
              <StatePerformanceStatsSkeleton />
            ) : (
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
                    value: performanceData?.bestWeek
                      ? formatHitRate(performanceData.bestWeek.hitRate)
                      : "N/A",
                    description: performanceData?.bestWeek?.period || "No data",
                  },
                  {
                    icon: <Award className="w-6 h-6" />,
                    label: "Best Month",
                    value: performanceData?.bestMonth
                      ? formatHitRate(performanceData.bestMonth.hitRate)
                      : "N/A",
                    description: performanceData?.bestMonth?.period || "No data",
                  },
                  {
                    icon: <TrendingUp className="w-6 h-6" />,
                    label: "Avg Hit Rate",
                    value: performanceData?.averageHitRate
                      ? formatHitRate(performanceData.averageHitRate.hitRate)
                      : "N/A",
                    description: `Year ${new Date().getFullYear()}`,
                  },
                  {
                    icon: <CheckCircle2 className="w-6 h-6" />,
                    label: "Total Hits",
                    value: performanceData?.averageHitRate
                      ? String(performanceData.averageHitRate.totalHits)
                      : "0",
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
            )}
          </div>
        </section>

        {/* ==================== CTA SECTION ==================== */}
        {/* <section className="relative px-4 py-16">
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
                <Link href={routes.plans}>
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
        </section> */}
      </div>
    </motion.div>
  );
}

