"use client";

import type { CustomerIntegrationSummary } from "@/features/integrations/types/customer-summary";
import { CustomerListItem } from "@/features/customers/components/customer-list-item";
import { ActivationCustomerListItem } from "@/features/activation/activation-customer-list-item";
import { Skeleton } from "@/components/ui/skeleton";
import type { Customer } from "@/lib/types/customer";

export function CustomerList({
  customers,
  activationCustomers = [],
  summaries,
  summariesLoading,
  onOpenHub,
  onEditQuick,
  onDeleteRequest,
  listLoading,
}: {
  customers: Customer[];
  activationCustomers?: Customer[];
  summaries: Map<string, CustomerIntegrationSummary>;
  summariesLoading?: boolean;
  onOpenHub: (c: Customer) => void;
  onEditQuick: (c: Customer) => void;
  onDeleteRequest: (c: Customer) => void;
  listLoading?: boolean;
}) {
  if (listLoading) {
    return (
      <div className="space-y-3" aria-busy="true" aria-label="Carregando clientes">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-hk-border bg-hk-surface shadow-hk-sm divide-y divide-hk-border-subtle">
      {activationCustomers.length > 0 ? (
        <>
          <div className="bg-hk-surface-muted px-4 py-2 text-xs font-semibold uppercase tracking-wide text-hk-deep">Em ativação</div>
          {activationCustomers.map((customer) => <ActivationCustomerListItem key={customer.id_customer} customer={customer} />)}
        </>
      ) : null}
      {customers.length > 0 && activationCustomers.length > 0 ? (
        <div className="bg-hk-surface-muted px-4 py-2 text-xs font-semibold uppercase tracking-wide text-hk-deep">Clientes cadastrados</div>
      ) : null}
      {customers.map((c) => (
        <CustomerListItem
          key={c.id_customer}
          customer={c}
          summary={summaries.get(c.id_customer)}
          summaryLoading={summariesLoading}
          onOpenHub={() => onOpenHub(c)}
          onEditQuick={() => onEditQuick(c)}
          onDeleteRequest={() => onDeleteRequest(c)}
        />
      ))}
    </div>
  );
}
