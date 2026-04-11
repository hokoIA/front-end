"use client";

import type { CustomerIntegrationSummary } from "@/features/integrations/types/customer-summary";
import { CustomerReadinessBadge, CustomerStatusBadge } from "@/features/customers/components/customer-badges";
import {
  getCustomerCompany,
  getCustomerEmail,
  getCustomerLifecycleStatus,
  getCustomerPhone,
  getCustomerUpdatedAt,
} from "@/features/customers/utils/customer-fields";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Customer } from "@/lib/types/customer";
import { cn } from "@/lib/utils/cn";
import { AlertTriangle, ChevronRight } from "lucide-react";

export function CustomerListItem({
  customer,
  summary,
  summaryLoading,
  onOpenHub,
  onEditQuick,
}: {
  customer: Customer;
  summary: CustomerIntegrationSummary | undefined;
  summaryLoading?: boolean;
  onOpenHub: () => void;
  onEditQuick: () => void;
}) {
  const lifecycle = getCustomerLifecycleStatus(customer);
  const company = getCustomerCompany(customer);
  const email = getCustomerEmail(customer);
  const phone = getCustomerPhone(customer);
  const updated = getCustomerUpdatedAt(customer);

  return (
    <div
      className={cn(
        "group grid gap-4 rounded-xl border border-hk-border bg-hk-surface p-4 shadow-hk-sm transition-all",
        "md:grid-cols-12 md:items-center md:gap-3",
        "hover:border-hk-action/25 hover:shadow-hk-md",
      )}
    >
      <div className="md:col-span-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold text-hk-deep">
            {customer.name}
          </h3>
          <CustomerStatusBadge status={lifecycle} />
          {summary?.hasAttention ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-900">
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
              Atenção
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-hk-muted">{company ?? "—"}</p>
        <p className="text-xs text-hk-muted">
          {[email, phone].filter(Boolean).join(" · ") || "—"}
        </p>
      </div>

      <div className="md:col-span-3">
        <p className="text-xs font-medium uppercase tracking-wide text-hk-muted">
          Integrações
        </p>
        {summaryLoading ? (
          <Skeleton className="mt-2 h-6 w-32" />
        ) : summary ? (
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-hk-deep">
              {summary.connectedCount}/5 conectadas
            </span>
            <CustomerReadinessBadge readiness={summary.readiness} />
          </div>
        ) : (
          <p className="mt-1 text-sm text-hk-muted">
            Abra o hub para medir conexões
          </p>
        )}
      </div>

      <div className="md:col-span-3">
        <p className="text-xs font-medium uppercase tracking-wide text-hk-muted">
          Última atualização
        </p>
        <p className="mt-1 text-sm text-hk-ink">{updated ?? "—"}</p>
      </div>

      <div className="flex flex-wrap gap-2 md:col-span-2 md:justify-end">
        <Button type="button" variant="outline" size="sm" onClick={onEditQuick}>
          Editar dados
        </Button>
        <Button
          type="button"
          size="sm"
          className="gap-1 bg-hk-deep text-white hover:bg-hk-strong"
          onClick={onOpenHub}
        >
          Hub operacional
          <ChevronRight className="h-4 w-4 opacity-80" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
