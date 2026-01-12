"use client";

import { Button } from "@/components/ui/Button";
import { refreshSubscriptionStatus } from "@/utilities/auth/refreshSubscription";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function SubscriptionSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 p-10 text-center shadow-2xl"
      >
        {/* Glow */}
        <div className="absolute inset-0 rounded-2xl  opacity-30 " />

        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative z-10 mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center bg-green-500/20 text-green-400"
        >
          <CheckCircle2 className="w-10 h-10" />
        </motion.div>

        {/* Text */}
        <h1 className="relative z-10 text-3xl font-bold text-white mb-2">
          Subscription Activated
        </h1>

        <p className="relative z-10 text-gray-400 mb-8">
          Your payment was successful and your subscription is now active.
        </p>

        {/* Actions */}
        <div className="relative z-10 flex flex-col gap-3">
          <Button
            size="large"
            className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 text-black font-semibold"
            onClick={() => window.location.href = "/"}
          >
            Go to Dashboard
          </Button>

        </div>
      </motion.div>
    </div>
  );
}
