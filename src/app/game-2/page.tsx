"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, Info, Copy, CheckCircle2, X, AlertCircle, Loader2, Sparkles, Zap, ToggleLeft, ToggleRight, BookOpen, ArrowRight, Trophy, Clock, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Popup } from "@/components/ui/Popup";
import { Skeleton } from "@/components/ui/Skeleton";
import { routes } from "@/utilities/routes";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { getLatestPredictionsThunk } from "@/redux/thunk/predictionsThunk";
import { getDrawHistoriesThunk } from "@/redux/thunk/drawHistoryThunk";
import { clearGame2Error, clearRecentDrawsError } from "@/redux/slice/predictionsSlice";
import RecentDrawSkeleton from "@/components/RecentDrawSkeleton";
import { useSession } from "next-auth/react";

export default function FrontNumberGamePage() {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const stateId = session?.user?.stateId;

  // Redux state
  const {
    game2Predictions,
    game2Loading,
    game2Error,
    recentDraws,
    recentDrawsLoading,
    recentDrawsError
  } = useAppSelector((state) => state.predictions);

  // Local UI state
  const [selectedFrontNumber, setSelectedFrontNumber] = useState<string | null>(null);
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);

  const transformFirstDigit = (originalPrediction: string, frontNumber: string | null): string => {
    if (frontNumber === null || originalPrediction.length === 0) {
      return originalPrediction;
    }
    // Replace only the first digit, keep the rest as-is from Excel
    return frontNumber + originalPrediction.slice(1);
  };

  // Get all predictions from Excel (single source of truth)
  // When front number is selected, we'll visually transform them in displayPredictions
  const excelPredictions = useMemo(() => {
    return [...new Set(game2Predictions)].sort();
  }, [game2Predictions]);

  const handleNumberSelect = (number: string) => {
    setSelectedFrontNumber(number);
    setSelectedPrediction(null); // Clear selected prediction when front number changes
  };

  const handleNumberClick = (number: string) => {
    setSelectedPrediction(selectedPrediction === number ? null : number);
  };

  // Apply visual transformation: replace first digit if front number is selected
  const transformedPredictions = useMemo(() => {
    return excelPredictions.map(pred =>
      transformFirstDigit(pred, selectedFrontNumber)
    );
  }, [excelPredictions, selectedFrontNumber]);

  // Final display predictions (with visual transformation applied)
  const displayPredictions = transformedPredictions;

  const staggerContainer = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.1,
      },
    },
  };

  const staggerItem = {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
  };

  // Fetch predictions and recent draws on mount (only if not already loaded)
  useEffect(() => {
      dispatch(getLatestPredictionsThunk({ gameId: 2 }));
  }, [dispatch, game2Predictions.length]);

  useEffect(() => {
    dispatch(getDrawHistoriesThunk({
      sortBy: 'drawDate',
      sortOrder: 'desc',
      stateId: stateId,
    }));
  }, [dispatch, stateId, recentDraws.length]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearGame2Error());
      dispatch(clearRecentDrawsError());
    };
  }, [dispatch]);

  return (
    <motion.div
      className="min-h-screen bg-black text-white overflow-hidden"
      initial="initial"
      animate="animate"
    >
      {/* Background Image with Overlay */}
      <div className="fixed inset-0">
        {/* Yellow Gradient Background Image with 50% opacity */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/yellow-gredient-Background.png)',
            opacity: 0.5
          }}
        ></div>
        {/* Dark overlay to maintain theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-gray-900/10 to-black/10"></div>
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
                GAME 2
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Front Number <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent">Game</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              className="text-xl md:text-2xl text-gray-400 mb-6 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Select your target front number and we'll handle the other 2 numbers for you
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                type="default"
                onClick={() => setShowInstructions(true)}
                size="large"
                className=" !w-fit"
                icon={<BookOpen className="w-4 h-4" />}
              >
                How to Play
              </Button>
              <Link href={routes.game1}>
                <Button
                  type="primary"
                  size="large"
                  icon={<ArrowRight className="w-4 h-4" />}
                > Game 1
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Error State */}
          {(game2Error || recentDrawsError) && !game2Loading && !recentDrawsLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto mb-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
            >
              <p className="text-red-400 mb-4">
                {game2Error || recentDrawsError}
              </p>
              <Button
                type="default"
                onClick={() => {
                  dispatch(getLatestPredictionsThunk({ gameId: 2 }));
                  dispatch(getDrawHistoriesThunk({
                    sortBy: 'drawDate',
                    sortOrder: 'desc',
                  }));
                }}
                className="bg-yellow-400/10 hover:bg-yellow-400/20 border-yellow-400/30"
              >
                Retry
              </Button>
            </motion.div>
          )}

          {/* Loading State - Skeleton */}
          {game2Loading && (
            <div className="space-y-8">
              {/* Number Selector Skeleton */}
              <div className="bg-black/75 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <Skeleton className="h-7 w-64" />
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 md:gap-4">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <Skeleton key={index} className="aspect-square rounded-xl" />
                  ))}
                </div>
              </div>

              {/* Predictions Display Skeleton */}
              <div className="bg-black/75 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-xl" />
                    <Skeleton className="h-7 w-48" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-8 w-24 rounded-lg" />
                  </div>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3">
                  {Array.from({ length: 24 }).map((_, index) => (
                    <Skeleton key={index} className="h-20 rounded-xl" />
                  ))}
                </div>
              </div>

              {/* Recent Draws Skeleton */}
              <div className="bg-black/75 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8">
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

          {/* Number Selector */}
          {!game2Loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <div className="bg-black/75 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center shadow-lg shadow-gray-800/20">
                    <Target className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="flex items-center justify-between gap-2 w-full flex-wrap">
                    <h2 className="text-2xl font-bold text-white">Select Your Target Front Number</h2>
                    {selectedFrontNumber !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Button
                          type="default"
                          size="large"
                          className="!w-fit py-2 h-fit rounded-lg"
                          onClick={() => {
                            setSelectedFrontNumber(null);
                            setSelectedPrediction(null);
                          }}
                          icon={<RefreshCcw className="w-4 h-4" />}
                        >
                          Clear
                        </Button>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
                          <span className="text-gray-300">Selected:</span>
                          <span className="text-yellow-400 font-black text-xl">{selectedFrontNumber}</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-center flex-wrap gap-3 md:gap-4">
                  {Array.from({ length: 10 }, (_, i) => i.toString()).map((number) => (
                    <motion.button
                      key={number}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleNumberSelect(number)}
                      className={cn(
                        "sm:h-16 sm:w-16 h-12 w-12 rounded-xl font-black text-2xl md:text-3xl transition-all duration-300 shadow-lg cursor-pointer",
                        selectedFrontNumber === number
                          ? "bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 shadow-yellow-400/20 border-2 border-yellow-300 "
                          : "bg-gradient-to-br from-white/10 to-white/5 text-white border-2 border-white/10 hover:border-yellow-400/50"
                      )}
                    >
                      {number}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Predictions Display */}
          {!game2Loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <div className="bg-black/75 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 hover:border-yellow-400/50 transition-all duration-300">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center shadow-lg shadow-gray-800/20">
                      <Zap className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Prediction Numbers</h2>
                      <p className="text-sm text-gray-400 mt-1">{selectedFrontNumber === null ?
                        "Showing all predictions" : `Showing predictions for ${selectedFrontNumber}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
                      <span className="text-yellow-400 font-semibold text-sm">
                        {displayPredictions.length} {displayPredictions.length === 1 ? 'Number' : 'Numbers'}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Predictions Grid */}
                {displayPredictions.length > 0 ? (
                  <motion.div
                    className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                  >
                    {displayPredictions.map((pred, index) => (
                      <motion.div
                        key={`${pred}-${index}`}
                        variants={staggerItem}
                        className="relative group flex items-center justify-center"
                      >
                        <div className={cn(
                          "relative border aspect-square w-18 rounded-full cursor-pointer text-center transition-all duration-300 hover:shadow-lg flex items-center justify-center",
                          selectedPrediction === pred
                            ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-black shadow-yellow-400/50 border-2 border-yellow-300"
                            : "bg-gradient-to-br from-white/5 to-white/10 border-white/10 hover:border-yellow-400/50 hover:bg-gradient-to-br hover:from-yellow-400/20 hover:to-yellow-500/20"
                        )} onClick={() => handleNumberClick(pred)}>
                          <div className={cn(
                            "text-lg md:text-xl font-black",
                            "text-yellow-300"
                          )}>
                            {pred}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-16">
                    <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <div className="text-gray-400 text-lg">No predictions available</div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Recent Draws Section */}
          {recentDrawsLoading ? (<RecentDrawSkeleton />) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <div className="bg-black/75 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 hover:border-white/20 transition-all duration-300">
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
                      {recentDraws.length > 0 ? (
                        recentDraws.map((draw, index) => {
                          const numbers = draw.winning_numbers.split("");

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
                                {new Date(draw.draw_date).toLocaleDateString('en-US', {
                                  month: '2-digit',
                                  day: '2-digit',
                                  year: 'numeric'
                                })}
                              </td>
                              <td className="py-4 px-4 text-center">
                                <span className={`inline-flex items-center px-3 py-1 rounded text-xs font-semibold rounded-full border border-white/10 text-yellow-400`}>
                                  {draw.draw_time === 'MID' ? 'MID' : 'EVE'}
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
                                {draw.winning_numbers}
                              </td>
                            </motion.tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-gray-400">
                            No recent draws available
                          </td>
                        </tr>
                      )}
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
        title="How to Play Game 2"
        contentClassName="!w-[90vw] lg:!w-[800px] max-h-[85vh] bg-black border-white/10"
        headerClassName=" border-white/10"
      >
        <div className="space-y-5">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <p className="text-gray-300 leading-relaxed mb-2">
                This is a fun little game where, if you have a personal system you use and are pretty good at getting the front number right, this is a perfect game! Simply click one of the numbers (0 thru 9) and the entire prediction list will adjust to your targeted front number. We'll handle the other 2 numbers for you.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
              <p className="text-gray-300 leading-relaxed">
                Keep in mind, even though you are targeting only the front number, sometimes the actual number that comes out will have all three numbers from within the prediction list but your target front number might actually come out in the middle or end position (P2 or P3) but "a win is a win", it will be a "box" / "any" type hit unless you combo all of the prediction numbers to get an exact hit.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
              <p className="text-gray-300 leading-relaxed">
                <span className="text-yellow-400">Combo numbers</span> locks in an exact hit but be cautious, some of the prediction number lists are quite a bit bigger than others and combo all six ways is more expensive. As we always say, "the math has to work" (financially speaking). That being said, a better bet might be to play as "box" / "any" instead of exact order on your play slips if the investment cost doesn't make sense.
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-300 leading-relaxed">
                  <span className="text-yellow-400">Remember:</span> Pick 3 and other ball lottery games are unforgiving and brutal so play with no emotion, play consistently, with patience and discipline and realistic budget because in reality, we lose more times than we win, the real talent is not how many wins but the quality of the win (investment against profit). If you feel unsure / not confident, just don't play but observe until you feel confident about which numbers you are going to play from the list.
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
