import { Skeleton } from "@/components/ui/Skeleton";
import { Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/Button";
import { routes } from "@/utilities/routes";

export function ProfileInfoSkeleton() {
  return (
    <div className="bg-white/5 rounded-2xl p-8 border border-white/10 space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
}


export function SubscriptionTableSkeleton() {
  return (
    <div className="bg-white/5 rounded-2xl p-8 border border-white/10 space-y-4">
      <Skeleton className="h-6 w-48" />
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
}



export function CurrentPlanSkeleton() {
  return (
    <div className="bg-white/5 rounded-2xl p-8 border border-white/10 space-y-5">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-6 w-32" />
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}
export function NoSubscription() {
  const router = useRouter();
  return (
    <div className="bg-white/5 rounded-2xl p-8 border border-white/10 text-center">
      <Package className="w-10 h-10 text-gray-500 mx-auto mb-3" />
      <h3 className="text-lg font-semibold text-white mb-1">
        No Active Subscription
      </h3>
      <p className="text-sm text-gray-400">
        You don’t have an active plan. Choose a plan to unlock premium features.
      </p>
      <Button
        type="primary"
        className="!w-fit mt-4"
        onClick={() => {
          router.push(routes.plans);
        }}
      >
        Browse Plans
      </Button>
    </div>
  );
}


export default function ProfilePageSkeleton() {
  return (
    <section className="relative px-4 py-4 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ================= LEFT COLUMN ================= */}
          <div className="lg:col-span-2 space-y-6">

            {/* Profile Card */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-56" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-32" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Subscriptions Table */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
              <Skeleton className="h-6 w-48 mb-6" />

              <div className="space-y-3">
                <div className="grid grid-cols-6 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>

                {[...Array(4)].map((_, row) => (
                  <div key={row} className="grid grid-cols-6 gap-3">
                    {[...Array(6)].map((_, col) => (
                      <Skeleton key={col} className="h-4 w-full" />
                    ))}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN ================= */}
          <div className="space-y-6">

            {/* Current Plan */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-yellow-400/30">
              <div className="flex justify-between mb-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>

              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />

              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-40 mb-4" />

              <div className="space-y-3 pt-4 border-t border-white/10">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-5 h-5 rounded-full" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                ))}
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
              <Skeleton className="h-5 w-40 mb-4" />

              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg border border-white/10"
                  >
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-56" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}