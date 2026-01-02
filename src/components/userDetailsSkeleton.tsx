import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { motion } from "framer-motion";

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

const UserDetailSkeleton = () => {
  return (
    <>

      <motion.div
        className="flex items-center justify-between mb-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <div className="flex gap-2 w-fit">
          {/* Back Button Skeleton */}
          <Skeleton className="h-10 w-10 rounded-full" />

          {/* Title + Description Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 rounded-md" />
            <Skeleton className="h-4 w-64 rounded-md" />
          </div>
        </div>

        {/* Right side: Action buttons */}
        <div className="flex gap-3">
          {/* Edit Button Skeleton */}
          <Skeleton className="h-10 w-24 rounded-lg" />
          {/* Activate/Deactivate Button Skeleton */}
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>

      </motion.div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-4 gap-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >

        {/* Main Details */}
        <div className="lg:col-span-3 space-y-6">
          {/* User Info Card */}
          <div className="bg-bg-card border border-border-primary rounded-lg p-6 relative space-y-4">
            <Skeleton className="h-6 w-24 absolute top-4 right-4" />
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="grid grid-cols-2 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-10 w-full rounded" />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Skeleton className="h-10 w-32 rounded-lg" />
              <Skeleton className="h-10 w-24 rounded-lg" />
            </div>
          </div>

          {/* Subscriptions Card */}
          <div className="bg-bg-card border border-border-primary rounded-lg p-6 space-y-4">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-20 w-full rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-bg-secondary border border-border-primary rounded-lg p-4 space-y-2"
                >
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
            <Skeleton className="h-48 w-full mt-4 rounded-lg" />
          </div>

          {/* Game History */}
          <div className="bg-bg-card border border-border-primary rounded-lg p-6 space-y-4">
            <Skeleton className="h-6 w-48 mb-4" />
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 bg-bg-secondary rounded-lg border border-border-primary"
              >
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Important Dates */}
          <div className="bg-bg-card border border-border-primary rounded-lg p-6 space-y-3">
            <Skeleton className="h-6 w-40 mb-2" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-full rounded" />
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="bg-bg-card border border-border-primary rounded-lg p-6 space-y-3">
            <Skeleton className="h-6 w-40 mb-2" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default UserDetailSkeleton;
