"use client";

import type { MetricBlockModel, TrafficVisualization } from "@/features/dashboard/types";
import { formatCompactNumber } from "@/features/dashboard/utils/format";
import { blockHasNumericData } from "@/features/dashboard/utils/normalize";
import { getFriendlyErrorMessage } from "@/lib/api/errors";
import { SourceDonutChart } from "@/components/charts/source-donut-chart";
import { SingleSeriesLineChart } from "@/components/charts/single-series-line-chart";
import { ChartFullscreenDialog } from "@/components/charts/chart-fullscreen-dialog";
import { InsightPanel } from "@/features/dashboard/components/insight-panel";
import { InsightTriggerButton } from "@/features/dashboard/components/insight-trigger-button";
import { SectionHeader } from "@/components/data-display/section-header";
import { cn } from "@/lib/utils/cn";

type TrafficSplitSectionProps = {
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

export function TrafficSplitSection({
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
}: TrafficSplitSectionProps) {
  const viz: TrafficVisualization | undefined = block.trafficViz;
  const labels = viz?.labels ?? [];
  const sessionValues = viz?.sessionValues ?? [];
  const sources = viz?.sources ?? [];
  const hasData = blockHasNumericData(block);
  const totalSessions = sessionValues.reduce((a, b) => a + b, 0);
  const totalSources = sources.reduce((a, s) => a + s.value, 0);

  const donutSlices = sources.map((s) => ({
    id: s.key,
    name: s.labelPt,
    value: s.value,
  }));

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
            description="Sessões no site e distribuição por fonte no período."
            triggerLabel="Ampliar gráficos de tráfego"
          >
            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase text-hk-muted">
                  Sessões no site
                </p>
                <SingleSeriesLineChart
                  labels={labels}
                  values={sessionValues}
                  name="Sessões"
                  loading={queryLoading}
                  minChartHeight={380}
                  emptyLabel={
                    hasData
                      ? "Sessões zeradas no intervalo."
                      : "Nenhuma sessão retornada para o período."
                  }
                />
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase text-hk-muted">
                  Fontes de tráfego
                </p>
                <SourceDonutChart
                  sources={donutSlices}
                  loading={queryLoading}
                  minChartHeight={280}
                />
              </div>
            </div>
          </ChartFullscreenDialog>
          <InsightTriggerButton
            label="Insight de tráfego"
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

      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0 space-y-2">
          <p className="text-[11px] font-semibold uppercase text-hk-muted">
            Sessões no site
          </p>
          <SingleSeriesLineChart
            labels={labels}
            values={sessionValues}
            name="Sessões"
            loading={queryLoading}
            emptyLabel={
              hasData
                ? "Sessões zeradas no intervalo."
                : "Nenhuma sessão retornada para o período."
            }
          />
        </div>
        <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-hk-border-subtle bg-hk-surface-muted/55 p-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-hk-muted">
            Fontes de tráfego
          </p>
          <div className="min-h-[200px] w-full min-w-0">
            <SourceDonutChart
              sources={donutSlices}
              loading={queryLoading}
              minChartHeight={200}
            />
          </div>
          <ul className="max-h-48 space-y-1.5 overflow-y-auto text-xs">
            {sources.map((s) => (
              <li
                key={s.key}
                className="flex justify-between gap-2 rounded-md border border-hk-border-subtle/80 bg-hk-surface/80 px-2 py-1"
              >
                <span className="truncate text-hk-deep">{s.labelPt}</span>
                <span className="shrink-0 tabular-nums text-hk-muted">
                  {formatCompactNumber(s.value)}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-hk-muted">
            Total sessões (série):{" "}
            <span className="font-semibold text-hk-ink">
              {formatCompactNumber(totalSessions)}
            </span>
            {" · "}
            Soma fontes:{" "}
            <span className="font-semibold text-hk-ink">
              {formatCompactNumber(totalSources)}
            </span>
          </p>
        </div>
      </div>

      <InsightPanel
        title="Leitura — tráfego"
        text={insightText}
        loading={insightLoading}
      />
    </section>
  );
}
