import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg";
  text?: string;
}

export function Loading({ 
  size = "default",
  text,
  className,
  ...props 
}: LoadingProps) {
  const spinnerSize = {
    sm: 16,
    default: 24,
    lg: 32,
  }[size];

  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center min-h-[100px] gap-2",
        className
      )}
      {...props}
    >
      <Spinner size={spinnerSize} />
      {text && (
        <p className={cn(
          "text-muted-foreground",
          {
            "text-sm": size === "sm",
            "text-base": size === "default",
            "text-lg": size === "lg",
          }
        )}>
          {text}
        </p>
      )}
    </div>
  );
}