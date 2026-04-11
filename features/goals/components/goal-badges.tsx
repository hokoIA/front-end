"use client";

import type { GoalLifecycleStatus } from "@/features/goals/types/ui";
import type { GoalPriority } from "@/features/goals/types/ui";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

const statusLabel: Record<GoalLifecycleStatus, string> = {
  draft: "Rascunho",
  active: "Ativa",
  monitoring: "Em acompanhamento",
  attention: "Em atenção",
  completed: "Concluída",
  closed: "Encerrada",
  archived: "Arquivada",
  unknown: "Status indefinido",
};

const statusVariant: Record<
  GoalLifecycleStatus,
  "secondary" | "success" | "info" | "outline"
> = {
  draft: "secondary",
  active: "success",
  monitoring: "info",
  attention: "outline",
  completed: "secondary",
  closed: "secondary",
  archived: "secondary",
  unknown: "secondary",
};

export function GoalStatusBadge({
  status,
  className,
}: {
  status: GoalLifecycleStatus;
  className?: string;
}) {
  return (
    <Badge
      variant={statusVariant[status]}
      className={cn("font-medium", className)}
    >
      {statusLabel[status]}
    </Badge>
  );
}

const priorityLabel: Record<GoalPriority, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  critical: "Crítica",
  unknown: "Prioridade —",
};

export function GoalPriorityBadge({
  priority,
  className,
}: {
  priority: GoalPriority;
  className?: string;
}) {
  const tone =
    priority === "critical"
      ? "border-rose-500/50 bg-rose-500/10 text-rose-900"
      : priority === "high"
        ? "border-amber-500/40 bg-amber-500/10 text-amber-900"
        : "border-hk-border bg-hk-canvas text-hk-muted";
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2 py-0.5 text-xs font-medium",
        tone,
        className,
      )}
    >
      {priorityLabel[priority]}
    </span>
  );
}
