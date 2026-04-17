"use client";

import { GoalStatusBadge } from "@/features/goals/components/goal-badges";
import type { GoalUiModel } from "@/features/goals/types/ui";
import { platformLabel } from "@/features/goals/utils/platform-labels";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { BarChart3, ChevronRight, Flag } from "lucide-react";

export function GoalListItem({
  goal,
  onOpen,
}: {
  goal: GoalUiModel;
  onOpen: () => void;
}) {
  const primaryKpi = goal.kpis[0];
  const hasFinal = goal.analyses.some((a) => a.type === "final");

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
        <p className="mt-2 text-xs text-hk-muted">
          Progresso não disponível no backend atual
        </p>
      </div>

      <div className="flex flex-wrap gap-2 lg:col-span-2">
        {hasFinal ? (
          <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-900">
            <Flag className="h-3.5 w-3.5" aria-hidden />
            Análise do período
          </span>
        ) : (
          <span className="text-xs text-hk-muted">Sem análise gerada</span>
        )}
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
