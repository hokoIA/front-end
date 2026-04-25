"use client";

import type {
  IntegrationCardModel,
  IntegrationOperationalState,
} from "@/features/dashboard/types";
import { PlatformIcon } from "@/components/platforms/platform-icon";
import { cn } from "@/lib/utils/cn";

const opLabel: Record<IntegrationOperationalState, string> = {
  connected: "Conectado",
  disconnected: "Desconectado",
  needs_renewal: "Renovar acesso",
  unknown: "Indefinido",
};

function dotClass(op: IntegrationOperationalState): string {
  switch (op) {
    case "connected":
      return "bg-hk-success";
    case "disconnected":
      return "bg-hk-muted";
    case "needs_renewal":
      return "bg-hk-warning";
    default:
      return "bg-hk-border";
  }
}

function iconFor(surface: IntegrationCardModel["surface"]) {
  return surface;
}

export function IntegrationStatusCard({ card }: { card: IntegrationCardModel }) {
  const periodHint =
    card.periodCoverage === "no_data"
      ? "Sem dados no período"
      : card.periodCoverage === "has_data"
        ? "Dados no período"
        : card.periodCoverage === "unknown"
          ? "Cobertura do período indisponível"
          : null;

  return (
    <div className="flex min-w-[150px] flex-1 flex-col gap-2 rounded-xl border border-hk-border-subtle bg-hk-surface px-3.5 py-3 shadow-hk-xs">
      <div className="flex items-center gap-2">
        <PlatformIcon platform={iconFor(card.surface)} size="sm" plain />
        <span
          className={cn("size-2 shrink-0 rounded-full", dotClass(card.operational))}
          aria-hidden
        />
        <span className="truncate text-xs font-semibold text-hk-deep">
          {card.label}
        </span>
      </div>
      <p className="text-[11px] font-medium text-hk-muted">
        {opLabel[card.operational]}
      </p>
      {periodHint ? (
        <p
          className={cn(
            "text-[10px] font-medium",
            card.periodCoverage === "no_data"
              ? "text-hk-warning"
              : card.periodCoverage === "has_data"
                ? "text-hk-success"
                : "text-hk-muted",
          )}
        >
          {periodHint}
        </p>
      ) : null}
    </div>
  );
}
