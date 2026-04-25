"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { formatCompactNumber } from "@/features/dashboard/utils/format";
import { cn } from "@/lib/utils/cn";

type MetricOverviewCardProps = {
  label: string;
  value: number | null;
  hint?: string;
  loading?: boolean;
  className?: string;
};

export function MetricOverviewCard({
  label,
  value,
  hint,
  loading,
  className,
}: MetricOverviewCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-hk-border-subtle bg-hk-surface px-4 py-3.5 shadow-hk-xs",
        className,
      )}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-hk-muted">
        {label}
      </p>
      {loading ? (
        <Skeleton className="mt-2 h-8 w-24" />
      ) : (
        <p className="mt-1.5 text-[1.85rem] font-semibold tabular-nums tracking-[-0.02em] text-hk-deep">
          {value === null ? "—" : formatCompactNumber(value)}
        </p>
      )}
      {hint && !loading && (
        <p className="mt-1.5 text-xs leading-relaxed text-hk-muted">{hint}</p>
      )}
    </div>
  );
}
