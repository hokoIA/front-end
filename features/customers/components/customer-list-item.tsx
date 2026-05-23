"use client";

import type { IntegrationOperationalState, IntegrationSurface } from "@/features/dashboard/types";
import type { CustomerIntegrationSummary } from "@/features/integrations/types/customer-summary";
import { parseCustomerIntegrationRecord } from "@/features/integrations/utils/parse-integration-apis";
import { CustomerStatusBadge } from "@/features/customers/components/customer-badges";
import { PlatformIcon } from "@/components/platforms/platform-icon";
import {
  getCustomerCompany,
  getCustomerEmail,
  getCustomerLifecycleStatus,
  getCustomerPhone,
  getCustomerUpdatedAt,
} from "@/features/customers/utils/customer-fields";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import type { Customer } from "@/lib/types/customer";
import { cn } from "@/lib/utils/cn";
import { ChevronRight, MoreVertical, Pencil, Trash2 } from "lucide-react";

const PLATFORM_ORDER: IntegrationSurface[] = [
  "facebook",
  "instagram",
  "google_analytics",
  "youtube",
  "linkedin",
];

const PLATFORM_LABELS: Record<IntegrationSurface, string> = {
  facebook: "Meta / Facebook",
  instagram: "Meta / Instagram",
  google_analytics: "Google Analytics",
  youtube: "YouTube",
  linkedin: "LinkedIn",
};


function customerIntegrationFallback(
  customer: Customer,
  surface: IntegrationSurface,
): IntegrationOperationalState {
  const rows = Array.isArray(customer.integrations) ? customer.integrations : [];
  const row = rows.find((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return false;
    const platform = String((item as { platform?: unknown }).platform ?? "")
      .trim()
      .toLowerCase();

    if (surface === "google_analytics") {
      return ["google_analytics", "googleanalytics", "ga4", "google"].includes(platform);
    }

    return platform === surface;
  });

  return parseCustomerIntegrationRecord(
    row as Record<string, unknown> | null | undefined,
  );
}

function resolveListSurfaceState(
  customer: Customer,
  summary: CustomerIntegrationSummary | undefined,
  surface: IntegrationSurface,
): IntegrationOperationalState {
  const fromSummary = summary?.surfaces[surface];
  const fromCustomer = customerIntegrationFallback(customer, surface);

  if (
    (fromSummary === "unknown" ||
      fromSummary === "disconnected" ||
      !fromSummary) &&
    ["authorized", "connected", "needs_renewal"].includes(fromCustomer)
  ) {
    return fromCustomer;
  }

  return fromSummary ?? fromCustomer;
}

function platformTone(op: IntegrationOperationalState | undefined): string {
  if (op === "connected") {
    return "border-emerald-500/40 bg-emerald-500/10 text-emerald-900";
  }
  if (op === "authorized") {
    return "border-sky-500/40 bg-sky-500/10 text-sky-900";
  }
  if (op === "needs_renewal") {
    return "border-rose-500/50 bg-rose-500/10 text-rose-900";
  }
  return "border-hk-border bg-hk-canvas text-hk-muted";
}

function platformTitle(
  surface: IntegrationSurface,
  op: IntegrationOperationalState | undefined,
): string {
  const status =
    op === "connected"
      ? "conectado"
      : op === "authorized"
        ? "autorizado; falta escolher recurso"
        : op === "needs_renewal"
          ? "requer renovação"
          : "desconectado";
  return `${PLATFORM_LABELS[surface]}: ${status}`;
}

export function CustomerListItem({
  customer,
  summary,
  summaryLoading,
  onOpenHub,
  onEditQuick,
  onDeleteRequest,
}: {
  customer: Customer;
  summary: CustomerIntegrationSummary | undefined;
  summaryLoading?: boolean;
  onOpenHub: () => void;
  onEditQuick: () => void;
  onDeleteRequest: () => void;
}) {
  const lifecycle = getCustomerLifecycleStatus(customer);
  const email = getCustomerEmail(customer);
  const phone = getCustomerPhone(customer);
  const updated = getCustomerUpdatedAt(customer);

  return (
    <div
      className={cn(
        "group grid gap-3 px-4 py-3 transition-colors md:grid-cols-[minmax(220px,1.35fr)_minmax(170px,0.9fr)_minmax(150px,0.75fr)_auto] md:items-center",
        "hover:bg-hk-canvas/70",
      )}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-hk-deep">
            {customer.name}
          </h3>
          <CustomerStatusBadge status={lifecycle} className="text-[10px]" />
        </div>
        <p className="truncate text-xs text-hk-muted">
          {[email, phone].filter(Boolean).join(" · ") || "—"}
        </p>
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-hk-muted md:hidden">
          Integrações
        </p>
        {summaryLoading ? (
          <Skeleton className="mt-1 h-7 w-32 rounded-full" />
        ) : (
          <div className="mt-1 flex items-center gap-1.5 md:mt-0">
            {PLATFORM_ORDER.map((surface) => {
              const op = resolveListSurfaceState(customer, summary, surface);
              return (
                <span
                  key={surface}
                  title={platformTitle(surface, op)}
                  className={cn(
                    "inline-flex size-8 items-center justify-center rounded-full border",
                    platformTone(op),
                  )}
                >
                  <PlatformIcon platform={surface} size="sm" plain />
                </span>
              );
            })}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-hk-muted">
          Última atualização
        </p>
        <p className="mt-0.5 truncate text-sm text-hk-ink">{updated ?? "—"}</p>
      </div>

      <div className="flex items-center gap-2 md:justify-end">
        <Button
          type="button"
          size="sm"
          className="gap-1 bg-hk-deep text-white hover:bg-hk-strong"
          onClick={onOpenHub}
        >
          Conexões
          <ChevronRight className="h-4 w-4 opacity-80" aria-hidden />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-8 w-8"
              aria-label="Ações do cliente"
            >
              <MoreVertical className="h-4 w-4" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEditQuick}>
              <Pencil className="mr-2 h-4 w-4" aria-hidden />
              Editar dados
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-rose-700 focus:text-rose-800"
              onClick={onDeleteRequest}
            >
              <Trash2 className="mr-2 h-4 w-4" aria-hidden />
              Excluir / desativar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
