"use client";

import type { GoalLifecycleStatus } from "@/features/goals/types/ui";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

const statusLabel: Record<GoalLifecycleStatus, string> = {
  active: "Ativa",
  completed: "Concluída",
  closed: "Expirada",
  archived: "Cancelada",
  unknown: "Status indefinido",
};

const statusVariant: Record<
  GoalLifecycleStatus,
  "secondary" | "success" | "info" | "outline"
> = {
  active: "success",
  completed: "secondary",
  closed: "info",
  archived: "outline",
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
