import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("hk-skeleton rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
