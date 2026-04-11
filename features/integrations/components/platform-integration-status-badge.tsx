"use client";

import type { IntegrationOperationalState } from "@/features/dashboard/types";
import {
  mapOperationalToUiKey,
  type PlatformUiStatusKey,
} from "@/features/integrations/types/platform-ui";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

const labels: Record<PlatformUiStatusKey, string> = {
  connected: "Conectado",
  disconnected: "Desconectado",
  unauthorized: "Não autorizado",
  awaiting_auth: "Aguardando autorização",
  expiring: "Expirando",
  needs_renewal: "Requer renovação",
  no_data: "Sem dados",
  error: "Em erro",
  unknown: "Estado desconhecido",
};

const styles: Record<PlatformUiStatusKey, string> = {
  connected: "border-emerald-500/40 bg-emerald-500/10 text-emerald-900",
  disconnected: "border-hk-border bg-hk-canvas text-hk-muted",
  unauthorized: "border-amber-500/40 bg-amber-500/10 text-amber-900",
  awaiting_auth: "border-sky-500/40 bg-sky-500/10 text-sky-900",
  expiring: "border-orange-500/40 bg-orange-500/10 text-orange-900",
  needs_renewal: "border-rose-500/50 bg-rose-500/10 text-rose-900",
  no_data: "border-hk-border bg-hk-canvas text-hk-muted",
  error: "border-rose-500/50 bg-rose-500/15 text-rose-900",
  unknown: "border-hk-border bg-hk-canvas text-hk-muted",
};

export function PlatformIntegrationStatusBadge({
  operational,
  periodCoverage,
  className,
}: {
  operational: IntegrationOperationalState;
  periodCoverage?: "unknown" | "has_data" | "no_data";
  className?: string;
}) {
  const key = mapOperationalToUiKey(operational, periodCoverage);
  return (
    <Badge
      variant="outline"
      className={cn(
        "border font-medium",
        styles[key],
        className,
      )}
    >
      {labels[key]}
    </Badge>
  );
}
