"use client";

import { Skeleton } from "./Skeleton";

export const StatePerformanceStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 text-center"
        >
          {/* Icon */}
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-white/10">
            <Skeleton className="h-full w-full rounded-xl bg-white/10" />
          </div>

          {/* Value */}
          <Skeleton className="h-9 w-24 mx-auto mb-2 bg-white/10" />

          {/* Label */}
          <Skeleton className="h-4 w-32 mx-auto mb-1 bg-white/10" />

          {/* Description */}
          <Skeleton className="h-3 w-28 mx-auto bg-white/10" />
        </div>
      ))}
    </div>
  );
};
