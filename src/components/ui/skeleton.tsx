import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

/**
 * Shimmer skeleton — a gray placeholder with a moving diagonal gradient.
 * Drop it in wherever content is loading, then fade it out when ready.
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-2xl bg-muted/60",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:animate-[shimmer_1.5s_infinite]",
        "before:bg-[linear-gradient(90deg,transparent_0%,hsl(var(--muted-foreground)/0.08)_50%,transparent_100%)]",
        className
      )}
    />
  );
}
