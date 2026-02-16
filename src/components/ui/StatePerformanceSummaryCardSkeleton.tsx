"use client";

import { Skeleton } from "./Skeleton";

export const StatePerformanceSummaryCardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="relative bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 overflow-hidden"
        >
          {/* Period Label */}
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-4 w-32 bg-white/10" />
            <Skeleton className="h-4 w-4 rounded-full bg-white/10" />
          </div>

          {/* Main Stats */}
          <div className="mb-4">
            <Skeleton className="h-16 w-32 mb-2 bg-white/10" />
            <Skeleton className="h-4 w-40 bg-white/10" />
          </div>

          {/* Hit Rate */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20 bg-white/10" />
              <Skeleton className="h-8 w-24 bg-white/10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
