"use client";

import { Skeleton } from "@/components/ui/Skeleton";
import { motion } from "framer-motion";

export function DrawHistorySkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <motion.div
          key={index}
          className="bg-black/75 backdrop-blur-md rounded-xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Left Section - Date & Time */}
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center justify-center min-w-[80px]">
                <Skeleton className="h-3 w-12 mb-2" />
                <Skeleton className="h-8 w-8 rounded-full mb-1" />
                <Skeleton className="h-3 w-12" />
              </div>

              <div className="h-16 w-px bg-white/10"></div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-30 rounded-full" />
                  <Skeleton className="h-6 w-30" />
                </div>
                <Skeleton className="h-8 w-32" />
              </div>
            </div>

            {/* Right Section - Stats */}
            <div className="flex items-center gap-6 md:gap-8">
              <div className="flex items-center gap-1">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <Skeleton
                    key={idx}
                    className="w-10 h-10 rounded-full"
                  />
                ))}
              </div>
             
              <div className="w-10 h-10 hidden sm:flex rounded-lg bg-yellow-400/10 border border-yellow-400/20" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
