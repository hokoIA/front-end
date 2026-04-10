import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-hk-border-subtle",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
