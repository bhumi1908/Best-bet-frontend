"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { routes } from "@/utilities/routes";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  Search,
  Filter,
  TrendingUp,
  Clock,
  MapPin,
  BarChart3,
  Target,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Calendar as CalendarIcon,
  ArrowUpDown,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Draw history data interface
interface DrawResult {
  id: string;
  date: string;
  time: string;
  numbers: string;
  type: "Midday" | "Evening";
  state: string;
  jackpot?: number;
  winners?: number;
}

export default function DrawHistoryPage() {
  const [selectedState, setSelectedState] = useState<string>("North Carolina");
  const [selectedDrawType, setSelectedDrawType] = useState<string>("All");
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "custom">("week");
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<"date" | "numbers">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const states = [
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Idaho",
    "Illinois",
    "Indiana",
    "Kansas",
    "Kentucky",
    "Maine",
    "Maryland",
    "Michigan",
    "Mississippi",
    "Missouri",
    "North Carolina",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "Ohio",
    "Pennsylvania",
    "South Carolina",
    "Virginia",
    "Vermont",
    "Wisconsin",
  ];

  const drawTypes = ["All", "Midday", "Evening"];

  // Enhanced mock draw history data with more details
  const generateMockDraws = (): DrawResult[] => {
    const draws: DrawResult[] = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Midday draw
      draws.push({
        id: `midday-${i}`,
        date: date.toISOString().split("T")[0],
        time: "12:00 PM",
        numbers: `${Math.floor(Math.random() * 10)}-${Math.floor(Math.random() * 10)}-${Math.floor(Math.random() * 10)}`,
        type: "Midday",
        state: "North Carolina",
        jackpot: Math.floor(Math.random() * 5000) + 1000,
        winners: Math.floor(Math.random() * 50),
      });

      // Evening draw
      draws.push({
        id: `evening-${i}`,
        date: date.toISOString().split("T")[0],
        time: "11:00 PM",
        numbers: `${Math.floor(Math.random() * 10)}-${Math.floor(Math.random() * 10)}-${Math.floor(Math.random() * 10)}`,
        type: "Evening",
        state: "North Carolina",
        jackpot: Math.floor(Math.random() * 5000) + 1000,
        winners: Math.floor(Math.random() * 50),
      });
    }

    return draws;
  };

  const allDraws = generateMockDraws();

  // Filter draws based on selected criteria
  const filteredDraws = allDraws.filter((draw) => {
    // State filter
    if (draw.state !== selectedState) return false;

    // Draw type filter
    if (selectedDrawType !== "All" && draw.type !== selectedDrawType) return false;

    // Date range filter
    const drawDate = new Date(draw.date);
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (drawDate < start || drawDate > end) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        draw.numbers.includes(query) ||
        draw.date.includes(query) ||
        draw.type.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Sort draws
  const sortedDraws = [...filteredDraws].sort((a, b) => {
    if (sortBy === "date") {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      
      // If dates are the same, sort by type (Evening first, then Midday)
      if (dateA === dateB) {
        if (a.type === "Evening" && b.type === "Midday") return -1;
        if (a.type === "Midday" && b.type === "Evening") return 1;
        return 0;
      }
      
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    } else {
      return sortOrder === "asc"
        ? a.numbers.localeCompare(b.numbers)
        : b.numbers.localeCompare(a.numbers);
    }
  });

  // Calculate statistics
  const stats = {
    totalDraws: filteredDraws.length,
    middayDraws: filteredDraws.filter((d) => d.type === "Midday").length,
    eveningDraws: filteredDraws.filter((d) => d.type === "Evening").length,
    totalJackpot: filteredDraws.reduce((sum, d) => sum + (d.jackpot || 0), 0),
    totalWinners: filteredDraws.reduce((sum, d) => sum + (d.winners || 0), 0),
  };

  // Handle date range preset
  const handleDateRangeChange = (range: "today" | "week" | "month" | "custom") => {
    setDateRange(range);
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    switch (range) {
      case "today":
        setStartDate(todayStr);
        setEndDate(todayStr);
        break;
      case "week":
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        setStartDate(weekAgo.toISOString().split("T")[0]);
        setEndDate(todayStr);
        break;
      case "month":
        const monthAgo = new Date(today);
        monthAgo.setDate(monthAgo.getDate() - 30);
        setStartDate(monthAgo.toISOString().split("T")[0]);
        setEndDate(todayStr);
        break;
      case "custom":
        // Keep current dates
        break;
    }
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const staggerItem = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="min-h-screen bg-black text-white overflow-hidden"
      initial="initial"
      animate="animate"
    >
      {/* Background Image with Overlay */}
      <div className="fixed inset-0">
        {/* Blue Background Image with 50% opacity */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/Blue-Background.png)',
          }}
        ></div>
        {/* Dark overlay to maintain theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-gray-900/50 to-black/50"></div>
        {/* Animated gradient overlays for Las Vegas vibe */}
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
                <span className="text-yellow-400 text-sm font-semibold">HISTORY</span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Complete <span className="text-yellow-400">Draw History</span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Access comprehensive historical data and analyze patterns to make informed decisions.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* ==================== FILTERS SECTION ==================== */}
        <section className="relative px-4 py-8" style={{ zIndex: 1 }}>
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="bg-black/75 backdrop-blur-md rounded-2xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ position: "relative", zIndex: 1 }}
            >
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-semibold">Filters & Search</span>
                </div>
                {showFilters ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {showFilters && (
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Search Bar */}
                  <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by numbers, date, or type..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>

                  {/* Filter Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* State Filter */}
                    <div>
                      <label className="block text-sm font-medium text-yellow-300 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        State
                      </label>
                      <Select value={selectedState} onValueChange={setSelectedState}>
                        <SelectTrigger className="w-full bg-black/50 border-white/20 text-white hover:bg-black/70 focus:ring-yellow-400 py-2.5 h-fit">
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {states.map((state) => (
                            <SelectItem
                              key={state}
                              value={state}
                              className="hover:bg-white/10 focus:bg-white/10 text-white"
                            >
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Draw Type Filter */}
                    <div>
                      <label className="block text-sm font-medium text-yellow-300 mb-2">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Draw Type
                      </label>
                      <Select value={selectedDrawType} onValueChange={setSelectedDrawType}>
                        <SelectTrigger className="w-full bg-black/50 border-white/20 text-white hover:bg-black/70 focus:ring-yellow-400 py-2.5 h-fit">
                          <SelectValue placeholder="Select Draw Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {drawTypes.map((type) => (
                            <SelectItem
                              key={type}
                              value={type}
                              className="hover:bg-white/10 focus:bg-white/10 text-white"
                            >
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Date Range Preset */}
                    <div>
                      <label className="block text-sm font-medium text-yellow-300 mb-2">
                        <CalendarIcon className="w-4 h-4 inline mr-1" />
                        Quick Range
                      </label>
                      <Select
                        value={dateRange}
                        onValueChange={(value) =>
                          handleDateRangeChange(value as "today" | "week" | "month" | "custom")
                        }
                      >
                        <SelectTrigger className="w-full bg-black/50 border-white/20 text-white hover:bg-black/70 focus:ring-yellow-400 py-2.5 h-fit">
                          <SelectValue placeholder="Select Date Range" />
                        </SelectTrigger>                       
                        <SelectContent>
                          <SelectItem
                            value="today"
                            className="hover:bg-white/10 focus:bg-white/10 text-white"
                          >
                            Today
                          </SelectItem>
                          <SelectItem
                            value="week"
                            className="hover:bg-white/10 focus:bg-white/10 text-white"
                          >
                            Last 7 Days
                          </SelectItem>
                          <SelectItem
                            value="month"
                            className="hover:bg-white/10 focus:bg-white/10 text-white"
                          >
                            Last 30 Days
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sort By */}
                    <div className="w-full">
                      <label className="block text-sm font-medium text-yellow-300 mb-2">
                        <BarChart3 className="w-4 h-4 inline mr-1" />
                        Sort By
                      </label>
                      <div className="flex gap-2 w-full">
                        <Select
                          value={sortBy}
                          className="w-full"
                          onValueChange={(value) => setSortBy(value as "date" | "numbers")}
                        >
                          <SelectTrigger className="flex-1 bg-black/50 border-white/20 text-white hover:bg-black/70 focus:ring-yellow-400 py-2.5 h-fit">
                            <SelectValue placeholder="Sort By" />
                          </SelectTrigger>                           
                        <SelectContent>
                            <SelectItem
                              value="date"
                              className="hover:bg-white/10 focus:bg-white/10 text-white"
                            >
                              Date
                            </SelectItem>
                            <SelectItem
                              value="numbers"
                              className="hover:bg-white/10 focus:bg-white/10 text-white"
                            >
                              Numbers
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <button
                          onClick={() =>
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                          }
                          className="px-4 py-2 bg-black/50 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors"
                          aria-label="Toggle sort order"
                        >
                          <span className="flex flex-col">
                            <ChevronUp
                              className={cn(
                                "w-3 h-3",
                                sortOrder === "asc" ? "text-accent-primary" : "text-text-muted"
                              )}
                            />
                            <ChevronDown
                              className={cn(
                                "w-3 h-3 -mt-1",
                                sortOrder === "desc" ? "text-accent-primary" : "text-text-muted"
                              )}
                            />
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* ==================== DRAW RESULTS SECTION ==================== */}
        <section className="relative px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {selectedState === "North Carolina" ? (
              <>
                {/* Results Header */}
                <motion.div
                  className="flex items-center justify-between mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {selectedState} Draw Results
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Showing {sortedDraws.length} result{sortedDraws.length !== 1 ? "s" : ""} for{" "}
                      {new Date(startDate).toLocaleDateString()} -{" "}
                      {new Date(endDate).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>

                {/* Draws List */}
                {sortedDraws.length > 0 ? (
                  <motion.div
                    className="space-y-3"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                  >
                    {sortedDraws.map((draw, index) => (
                      <motion.div
                        key={draw.id}
                        className="group bg-black/75 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-yellow-400/50 transition-all duration-300"
                        variants={staggerItem}
                        whileHover={{ scale: 1.01, y: -2 }}
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          {/* Left Section - Date & Time */}
                          <div className="flex items-center gap-6">
                            <div className="flex flex-col items-center justify-center min-w-[80px]">
                              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                {new Date(draw.date).toLocaleDateString("en-US", {
                                  month: "short",
                                })}
                              </div>
                              <div className="text-2xl font-bold text-yellow-400">
                                {new Date(draw.date).getDate()}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(draw.date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                })}
                              </div>
                            </div>

                            <div className="h-16 w-px bg-white/10"></div>

                            <div className="flex flex-col">
                              <div className="flex items-center gap-3 mb-2">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${draw.type === "Midday"
                                    ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30"
                                    : "bg-blue-400/20 text-blue-400 border border-blue-400/30"
                                    }`}
                                >
                                  {draw.type}
                                </span>
                                <span className="text-gray-400 text-sm">{draw.time}</span>
                              </div>
                              <div className="text-2xl md:text-3xl font-black text-white tracking-wider">
                              {draw.numbers.split("-")}
                              </div>
                            </div>
                          </div>

                          {/* Right Section - Stats */}
                          <div className="flex items-center gap-6 md:gap-8">
                          <div className="flex items-center gap-1">
                              {draw.numbers.split("-").map((num, idx) => (
                                <span
                                  key={idx}
                                  className={cn(
                                    "w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center text-md font-semibold border-2 bg-accent-primary text-black border-accent-primary",
                                  )}
                                >
                                  {Number(num)}
                                </span>
                              ))}
                            </div>
                            {draw.jackpot && (
                              <div className="text-right">
                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                  Jackpot
                                </div>
                                <div className="text-base sm:text-lg font-bold text-yellow-400">
                                  ${draw.jackpot.toLocaleString()}
                                </div>
                              </div>
                            )}
                            {draw.winners !== undefined && (
                              <div className="text-right">
                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                  Winners
                                </div>
                                <div className="text-lg font-bold text-emerald-400">
                                  {draw.winners}
                                </div>
                              </div>
                            )}
                            <div className="w-10 h-10 hidden sm:flex rounded-lg bg-yellow-400/10 border border-yellow-400/20 items-center justify-center group-hover:bg-yellow-400/20 transition-colors">
                              <CheckCircle2 className="w-5 h-5 text-yellow-400" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    className="text-center py-16 bg-black/75 backdrop-blur-md rounded-2xl border border-white/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Results Found</h3>
                    <p className="text-gray-400 mb-6">
                      Try adjusting your filters to see more results.
                    </p>
                    <Button
                      type="primary"
                      className="!w-fit py-3 h-fit rounded-lg"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedState("North Carolina");
                        setSelectedDrawType("All");
                        setDateRange("week");
                        handleDateRangeChange("week");
                      }}
                    >
                      Reset Filters
                    </Button>
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div
                className="text-center py-16 bg-black/75 backdrop-blur-md rounded-2xl border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  Draw history for {selectedState} is coming soon!
                </h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Currently, we're servicing North Carolina. More states will be added soon.
                </p>
                <Link href={routes.plans}>
                  <Button type="primary">View Subscription Plans</Button>
                </Link>
              </motion.div>
            )}
          </div>
        </section>

        {/* ==================== CTA SECTION ==================== */}
        <section className="relative px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="bg-black/75 backdrop-blur-md rounded-2xl p-8 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Want to see predictions for upcoming draws?
              </h3>
              <p className="text-gray-400 mb-6">
                Get access to real-time predictions and advanced analytics with our premium plans.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href={routes.predictions}>
                  <Button type="primary" size="large" className="!w-fit py-3 h-fit rounded-lg">
                    View Predictions
                  </Button>
                </Link>
                <Link href={routes.plans}>
                  <Button type="default" size="large" className="!w-fit py-3 h-fit rounded-lg">
                    View Plans
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
