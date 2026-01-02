import { Skeleton } from "@/components/ui/Skeleton";

const SubscriptionDashboardStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className="bg-bg-card border border-border-primary rounded-lg p-6 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <Skeleton className="h-3 w-28 mb-2" />
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-3 w-20" />
            </div>

            {/* Icon placeholder */}
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>

          {/* Growth + Chart (only for first 3 cards) */}
          {index !== 4 && (
            <div className="flex justify-between items-start gap-2 mt-4">
              {/* Growth Indicator */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-3 w-10" />
              </div>

              {/* Mini Chart Skeleton */}
              <div className="w-32 h-16 -mt-6 flex items-end gap-1">
                {[1, 2, 3, 4, 5].map((bar) => (
                  <Skeleton
                    key={bar}
                    className="w-3 rounded-sm"
                    style={{
                      height: `${20 + bar * 6}px`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SubscriptionDashboardStatsSkeleton;
