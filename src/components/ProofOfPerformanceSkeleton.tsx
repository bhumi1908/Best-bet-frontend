import React from "react";

export const ProofOfPerformanceSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
      {Array.from({ length: 25 }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-xl p-4 flex justify-center items-center flex-col animate-pulse"
        >
          <div className="h-4 w-20 bg-white/10 rounded mb-2" />
          <div className="h-6 w-16 bg-white/15 rounded" />
        </div>
      ))}
    </div>
  );
};

