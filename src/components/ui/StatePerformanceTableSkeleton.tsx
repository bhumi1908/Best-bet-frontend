"use client";

import { Skeleton } from "./Skeleton";

export const StatePerformanceTableSkeleton = () => {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
      {/* Table Header */}
      <div className="bg-white/5 border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-7 w-7 rounded bg-white/10" />
          <Skeleton className="h-7 w-48 bg-white/10" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="text-left px-6 py-4">
                <Skeleton className="h-4 w-28 bg-white/10" />
              </th>
              <th className="text-center px-6 py-4">
                <Skeleton className="h-4 w-16 bg-white/10 mx-auto" />
              </th>
              <th className="text-center px-6 py-4">
                <Skeleton className="h-4 w-24 bg-white/10 mx-auto" />
              </th>
              <th className="text-right px-6 py-4">
                <Skeleton className="h-4 w-16 bg-white/10 ml-auto" />
              </th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4].map((index) => (
              <tr key={index} className="border-b border-white/5">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-2 w-2 rounded-full bg-white/10" />
                    <Skeleton className="h-5 w-32 bg-white/10" />
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <Skeleton className="h-6 w-12 bg-white/10 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <Skeleton className="h-5 w-16 bg-white/10 mx-auto" />
                </td>
                <td className="px-6 py-4 text-right">
                  <Skeleton className="h-6 w-20 bg-white/10 ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
