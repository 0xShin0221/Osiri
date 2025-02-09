import { cn } from "@/lib/utils";

interface SubscriptionSkeletonProps {
  className?: string;
}

export function SubscriptionSkeleton({ className }: SubscriptionSkeletonProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="h-32 bg-muted rounded-md animate-pulse" />
      <div className="h-32 bg-muted rounded-md animate-pulse" />
    </div>
  );
}
