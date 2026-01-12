"use client";

import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { routes } from "@/utilities/routes";
import { useSession } from "next-auth/react";

export default function SubscriptionCancelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status: sessionStatus } = useSession();

  // Route protection: Verify user came from Stripe checkout
  useEffect(() => {
    // Check if session_id is present (Stripe passes this on redirect)
    const sessionId = searchParams.get("session_id");
    
    if (!sessionId) {
      // No session_id means user accessed page directly - redirect to plans
      router.replace(routes.plans);
      return;
    }

    // If session is not authenticated, wait for it
    if (sessionStatus === "loading") {
      return;
    }

    if (sessionStatus === "unauthenticated") {
      // User not logged in - redirect to login
      router.replace(`${routes.auth.login}?from=${encodeURIComponent("/subscription/cancel")}`);
      return;
    }
  }, [searchParams, router, sessionStatus]);

  // Show loading state while checking route protection
  if (sessionStatus === "loading" || !searchParams.get("session_id")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 p-10 text-center shadow-2xl"
      >
        {/* Glow */}
        <div className="absolute inset-0 rounded-2xl opacity-30" />

        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative z-10 mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center  text-red-400"
        >
          <XCircle className="w-10 h-10" />
        </motion.div>

        {/* Text */}
        <h1 className="relative z-10 text-3xl font-bold text-white mb-2">
          Payment Cancelled
        </h1>

        <p className="relative z-10 text-gray-400 mb-8">
          Your subscription was not completed. No charges were made.
        </p>

        {/* Actions */}
        <div className="relative z-10 flex flex-col gap-3">
          <Button
            size="large"
            className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 text-black font-semibold"
            onClick={() => window.location.href = "/plans"}
          >
            Try Again
          </Button>

          <Button
            className="text-gray-400"
            onClick={() => window.location.href = "/"}
          >
            Back to Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
