import { cn } from "@/lib/utils";

interface SettingsSkeletonProps {
  className?: string;
}

export function SettingsSkeleton({ className }: SettingsSkeletonProps) {
  return (
    <div className={cn("space-y-4 w-full", className)}>
      {/* Title and description skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-muted rounded-md animate-pulse w-48" />
        <div className="h-4 bg-muted rounded-md animate-pulse w-64" />
      </div>

      {/* Tabs and content skeleton */}
      <div className="mt-8 space-y-6">
        <div className="h-10 bg-muted rounded-md animate-pulse" />
        <div className="space-y-4">
          <div className="h-24 bg-muted rounded-md animate-pulse" />
          <div className="h-24 bg-muted rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  );
}
