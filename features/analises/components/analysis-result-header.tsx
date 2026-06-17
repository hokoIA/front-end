"use client";

import type { AnalysisResultMeta } from "@/features/analises/types";
import {
  ANALYSIS_TYPE_LABELS,
  PLATFORM_LABELS,
  STRATEGIC_FOCUS_LABELS,
} from "@/features/analises/utils/labels";
import { formatDisplayDate } from "@/features/dashboard/utils/format";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Props = {
  meta: AnalysisResultMeta;
};

function formatDuration(ms?: number): string {
  if (typeof ms !== "number" || !Number.isFinite(ms)) return "-";
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.round(ms)}ms`;
}

export function AnalysisResultHeader({ meta }: Props) {
  const generated = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(meta.generatedAt));

  return (
    <div className="border-b border-hk-border-subtle bg-hk-surface-muted/60 px-5 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="hk-overline">
            Relatório estratégico
          </p>
          <h2 className="mt-1 text-lg font-semibold text-hk-deep">
            {meta.customerName}
          </h2>
          <p className="mt-1 text-sm text-hk-muted">
            Período:{" "}
            <span className="font-medium text-hk-ink">
              {formatDisplayDate(meta.dateStart)} —{" "}
              {formatDisplayDate(meta.dateEnd)}
            </span>
          </p>
        </div>
        <div className="text-right text-xs text-hk-muted">
          Gerado em
          <br />
          <span className="font-medium text-hk-ink">{generated}</span>
        </div>
      </div>
      {meta.bias?.trim() ? (
        <p className="mt-3 text-sm text-hk-ink">
          <span className="font-medium text-hk-deep">Direcionamento: </span>
          {meta.bias.trim()}
        </p>
      ) : null}
      {meta.metaAdsPipeline ? (
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-hk-muted">
          <span className="rounded-md border border-hk-border-subtle bg-hk-surface px-2.5 py-1">
            Meta Ads API: {formatDuration(meta.metaAdsPipeline.metaAdsApiMs)}
          </span>
          <span className="rounded-md border border-hk-border-subtle bg-hk-surface px-2.5 py-1">
            Analyze: {formatDuration(meta.metaAdsPipeline.analyzeMs)}
          </span>
          <span className="rounded-md border border-hk-border-subtle bg-hk-surface px-2.5 py-1">
            Total: {formatDuration(meta.metaAdsPipeline.totalMs)}
          </span>
          <span className="rounded-md border border-hk-border-subtle bg-hk-surface px-2.5 py-1">
            Linhas: {meta.metaAdsPipeline.rowCounts.campaign} campanhas /{" "}
            {meta.metaAdsPipeline.rowCounts.adSet} conjuntos /{" "}
            {meta.metaAdsPipeline.rowCounts.ad} anuncios
          </span>
        </div>
      ) : null}
      <Separator className="my-4 bg-hk-border-subtle" />
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="font-normal">
          {STRATEGIC_FOCUS_LABELS[meta.strategicFocus]}
        </Badge>
        <Badge variant="secondary" className="font-normal">
          {ANALYSIS_TYPE_LABELS[meta.analysisType]}
        </Badge>
        {meta.platforms.map((p) => (
          <Badge key={p} variant="outline" className="font-normal text-xs">
            {PLATFORM_LABELS[p]}
          </Badge>
        ))}
      </div>
    </div>
  );
}
