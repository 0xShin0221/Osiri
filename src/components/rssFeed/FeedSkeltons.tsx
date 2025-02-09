import { cn } from "@/lib/utils";

interface FeedCardSkeletonProps {
  className?: string;
}

export function FeedCardSkeleton({ className }: FeedCardSkeletonProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-4 space-y-3", className)}>
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-muted animate-pulse" />
        <div className="h-4 w-48 bg-muted rounded animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-16 rounded-full bg-muted animate-pulse" />
        <div className="h-6 w-16 rounded-full bg-muted animate-pulse" />
      </div>
    </div>
  );
}

export function FeedListSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <FeedCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CategoryFilterSkeleton() {
  return (
    <div className="space-y-2">
      <div className="h-6 w-32 bg-muted rounded animate-pulse" />
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-24 bg-muted rounded-full animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

export function SearchFiltersSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 h-10 bg-muted rounded-md animate-pulse" />
      <div className="w-40 h-10 bg-muted rounded-md animate-pulse" />
    </div>
  );
}
