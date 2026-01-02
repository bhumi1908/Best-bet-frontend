import { Skeleton } from "@/components/ui/Skeleton";

export const StripeIntegrationSkeleton = () => {
  return (
    <div className="bg-bg-card border border-border-primary rounded-lg p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Skeleton className="h-5 w-60" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CONNECTION STATUS */}
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-4">
          <Skeleton className="h-4 w-40 mb-4" />

          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between mb-3"
            >
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          ))}
        </div>

        {/* PAYMENT METHODS */}
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-4">
          <Skeleton className="h-4 w-40 mb-4" />

          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between mb-3"
            >
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* STRIPE DASHBOARD */}
      <div className="mt-6 pt-6 border-t border-border-primary">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-3 w-96" />
          </div>
          <Skeleton className="h-9 w-48 rounded-lg" />
        </div>
      </div>

      {/* INFO BOX */}
      <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-11/12" />
      </div>
    </div>
  );
};

export default StripeIntegrationSkeleton;
