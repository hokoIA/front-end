"use client";

import type { MetricBlockModel } from "@/features/dashboard/types";
import { formatCompactNumber } from "@/features/dashboard/utils/format";
import { blockHasNumericData } from "@/features/dashboard/utils/normalize";
import { getFriendlyErrorMessage } from "@/lib/api/errors";
import { ChartCard } from "@/features/dashboard/components/chart-card";
import { InsightPanel } from "@/features/dashboard/components/insight-panel";
import { InsightTriggerButton } from "@/features/dashboard/components/insight-trigger-button";
import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

type MetricSectionProps = {
  id: string;
  title: string;
  description: string;
  block: MetricBlockModel;
  queryLoading: boolean;
  queryError?: unknown;
  onRetry?: () => void;
  insightText: string | null;
  insightLoading: boolean;
  onInsight: () => void;
  chartTitle?: string;
  footer?: ReactNode;
  className?: string;
};

export function MetricSection({
  id,
  title,
  description,
  block,
  queryLoading,
  queryError,
  onRetry,
  insightText,
  insightLoading,
  onInsight,
  chartTitle = "Comparativo por origem",
  footer,
  className,
}: MetricSectionProps) {
  const hasData = blockHasNumericData(block);

  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-6 space-y-4 rounded-xl border border-hk-border bg-hk-surface p-4 shadow-hk-sm md:p-5",
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h2 className="text-base font-semibold text-hk-deep">{title}</h2>
          <p className="max-w-3xl text-sm text-hk-muted">{description}</p>
        </div>
        <InsightTriggerButton
          label="Insight deste bloco"
          loading={insightLoading}
          disabled={queryLoading || !!queryError}
          onClick={onInsight}
        />
      </div>

      {queryError ? (
        <div className="rounded-md border border-red-200 bg-red-50/50 px-3 py-2 text-sm text-red-800">
          {getFriendlyErrorMessage(queryError)}
          {onRetry ? (
            <button
              type="button"
              className="ml-2 underline"
              onClick={onRetry}
            >
              Repetir
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
        <ChartCard
          title={chartTitle}
          data={block.series}
          loading={queryLoading}
          emptyLabel={
            hasData
              ? "Valores zerados ou não segmentados por plataforma."
              : "Nenhum dado retornado para este indicador no período."
          }
        />
        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-hk-muted">
            Totais por origem
          </p>
          <ul className="flex flex-col gap-1.5">
            {Object.keys(block.byPlatform).length === 0 && !queryLoading ? (
              <li className="text-xs text-hk-muted">—</li>
            ) : (
              Object.entries(block.byPlatform).map(([k, v]) => (
                <li
                  key={k}
                  className="flex items-center justify-between gap-2 rounded-md border border-hk-border-subtle bg-hk-canvas/50 px-2.5 py-1.5 text-xs"
                >
                  <span className="truncate font-medium text-hk-deep">{k}</span>
                  <span className="shrink-0 tabular-nums text-hk-muted">
                    {formatCompactNumber(v)}
                  </span>
                </li>
              ))
            )}
          </ul>
          {block.total !== undefined && block.total > 0 && (
            <p className="text-xs text-hk-muted">
              Total consolidado:{" "}
              <span className="font-semibold text-hk-ink">
                {formatCompactNumber(block.total)}
              </span>
            </p>
          )}
        </div>
      </div>

      <InsightPanel
        title="Leitura assistida"
        text={insightText}
        loading={insightLoading}
      />

      {footer}
    </section>
  );
}
