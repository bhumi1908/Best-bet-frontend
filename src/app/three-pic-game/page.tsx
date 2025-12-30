"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Info, Copy, CheckCircle2, X, Loader2, Sparkles, Target, Zap, BookOpen, ArrowRight, Clock, Calendar, Trophy } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Popup } from "@/components/ui/Popup";
import { Skeleton } from "@/components/ui/Skeleton";
import { routes } from "@/utilities/routes";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ThreePicGamePage() {
  const [predictions, setPredictions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<string>("");
  const [filteredPredictions, setFilteredPredictions] = useState<string[]>([]);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);

  // Mock recent draws data - Replace with actual API call
  const recentDraws = useMemo(() => {
    const draws = [];
    const today = new Date();
    for (let i = 0; i < 20; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const num1 = Math.floor(Math.random() * 10);
      const num2 = Math.floor(Math.random() * 10);
      const num3 = Math.floor(Math.random() * 10);
      draws.push({
        id: `draw-${i}`,
        date: date.toISOString().split("T")[0],
        numbers: `${num1}${num2}${num3}`,
        type: i % 2 === 0 ? "Midday" : "Evening",
        time: i % 2 === 0 ? "12:00 PM" : "11:00 PM",
      });
    }
    return draws;
  }, []);

  // Fetch predictions from API
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/games/three-pic-game");
        const result = await response.json();

        if (result.success && result.data?.predictions) {
          setPredictions(result.data.predictions);
          setFilteredPredictions(result.data.predictions);
        } else {
          throw new Error(result.message || "Failed to fetch predictions");
        }
      } catch (err: any) {
        console.error("Error fetching predictions:", err);
        setError(err.message || "Failed to load predictions");
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  // Filter logic
  useMemo(() => {
    if (!filterValue.trim()) {
      setFilteredPredictions(predictions);
      return;
    }

    const filter = filterValue.trim();
    let filtered: string[] = [];

    if (filter.length === 1) {
      filtered = predictions.filter(pred => pred.includes(filter));
    } else if (filter.length === 2) {
      const [digit1, digit2] = filter.split("");
      filtered = predictions.filter(pred =>
        pred.includes(digit1) && pred.includes(digit2)
      );
    } else {
      filtered = predictions.filter(pred => pred === filter);
    }

    setFilteredPredictions(filtered);
    setSelectedPrediction(null); // Clear selection when filter changes
  }, [filterValue, predictions]);

  const handleCopy = async (number: string) => {
    try {
      await navigator.clipboard.writeText(number);
      setCopiedNumber(number);
      setTimeout(() => setCopiedNumber(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleClearFilter = () => {
    setFilterValue("");
    setSelectedPrediction(null);
  };

  const handlePredictionClick = (number: string) => {
    // Toggle selection: if already selected, deselect it; otherwise select it
    setSelectedPrediction(selectedPrediction === number ? null : number);
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const staggerItem = {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
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
      <div className="relative z-10 pt-30 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
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
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="text-yellow-400 text-sm font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                GAME 1
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Three Pic <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent">Game</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              className="text-xl md:text-2xl text-gray-400 mb-6 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Review 3-digit predictions and use the custom filter to target specific numbers
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              className="flex items-center justify-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                size="large"
                type="default"
                onClick={() => setShowInstructions(true)}
                className=" !w-fit"
                icon={<BookOpen className="w-4 h-4" />}
              >
                How to Play
              </Button>
              <Link href={routes.frontNumberGame}>
                <Button
                  type="primary"
                  size="large"
                  icon={<ArrowRight className="w-4 h-4" />}
                > Front Number Game
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Loading State - Skeleton */}
          {loading && (
            <div className="space-y-8">

              {/* Main Content Skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side - Predictions */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8">
                    {/* Custom Filter Skeleton */}
                    <div className="mb-6 pb-6 border-b border-white/10">
                      <div className="flex items-center gap-3 mb-4">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <Skeleton className="h-6 w-32" />
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Skeleton className="h-4 w-40 mb-2" />
                          <Skeleton className="h-10 w-full rounded-lg" />
                          <Skeleton className="h-3 w-64 mt-2" />
                        </div>
                      </div>
                    </div>

                    {/* Prediction Numbers Header Skeleton */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <Skeleton className="h-7 w-48" />
                      </div>
                      <Skeleton className="h-8 w-24 rounded-lg" />
                    </div>

                    {/* Predictions Grid Skeleton */}
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                      {Array.from({ length: 24 }).map((_, index) => (
                        <Skeleton key={index} className="h-20 rounded-xl" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side - Quick Tips */}
                <div className="lg:col-span-1">
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <Skeleton className="w-10 h-10 rounded-xl" />
                      <Skeleton className="h-7 w-32" />
                    </div>
                    <div className="space-y-4">
                      <Skeleton className="h-32 rounded-xl" />
                      <Skeleton className="h-24 rounded-xl" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Draws Skeleton */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <Skeleton className="h-8 w-48" />
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5">
                        <th className="text-center py-3 px-4">
                          <Skeleton className="h-4 w-8 mx-auto" />
                        </th>
                        <th className="text-left py-3 px-4">
                          <Skeleton className="h-4 w-20" />
                        </th>
                        <th className="text-center py-3 px-4">
                          <Skeleton className="h-4 w-16 mx-auto" />
                        </th>
                        <th className="text-center py-3 px-4">
                          <Skeleton className="h-4 w-8 mx-auto" />
                        </th>
                        <th className="text-center py-3 px-4">
                          <Skeleton className="h-4 w-8 mx-auto" />
                        </th>
                        <th className="text-center py-3 px-4">
                          <Skeleton className="h-4 w-8 mx-auto" />
                        </th>
                        <th className="text-center py-3 px-4">
                          <Skeleton className="h-4 w-20 mx-auto" />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 20 }).map((_, index) => (
                        <tr key={index} className="border-b border-white/5">
                          <td className="py-4 px-4 text-center">
                            <Skeleton className="h-4 w-6 mx-auto" />
                          </td>
                          <td className="py-4 px-4">
                            <Skeleton className="h-4 w-24" />
                          </td>
                          <td className="py-4 px-4 text-center">
                            <Skeleton className="h-6 w-16 mx-auto rounded-full" />
                          </td>
                          <td className="py-4 px-4 text-center">
                            <Skeleton className="h-10 w-10 mx-auto rounded-full" />
                          </td>
                          <td className="py-4 px-4 text-center">
                            <Skeleton className="h-10 w-10 mx-auto rounded-full" />
                          </td>
                          <td className="py-4 px-4 text-center">
                            <Skeleton className="h-10 w-10 mx-auto rounded-full" />
                          </td>
                          <td className="py-4 px-4 text-center">
                            <Skeleton className="h-4 w-16 mx-auto" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto mb-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
            >
              <p className="text-red-400 mb-4">{error}</p>
              <Button
                type="default"
                onClick={() => window.location.reload()}
                className="bg-yellow-400/10 hover:bg-yellow-400/20 border-yellow-400/30"
              >
                Retry
              </Button>
            </motion.div>
          )}

          {/* Main Content */}
          {!loading && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Predictions List - LEFT SIDE */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2"
              >
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 hover:border-white/20 transition-all duration-300">
                  {/* Custom Filter - TOP SECTION */}
                  <div className="mb-6 pb-6 border-b border-white/10">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center shadow-lg shadow-gray-800/20">
                          <Filter className="w-5 h-5 text-yellow-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Custom Filter</h3>
                      </div>
                      {filterValue && (
                        <Button
                          type="default"
                          onClick={handleClearFilter}
                          className="bg-white/5 hover:bg-white/10 border-white/10 hover:border-yellow-400/50 !w-fit py-2.5 h-fit rounded-lg"
                        >
                          Clear Filter
                        </Button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Enter Number or Pair
                        </label>
                        <Input
                          type="text"
                          value={filterValue}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 2);
                            setFilterValue(value);
                          }}
                          placeholder="Type 1 or 2 digits"
                          prefix={<Search className="w-4 h-4 text-gray-400" />}
                          onPressEnter={() => { }}
                          className="w-full bg-white/5 border-white/10 focus:border-yellow-400/50"
                        />
                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-2">
                          <Zap className="w-3 h-3 text-yellow-400" />
                          {filterValue.length === 0 && "Enter 1 number to find all matches"}
                          {filterValue.length === 1 && `Finding all numbers containing "${filterValue}"`}
                          {filterValue.length === 2 && `Finding numbers containing pair "${filterValue}"`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Prediction Numbers Section */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center shadow-lg shadow-gray-800/20">
                        <Zap className="w-5 h-5 text-yellow-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Prediction Numbers</h2>
                    </div>
                    <div className="px-4 py-2 bg-white/5  text-sm border border-white/10 rounded-lg">
                      <span className="text-gray-300 font-semibold text-sm pr-1">
                        {filteredPredictions.length} 
                      </span>{filteredPredictions.length === 1 ? 'Number' : 'Numbers'}
                    </div>
                  </div>

                  {/* Predictions Grid */}
                  {filteredPredictions.length > 0 ? (
                    <motion.div
                      className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-6 xl:grid-cols-8 gap-3 "
                      variants={staggerContainer}
                      initial="initial"
                      animate="animate"
                    >
                      {filteredPredictions.map((pred, index) => (
                        <motion.div
                          key={`${pred}-${index}`}
                          variants={staggerItem}
                          className="relative group flex items-center justify-center"
                        >
                          <div
                            className={cn(
                              "relative border rounded-full w-18 h-18 text-center transition-all duration-300 cursor-pointer flex items-center justify-center",
                              selectedPrediction === pred
                                ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-black shadow-yellow-400/50 border-2 border-yellow-300"
                                : "bg-gradient-to-br from-white/5 to-white/10 border-white/10 hover:border-yellow-400/80 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/15 hover:shadow-lg hover:shadow-gray-800/20"
                            )}
                            onClick={() => handlePredictionClick(pred)}
                          >
                            <div className={cn(
                              "text-lg md:text-xl font-black",
                              selectedPrediction === pred ? "text-black" : "text-yellow-400"
                            )}>
                              {pred}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center py-16">
                      <Filter className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                      <div className="text-gray-400 text-lg mb-4">No predictions match your filter</div>
                      <Button
                        type="default"
                        onClick={handleClearFilter}
                        className="bg-yellow-400/10 hover:bg-yellow-400/20 border-yellow-400/30 !w-fit py-2.5 h-fit rounded-lg"
                      >
                        Clear Filter
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Quick Tips Sidebar - RIGHT SIDE */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-1"
              >
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 hover:border-white/20 transition-all duration-300 sticky top-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center shadow-lg shadow-gray-800/20">
                      <Info className="w-5 h-5 text-yellow-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Quick Tips</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <ul className="space-y-3 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                          <span>Type <span className="text-yellow-400">1 digit</span> (e.g., "5") to see all numbers with 5</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                          <span>Type <span className="text-yellow-400">2 digits</span> (e.g., "23") to see numbers with both 2 and 3</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                          <span>Leave empty to see all predictions</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        <span className="text-yellow-400">Remember:</span> Pick 3 games require patience and discipline.
                        Play consistently yet responsibly.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Recent Draws Section */}
          {!loading && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 hover:border-white/20 transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center shadow-lg shadow-gray-800/20">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Recent Draws (Top 20)</h2>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5">
                        <th className="text-center py-3 px-4 text-sm font-semibold text-yellow-400">#</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-yellow-400">Date</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-yellow-400">Draw</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-yellow-400">P1</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-yellow-400">P2</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-yellow-400">P3</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-yellow-400">3-Digit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentDraws.map((draw, index) => {
                        const numbers = draw.numbers.split("");
                        
                        return (
                          <motion.tr
                            key={draw.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.02 }}
                            className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
                          >
                            <td className="py-4 px-4 text-center text-sm text-gray-300 font-medium">
                              {index + 1}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-300">
                              {new Date(draw.date).toLocaleDateString('en-US', { 
                                month: '2-digit', 
                                day: '2-digit', 
                                year: 'numeric' 
                              })}
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className={`inline-flex items-center px-3 py-1 rounded text-xs font-semibold rounded-full border border-white/10 text-yellow-400`}>
                                {draw.type}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="w-10 h-10 rounded-full bg-white text-black font-black text-sm flex items-center justify-center border-2 border-gray-300 mx-auto">
                                {numbers[0]}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="w-10 h-10 rounded-full bg-white text-black font-black text-sm flex items-center justify-center border-2 border-gray-300 mx-auto">
                                {numbers[1]}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="w-10 h-10 rounded-full bg-white text-black font-black text-sm flex items-center justify-center border-2 border-gray-300 mx-auto">
                                {numbers[2]}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center text-sm font-semibold text-gray-300">
                              {draw.numbers}
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>

      {/* Instructions Popup */}
      <Popup
        open={showInstructions}
        onOpenChange={setShowInstructions}
        title="How to Play Game 1"
        contentClassName="!w-[90vw] lg:!w-[800px] max-h-[85vh] bg-black border-white/10"
        headerClassName=" border-white/10"
      >
        <div className="space-y-5">
          <div className="flex items-start gap-4"> 
            <div className="flex-1">
              <p className="text-gray-300 leading-relaxed mb-2">
                Review the 3-digit predictions shown on the main panel. You can either simply play all the numbers in the list or custom pick from the list by using the "Custom Filter" tool.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
              <p className="text-gray-300 leading-relaxed">
                In the Custom Filter tool, type in just <span className="text-yellow-400">(1) number</span> you want to target and it will pull up every 3-digit number that has your selected number in it (in any position).
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
              <p className="text-gray-300 leading-relaxed">
                Or type in <span className="text-yellow-400">pairs</span> and it will pull up only the 3-digit numbers that contain your 2-digit pairs (in any order).
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
              <p className="text-gray-300 leading-relaxed">
                Simply take a screenshot or photo with your phone and take it to your local store to fill out your play slips.
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-300 leading-relaxed mb-2">
                  <span className="text-yellow-400">*Note:</span> As with all predictions, (these included), we are obviously targeting exact hits and you will get exact hits just by playing the prediction numbers as they are displayed but there absolutely will also be hits that are in "any" / "box" order from the prediction list so you have to decide on your own how you are going to play these numbers.
                </p>
                <p className="text-sm text-gray-300 leading-relaxed">
                  As you know, Pick 3 and all lottery ball games are punishing, brutal and require a lot of patience and discipline. Play consistently yet responsibly. If you don't see it jumping out in your face, might be better to not play some draws if the numbers just don't feel right.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Popup>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #fbbf24, #f59e0b);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #fcd34d, #fbbf24);
        }
      `}</style>
    </motion.div>
  );
}
