"use client";

import type {
  CustomerLifecycleStatus,
  CustomerReadiness,
} from "@/features/customers/types/readiness";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

const readinessLabels: Record<CustomerReadiness, string> = {
  incomplete: "Incompleto",
  partial: "Parcialmente conectado",
  ready: "Pronto para uso",
  attention: "Requer atenção",
};

const readinessVariant: Record<
  CustomerReadiness,
  "secondary" | "success" | "info" | "outline"
> = {
  incomplete: "secondary",
  partial: "info",
  ready: "success",
  attention: "outline",
};

export function CustomerReadinessBadge({
  readiness,
  className,
}: {
  readiness: CustomerReadiness;
  className?: string;
}) {
  return (
    <Badge
      variant={readinessVariant[readiness]}
      className={cn("font-medium", className)}
    >
      {readinessLabels[readiness]}
    </Badge>
  );
}

const lifecycleLabels: Record<CustomerLifecycleStatus, string> = {
  active: "Ativo",
  inactive: "Inativo",
  archived: "Arquivado",
  unknown: "Status não informado",
};

export function CustomerStatusBadge({
  status,
  className,
}: {
  status: CustomerLifecycleStatus;
  className?: string;
}) {
  const variant =
    status === "active"
      ? "success"
      : status === "archived"
        ? "secondary"
        : status === "inactive"
          ? "outline"
          : "secondary";
  return (
    <Badge variant={variant} className={cn("font-medium", className)}>
      {lifecycleLabels[status]}
    </Badge>
  );
}
