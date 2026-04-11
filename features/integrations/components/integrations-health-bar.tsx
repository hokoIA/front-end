"use client";

import type { CustomerIntegrationSummary } from "@/features/integrations/types/customer-summary";
import { Skeleton } from "@/components/ui/skeleton";

export function IntegrationsHealthBar({
  summary,
  loading,
}: {
  summary: CustomerIntegrationSummary | null;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="rounded-lg border border-hk-border bg-hk-canvas/60 p-4">
        <Skeleton className="h-4 w-48" />
        <div className="mt-3 flex flex-wrap gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    );
  }

  if (!summary) return null;

  const items = [
    { label: "Conectadas", value: summary.connectedCount, tone: "text-emerald-700" },
    { label: "Pendentes / indefinidas", value: summary.unknownCount, tone: "text-sky-800" },
    { label: "Desconectadas", value: summary.disconnectedCount, tone: "text-hk-muted" },
    { label: "Renovação", value: summary.renewalCount, tone: "text-rose-700" },
  ];

  return (
    <div className="rounded-lg border border-hk-border bg-gradient-to-r from-hk-surface to-hk-cyan/5 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-hk-muted">
        Saúde geral das integrações
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        {items.map((it) => (
          <div
            key={it.label}
            className="min-w-[7rem] rounded-md border border-hk-border-subtle bg-hk-surface px-3 py-2"
          >
            <p className="text-[11px] font-medium text-hk-muted">{it.label}</p>
            <p className={`text-lg font-semibold tabular-nums ${it.tone}`}>
              {it.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
