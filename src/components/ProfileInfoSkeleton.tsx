import { Skeleton } from "@/components/ui/Skeleton";
import { Package } from "lucide-react";

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
  return (
    <div className="bg-white/5 rounded-2xl p-8 border border-white/10 text-center">
      <Package className="w-10 h-10 text-gray-500 mx-auto mb-3" />
      <h3 className="text-lg font-semibold text-white mb-1">
        No Active Subscription
      </h3>
      <p className="text-sm text-gray-400">
        You don’t have an active plan. Choose a plan to unlock premium features.
      </p>
    </div>
  );
}
