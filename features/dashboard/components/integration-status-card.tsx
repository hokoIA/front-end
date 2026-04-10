"use client";

import type {
  IntegrationCardModel,
  IntegrationOperationalState,
} from "@/features/dashboard/types";
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
      return "bg-emerald-500";
    case "disconnected":
      return "bg-hk-muted";
    case "needs_renewal":
      return "bg-amber-500";
    default:
      return "bg-hk-border";
  }
}

export function IntegrationStatusCard({ card }: { card: IntegrationCardModel }) {
  const periodHint =
    card.periodCoverage === "no_data"
      ? "Sem dados no período"
      : card.periodCoverage === "has_data"
        ? "Dados no período"
        : null;

  return (
    <div className="flex min-w-[140px] flex-1 flex-col gap-2 rounded-lg border border-hk-border-subtle bg-hk-canvas/40 px-3 py-2.5">
      <div className="flex items-center gap-2">
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
      {periodHint && card.periodCoverage !== "unknown" && (
        <p
          className={cn(
            "text-[10px] font-medium",
            card.periodCoverage === "no_data"
              ? "text-amber-700"
              : "text-emerald-700",
          )}
        >
          {periodHint}
        </p>
      )}
    </div>
  );
}
