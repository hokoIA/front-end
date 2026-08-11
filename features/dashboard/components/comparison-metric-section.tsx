"use client";

import type { ComparisonChartData } from "@/features/dashboard/types";
import { formatCompactNumber } from "@/features/dashboard/utils/format";
import { getFriendlyErrorMessage } from "@/lib/api/errors";
import type { ComparisonLineDef } from "@/components/charts/multi-series-line-chart";
import { MultiSeriesLineChart } from "@/components/charts/multi-series-line-chart";
import { ChartFullscreenDialog } from "@/components/charts/chart-fullscreen-dialog";
import { InsightPanel } from "@/features/dashboard/components/insight-panel";
import { InsightTriggerButton } from "@/features/dashboard/components/insight-trigger-button";
import { PlatformIconFromLabel } from "@/components/platforms/platform-icon";
import { SectionHeader } from "@/components/data-display/section-header";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils/cn";
import { Info } from "lucide-react";

type ComparisonMetricSectionProps = {
  id: string;
  title: string;
  description: string;
  comparison: ComparisonChartData | undefined;
  lines: ComparisonLineDef[];
  byPlatform: Record<string, number>;
  unavailablePlatforms?: string[];
  total?: number;
  totalsHelpText?: string;
  showConsolidatedTotal?: boolean;
  queryLoading: boolean;
  queryError?: unknown;
  onRetry?: () => void;
  insightText: string | null;
  insightLoading: boolean;
  onInsight: () => void;
  className?: string;
};

export function ComparisonMetricSection({
  id,
  title,
  description,
  comparison,
  lines,
  byPlatform,
  unavailablePlatforms = [],
  total,
  totalsHelpText,
  showConsolidatedTotal = true,
  queryLoading,
  queryError,
  onRetry,
  insightText,
  insightLoading,
  onInsight,
  className,
}: ComparisonMetricSectionProps) {
  const rows = comparison?.rows ?? [];
  const labels = comparison?.labels ?? [];
  const unavailableSet = new Set(unavailablePlatforms);
  const visibleLines = lines.filter((line) => rows.some((row) => Number(row[line.dataKey] ?? 0) > 0),);
  const visibleByPlatform: Record<string, number> = Object.fromEntries(Object.entries(byPlatform).filter(([label, value]) => Number(value) > 0 || unavailableSet.has(label)),);
  const visibleTotal = total && total > 0 ? total : Object.values(visibleByPlatform).reduce((acc, value) => acc + value, 0);

  const hasData =
    visibleLines.length > 0 ||
    visibleTotal > 0 ||
    Object.values(visibleByPlatform).some((v) => v > 0);

  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-6 space-y-4 rounded-xl border border-hk-border bg-hk-surface p-4 shadow-hk-sm md:p-5",
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <SectionHeader compact title={title} description={description} />
        <div className="flex shrink-0 items-center gap-0.5 print:hidden">
          <ChartFullscreenDialog
            title={title}
            description={description}
            triggerLabel={`Ampliar gráfico: ${title}`}
          >
            <MultiSeriesLineChart
              labels={labels}
              lines={visibleLines}
              rows={rows}
              loading={queryLoading}
              minChartHeight={420}
              emptyLabel={
                hasData
                  ? "Série temporal vazia ou zerada."
                  : "Nenhum dado retornado para este indicador no período."
              }
            />
          </ChartFullscreenDialog>
          <InsightTriggerButton
            label="Insight deste bloco"
            loading={insightLoading}
            disabled={queryLoading || !!queryError}
            onClick={onInsight}
          />
        </div>
      </div>

      {queryError ? (
        <div className="rounded-md border border-red-200 bg-red-50/50 px-3 py-2 text-sm text-red-800">
          {getFriendlyErrorMessage(queryError)}
          {onRetry ? (
            <button type="button" className="ml-2 underline" onClick={onRetry}>
              Repetir
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="min-w-0">
          <MultiSeriesLineChart
            labels={labels}
            lines={visibleLines}
            rows={rows}
            loading={queryLoading}
            emptyLabel={
              hasData
                ? "Série temporal vazia ou zerada."
                : "Nenhum dado retornado para este indicador no período."
            }
          />
        </div>
        <div className="flex min-w-0 flex-col gap-2 rounded-xl border border-hk-border-subtle bg-hk-surface-muted/55 p-3">
          <div className="flex items-center gap-1.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-hk-muted">
              Totais por origem
            </p>
            {totalsHelpText ? (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label="Entenda os totais de alcance"
                      className="inline-flex size-5 items-center justify-center text-hk-muted transition-colors hover:text-hk-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hk-primary/40"
                    >
                      <Info className="size-3.5" aria-hidden />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-72 text-xs leading-5">
                    {totalsHelpText}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : null}
          </div>
          <ul className="flex flex-col gap-1.5">
            {Object.keys(visibleByPlatform).length === 0 && !queryLoading ? (
              <li className="text-xs text-hk-muted">—</li>
            ) : (
              Object.entries(visibleByPlatform).map(([k, v]) => (
                <li
                  key={k}
                  className="flex items-center justify-between gap-2 rounded-md border border-hk-border-subtle bg-hk-surface/80 px-2.5 py-1.5 text-xs"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <PlatformIconFromLabel label={k} plain size="sm" />
                    <span className="truncate font-medium text-hk-deep">
                      {k}
                    </span>
                  </span>
                  <span className="shrink-0 tabular-nums text-hk-muted">
                    {unavailableSet.has(k) ? "—" : formatCompactNumber(v)}
                  </span>
                </li>
              ))
            )}
          </ul>
          {showConsolidatedTotal && visibleTotal > 0 && (
            <p className="text-xs text-hk-muted">
              Total consolidado:{" "}
              <span className="font-semibold text-hk-ink">
                {formatCompactNumber(visibleTotal)}
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
    </section>
  );
}
