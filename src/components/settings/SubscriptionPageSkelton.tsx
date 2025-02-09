import { CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubscriptionPageSkeletonProps {
  className?: string;
}

export function SubscriptionPageSkeleton({
  className,
}: SubscriptionPageSkeletonProps) {
  return (
    <div className={cn("space-y-8", className)}>
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-muted" />
          <div className="h-9 bg-muted rounded-md animate-pulse w-64" />
        </div>
        <div className="h-5 bg-muted rounded-md animate-pulse w-96 ml-11" />
      </div>

      {/* Plans skeleton */}
      <div className="grid gap-6">
        <div className="grid gap-4">
          <div className="h-64 bg-muted rounded-lg animate-pulse" />
          <div className="h-64 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}
