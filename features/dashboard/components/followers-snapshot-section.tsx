"use client";

import type { AudienceSnapshotRow, MetricBlockModel } from "@/features/dashboard/types";
import { formatCompactNumber } from "@/features/dashboard/utils/format";
import { blockHasNumericData } from "@/features/dashboard/utils/normalize";
import { getFriendlyErrorMessage } from "@/lib/api/errors";
import { InsightPanel } from "@/features/dashboard/components/insight-panel";
import { InsightTriggerButton } from "@/features/dashboard/components/insight-trigger-button";
import { PlatformIconFromLabel } from "@/components/platforms/platform-icon";
import { SectionHeader } from "@/components/data-display/section-header";
import { cn } from "@/lib/utils/cn";

type FollowersSnapshotSectionProps = {
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

export function FollowersSnapshotSection({
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
}: FollowersSnapshotSectionProps) {
  const rows: AudienceSnapshotRow[] =
    block.audienceSnapshot && block.audienceSnapshot.length > 0
      ? block.audienceSnapshot
      : Object.entries(block.byPlatform).map(([k, v]) => ({
          platformKey: k,
          label: k,
          value: v,
        }));
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
        <SectionHeader compact title={title} description={description} />
        <div className="print:hidden">
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

      <p className="text-xs text-hk-muted">
        Valores são <span className="font-medium text-hk-deep">snapshot</span>{" "}
        por plataforma no período solicitado — não representam uma série
        temporal dia a dia.
      </p>

      {queryLoading ? (
        <div className="hk-skeleton h-32 rounded-xl" />
      ) : !hasData ? (
        <p className="text-sm text-hk-muted">
          Nenhum dado de audiência retornado para este período.
        </p>
      ) : (
        <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {rows.map((row) => (
            <div
              key={row.platformKey}
              className="flex flex-col rounded-xl border border-hk-border-subtle bg-hk-surface-muted/45 p-4"
            >
              <div className="mb-3 flex items-center gap-2">
                <PlatformIconFromLabel label={row.platformKey} size="md" />
                <span className="text-[11px] font-semibold uppercase tracking-wide text-hk-muted">
                  {row.label}
                </span>
              </div>
              <p className="text-2xl font-semibold tabular-nums text-hk-deep">
                {formatCompactNumber(row.value)}
              </p>
              <p className="mt-1 text-[11px] text-hk-muted">
                Base / seguidores reportados
              </p>
            </div>
          ))}
        </div>
      )}

      <InsightPanel
        title="Leitura assistida"
        text={insightText}
        loading={insightLoading}
      />
    </section>
  );
}
