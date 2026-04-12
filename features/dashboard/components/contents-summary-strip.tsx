"use client";

import type { ContentSummaryTotals } from "@/features/dashboard/types";
import { formatCompactNumber } from "@/features/dashboard/utils/format";
import { cn } from "@/lib/utils/cn";

type ContentsSummaryStripProps = {
  summary: ContentSummaryTotals | null | undefined;
  loading?: boolean;
  className?: string;
};

export function ContentsSummaryStrip({
  summary,
  loading,
  className,
}: ContentsSummaryStripProps) {
  if (loading) {
    return (
      <div className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-4", className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="hk-skeleton h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!summary) return null;

  const items = [
    { label: "Conteúdos", value: summary.amountContents },
    { label: "Engajamento total", value: summary.totalEngagement },
    { label: "Curtidas", value: summary.totalLikes },
    { label: "Comentários", value: summary.totalComments },
  ];

  return (
    <div
      className={cn(
        "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {items.map((it) => (
        <div
          key={it.label}
          className="rounded-xl border border-hk-border-subtle bg-hk-canvas/40 px-4 py-3"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wide text-hk-muted">
            {it.label}
          </p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-hk-deep">
            {formatCompactNumber(it.value)}
          </p>
        </div>
      ))}
    </div>
  );
}
