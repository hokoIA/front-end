"use client";

import type { MetricBlockModel, SearchVisualization } from "@/features/dashboard/types";
import { formatCompactNumber } from "@/features/dashboard/utils/format";
import { blockHasNumericData } from "@/features/dashboard/utils/normalize";
import { getFriendlyErrorMessage } from "@/lib/api/errors";
import { SingleSeriesLineChart } from "@/components/charts/single-series-line-chart";
import { SparklineChart } from "@/components/charts/sparkline-chart";
import { ChartFullscreenDialog } from "@/components/charts/chart-fullscreen-dialog";
import { InsightPanel } from "@/features/dashboard/components/insight-panel";
import { InsightTriggerButton } from "@/features/dashboard/components/insight-trigger-button";
import { cn } from "@/lib/utils/cn";

type SearchOrganicSectionProps = {
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
  className?: string;
};

export function SearchOrganicSection({
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
  className,
}: SearchOrganicSectionProps) {
  const viz: SearchVisualization | undefined = block.searchViz;
  const labels = viz?.labels ?? [];
  const organic = viz?.organicValues ?? [];
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
        <div className="flex shrink-0 items-center gap-0.5 print:hidden">
          <ChartFullscreenDialog
            title={title}
            description="Sessões orgânicas ao longo do período."
            triggerLabel="Ampliar gráfico de busca/orgânico"
          >
            <SingleSeriesLineChart
              labels={labels}
              values={organic}
              name="Orgânico"
              loading={queryLoading}
              minChartHeight={420}
              emptyLabel={
                hasData
                  ? "Série orgânica zerada."
                  : "Nenhum dado orgânico no período."
              }
            />
          </ChartFullscreenDialog>
          <InsightTriggerButton
            label="Insight de busca"
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

      <div className="grid min-w-0 gap-4 lg:grid-cols-3">
        <div className="min-w-0 space-y-2 lg:col-span-2">
          <p className="text-[11px] font-semibold uppercase text-hk-muted">
            Sessões orgânicas (série)
          </p>
          <SingleSeriesLineChart
            labels={labels}
            values={organic}
            name="Orgânico"
            loading={queryLoading}
            emptyLabel={
              hasData
                ? "Série orgânica zerada."
                : "Nenhum dado orgânico no período."
            }
          />
        </div>
        <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-hk-border-subtle bg-hk-canvas/30 p-3">
          <p className="text-[11px] font-semibold uppercase text-hk-muted">
            Indicadores consolidados
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-hk-border-subtle bg-hk-surface px-2 py-2">
              <p className="text-[10px] font-medium text-hk-muted">
                Orgânico (busca)
              </p>
              <p className="text-lg font-semibold tabular-nums text-hk-deep">
                {formatCompactNumber(viz?.totalOrganicSearch ?? 0)}
              </p>
            </div>
            <div className="rounded-lg border border-hk-border-subtle bg-hk-surface px-2 py-2">
              <p className="text-[10px] font-medium text-hk-muted">
                Outras fontes
              </p>
              <p className="text-lg font-semibold tabular-nums text-hk-deep">
                {formatCompactNumber(viz?.totalOtherSources ?? 0)}
              </p>
            </div>
            <div className="rounded-lg border border-hk-border-subtle bg-hk-surface px-2 py-2">
              <p className="text-[10px] font-medium text-hk-muted">
                Novos leads
              </p>
              <p className="text-lg font-semibold tabular-nums text-hk-deep">
                {formatCompactNumber(viz?.totalNewLeads ?? 0)}
              </p>
            </div>
            <div className="rounded-lg border border-hk-border-subtle bg-hk-surface px-2 py-2">
              <p className="text-[10px] font-medium text-hk-muted">Dias</p>
              <p className="text-lg font-semibold tabular-nums text-hk-deep">
                {formatCompactNumber(viz?.days ?? 0)}
              </p>
            </div>
          </div>
          <div>
            <p className="mb-1 text-[11px] font-medium text-hk-muted">
              Leads por dia (sparkline)
            </p>
            <SparklineChart
              values={viz?.newLeadsPerDay ?? []}
              loading={queryLoading}
            />
          </div>
        </div>
      </div>

      <InsightPanel
        title="Leitura — busca"
        text={insightText}
        loading={insightLoading}
      />
    </section>
  );
}
