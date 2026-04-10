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
        "rounded-lg border border-hk-border-subtle bg-hk-surface px-4 py-3",
        className,
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wide text-hk-muted">
        {label}
      </p>
      {loading ? (
        <Skeleton className="mt-2 h-8 w-24" />
      ) : (
        <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-hk-deep">
          {value === null ? "—" : formatCompactNumber(value)}
        </p>
      )}
      {hint && !loading && (
        <p className="mt-1 text-xs text-hk-muted">{hint}</p>
      )}
    </div>
  );
}
