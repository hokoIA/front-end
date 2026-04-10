"use client";

import { cn } from "@/lib/utils/cn";

export function DashboardGlobalLoading({ active }: { active: boolean }) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed left-0 right-0 top-0 z-[100] h-0.5 overflow-hidden bg-hk-border-subtle transition-opacity duration-300",
        active ? "opacity-100" : "opacity-0",
      )}
      aria-hidden={!active}
    >
      <div className="hk-dash-load-inner" />
    </div>
  );
}
