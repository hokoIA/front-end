"use client";

import { GoalPriorityBadge, GoalStatusBadge } from "@/features/goals/components/goal-badges";
import type { GoalUiModel } from "@/features/goals/types/ui";
import { platformLabel } from "@/features/goals/utils/platform-labels";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { BarChart3, ChevronRight, FileText, Flag } from "lucide-react";

export function GoalListItem({
  goal,
  onOpen,
}: {
  goal: GoalUiModel;
  onOpen: () => void;
}) {
  const primaryKpi = goal.kpis[0];
  const hasPartial = goal.analyses.some((a) => a.type === "partial");
  const hasFinal = goal.analyses.some((a) => a.type === "final");
  const progress =
    goal.progressApprox ??
    primaryKpi?.progressPct ??
    undefined;

  return (
    <div
      className={cn(
        "group grid gap-4 rounded-xl border border-hk-border bg-hk-surface p-4 shadow-hk-sm transition-all",
        "lg:grid-cols-12 lg:items-center",
        "hover:border-hk-action/20 hover:shadow-hk-md",
      )}
    >
      <div className="lg:col-span-5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold text-hk-deep">{goal.title}</h3>
          <GoalStatusBadge status={goal.status} />
          <GoalPriorityBadge priority={goal.priority} />
        </div>
        <p className="mt-1 text-sm text-hk-muted">
          {goal.customerName ?? goal.customerId ?? "Cliente não informado"} ·{" "}
          {platformLabel(goal.platform)}
        </p>
        <p className="mt-0.5 text-xs text-hk-muted">
          {goal.startDate ?? "—"} → {goal.endDate ?? "—"}
        </p>
      </div>

      <div className="lg:col-span-3">
        <p className="text-xs font-medium uppercase tracking-wide text-hk-muted">
          KPI principal
        </p>
        <p className="mt-1 text-sm font-medium text-hk-ink">
          {primaryKpi?.name ?? "—"}
        </p>
        {progress !== undefined ? (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-hk-muted">
              <span>Progresso</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-hk-canvas">
              <div
                className="h-full rounded-full bg-hk-action transition-all"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          </div>
        ) : (
          <p className="mt-1 text-xs text-hk-muted">Progresso não informado</p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 lg:col-span-2">
        {hasPartial ? (
          <span className="inline-flex items-center gap-1 rounded-md border border-sky-200 bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-900">
            <FileText className="h-3.5 w-3.5" aria-hidden />
            Análise parcial
          </span>
        ) : (
          <span className="text-xs text-hk-muted">Sem análise parcial</span>
        )}
        {hasFinal ? (
          <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-900">
            <Flag className="h-3.5 w-3.5" aria-hidden />
            Análise final
          </span>
        ) : null}
      </div>

      <div className="flex justify-end lg:col-span-2">
        <Button
          type="button"
          size="sm"
          className="gap-1 bg-hk-deep text-white hover:bg-hk-strong"
          onClick={onOpen}
        >
          <BarChart3 className="h-4 w-4 opacity-90" aria-hidden />
          Detalhe
          <ChevronRight className="h-4 w-4 opacity-80" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
