import React from 'react'
import { Skeleton } from './ui/Skeleton'
import { motion } from 'framer-motion'

const RecentDrawSkeleton = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="mt-8">
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
  </motion.div>
  )
}

export default RecentDrawSkeleton