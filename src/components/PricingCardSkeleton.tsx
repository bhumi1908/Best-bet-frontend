import React from 'react'
import { Skeleton } from './ui/Skeleton'
import { motion } from "framer-motion";

const staggerContainer = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const PricingCardSkeleton = () => {
    return (
        <motion.div
            className="mb-12"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
        >
            {/* Plans Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {[1, 2, 3].map((index) => (
                    <div
                        key={index}
                        className="relative flex flex-col bg-black/55 backdrop-blur-md rounded-2xl p-8 border-2 border-border-primary"
                    >
                        {/* Popular Badge Skeleton (only for middle card) */}
                        {index === 2 && (
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <Skeleton className="h-6 w-28 rounded-full" />
                            </div>
                        )}

                        {/* Plan Name and Price Skeleton */}
                        <div className="text-center mb-6">
                            <Skeleton className="h-7 w-32 mx-auto mb-3" />
                            <div className="flex items-baseline justify-center gap-2">
                                <Skeleton className="h-10 w-24" />
                                <Skeleton className="h-5 w-20" />
                            </div>
                        </div>

                        {/* Features List Skeleton */}
                        <ul className="space-y-3 mb-8">
                            {[1, 2, 3, 4, 5, 6, 7].map((featureIndex) => (
                                <li key={featureIndex} className="flex items-cnter gap-2 mt-1">
                                    <Skeleton className="h-4 w-4 rounded-full flex-shrink-0" />
                                    <Skeleton className="h-4 flex-1" />
                                </li>
                            ))}
                        </ul>

                        {/* Button Skeleton */}
                        <div className="mt-auto">
                            <Skeleton className="h-8 w-full rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}

export default PricingCardSkeleton
