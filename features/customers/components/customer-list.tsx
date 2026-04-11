"use client";

import type { CustomerIntegrationSummary } from "@/features/integrations/types/customer-summary";
import { CustomerListItem } from "@/features/customers/components/customer-list-item";
import { Skeleton } from "@/components/ui/skeleton";
import type { Customer } from "@/lib/types/customer";

export function CustomerList({
  customers,
  summaries,
  summariesLoading,
  onOpenHub,
  onEditQuick,
  listLoading,
}: {
  customers: Customer[];
  summaries: Map<string, CustomerIntegrationSummary>;
  summariesLoading?: boolean;
  onOpenHub: (c: Customer) => void;
  onEditQuick: (c: Customer) => void;
  listLoading?: boolean;
}) {
  if (listLoading) {
    return (
      <div className="space-y-3" aria-busy="true" aria-label="Carregando clientes">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {customers.map((c) => (
        <CustomerListItem
          key={c.id_customer}
          customer={c}
          summary={summaries.get(c.id_customer)}
          summaryLoading={summariesLoading}
          onOpenHub={() => onOpenHub(c)}
          onEditQuick={() => onEditQuick(c)}
        />
      ))}
    </div>
  );
}
