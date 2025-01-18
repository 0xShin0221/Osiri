import { cn } from "@/lib/utils";
import { Loader2, type LucideProps } from "lucide-react";

interface SpinnerProps extends Omit<LucideProps, "ref"> {
  size?: number;
}

export function Spinner({ className, size = 24, ...props }: SpinnerProps) {
  return (
    <Loader2
      className={cn("animate-spin", className)}
      size={size}
      {...props}
    />
  );
}