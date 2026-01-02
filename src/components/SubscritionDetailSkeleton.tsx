import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/Skeleton";

export const staggerContainer = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05,
        },
    },
}

const SubscriptionDetailsSkeleton = () => {
    return (
        <motion.div
            className="space-y-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
        >
            {/* HEADER SKELETON */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Left side */}
                <div className="flex gap-2 items-start">
                    <Skeleton className="h-10 w-10 rounded-lg mt-2.5" />

                    <div>
                        <Skeleton className="h-8 w-64 mb-2" />
                        <Skeleton className="h-4 w-80" />
                    </div>
                </div>

                {/* Right side actions */}
                <div className="flex gap-3 justify-end flex-wrap">
                    {[...Array(2)].map((_, i) => (
                        <Skeleton
                            key={i}
                            className="h-10 w-36 rounded-lg"
                        />
                    ))}
                </div>
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT COLUMN */}
                <div className="lg:col-span-2 space-y-6">
                    {/* User Info Card */}
                    <div className="bg-bg-card border border-border-primary rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <Skeleton className="h-6 w-48" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i}>
                                    <Skeleton className="h-3 w-24 mb-2" />
                                    <Skeleton className="h-5 w-full" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Subscription Details Card */}
                    <div className="bg-bg-card border border-border-primary rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <Skeleton className="h-6 w-56" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i}>
                                    <Skeleton className="h-3 w-28 mb-2" />
                                    <Skeleton className="h-5 w-full" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment History Card */}
                    <div className="bg-bg-card border border-border-primary rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <Skeleton className="h-6 w-44" />
                        </div>

                        <div className="p-4 bg-bg-secondary border border-border-primary rounded-lg flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-56" />
                                <Skeleton className="h-3 w-64" />
                            </div>

                            <div className="space-y-2 sm:text-right">
                                <Skeleton className="h-4 w-24 sm:ml-auto" />
                                <Skeleton className="h-3 w-20 sm:ml-auto" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-6">
                    {/* Current Plan Card */}
                    <div className="bg-bg-card border-2 border-border-primary rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <Skeleton className="h-6 w-40" />
                        </div>

                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-64 mb-6" />

                        <div className="flex items-baseline gap-2 mb-6">
                            <Skeleton className="h-10 w-28" />
                            <Skeleton className="h-5 w-16" />
                        </div>

                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Skeleton className="h-5 w-5 rounded-full" />
                                    <Skeleton className="h-4 flex-1" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Admin Info Card */}
                    <div className="bg-bg-card border border-border-primary rounded-lg p-6">
                        <div className="flex gap-3">
                            <Skeleton className="h-5 w-5" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-5/6" />
                            </div>
                        </div>

                        <div className="mt-4 p-3 border border-border-primary rounded-lg">
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default SubscriptionDetailsSkeleton
