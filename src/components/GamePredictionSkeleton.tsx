import React from 'react'
import { Skeleton } from './ui/Skeleton'

export const Game1PredictionSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
    {/* Left Side - Predictions */}
    <div className="lg:col-span-2 space-y-6">
      <div className="bg-black/75 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8">
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
            <Skeleton key={index} className="h-20 rounded-full" />
          ))}
        </div>
      </div>
    </div>

    {/* Right Side - Quick Tips */}
    <div className="lg:col-span-1">
      <div className="bg-black/75 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8">
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
  )
}

export const Game2PredictionSkeleton = () => {
  return (
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
                    <Skeleton key={index} className="h-20 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
  )
}

