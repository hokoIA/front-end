"use client";

import { CreateCustomerFlow } from "@/features/customers/components/create-customer-flow";
import { CustomerDetailPanel } from "@/features/customers/components/customer-detail-panel";
import { CustomerEmptyState } from "@/features/customers/components/customer-empty-state";
import { CustomerList } from "@/features/customers/components/customer-list";
import { CustomersErrorState } from "@/features/customers/components/customers-error-state";
import { CustomersFiltersToolbar } from "@/features/customers/components/customers-filters-toolbar";
import { CustomersOverviewBar } from "@/features/customers/components/customers-overview-bar";
import { CustomersPageHeader } from "@/features/customers/components/customers-page-header";
import { defaultCustomerHubFilters } from "@/features/customers/types/filters";
import {
  computeHubOverview,
  filterAndSortCustomers,
} from "@/features/customers/utils/filter-sort-customers";
import { CUSTOMER_LIST_INTEGRATION_SUMMARY_LIMIT } from "@/features/integrations/hooks/use-customers-integration-summaries";
import { useCustomersIntegrationSummaries } from "@/features/integrations/hooks/use-customers-integration-summaries";
import { useCustomersQuery } from "@/hooks/api/use-customers-queries";
import { queryKeys } from "@/lib/api/query-keys";
import type { Customer } from "@/lib/types/customer";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

export function CustomersHubView() {
  const qc = useQueryClient();
  const { data: customers = [], isPending, isError, error, refetch } =
    useCustomersQuery();
  const [filters, setFilters] = useState(defaultCustomerHubFilters);
  const [createOpen, setCreateOpen] = useState(false);
  const [detailCustomer, setDetailCustomer] = useState<Customer | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const ids = useMemo(
    () => customers.map((c) => c.id_customer),
    [customers],
  );
  const { byId: summaries, isLoading: summariesLoading, batchDisabled } =
    useCustomersIntegrationSummaries(ids);

  const summariesReady =
    customers.length === 0 ||
    (!batchDisabled && !summariesLoading && customers.length > 0);

  const overview = useMemo(
    () =>
      computeHubOverview({
        customers,
        summaries,
        summariesReady,
      }),
    [customers, summaries, summariesReady],
  );

  const filtered = useMemo(
    () => filterAndSortCustomers(customers, filters, summaries),
    [customers, filters, summaries],
  );

  const openHub = (c: Customer) => {
    setDetailCustomer(c);
    setDetailOpen(true);
  };

  const handleCreated = (id?: string) => {
    void (async () => {
      await qc.refetchQueries({ queryKey: queryKeys.customers.list() });
      const list = qc.getQueryData<Customer[]>(queryKeys.customers.list());
      if (id && list) {
        const found = list.find((x) => x.id_customer === id);
        if (found) {
          setDetailCustomer(found);
          setDetailOpen(true);
        }
      }
    })();
  };

  if (isError) {
    return (
      <div className="hk-page hk-page--mid flex flex-col gap-6 py-8">
        <CustomersPageHeader />
        <CustomersErrorState
          error={error instanceof Error ? error : null}
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  return (
    <div className="hk-page flex flex-col gap-8 py-8">
      <CustomersPageHeader />

      <CustomersOverviewBar
        total={overview.total}
        active={overview.active}
        withoutIntegration={overview.withoutIntegration}
        pendingIntegration={overview.pendingIntegration}
        attentionIntegration={overview.attentionIntegration}
        readyForUse={overview.readyForUse}
        topPlatforms={overview.topPlatforms}
        loadingIntegrations={summariesLoading && customers.length > 0}
        batchDisabled={batchDisabled}
        listBatchLimit={CUSTOMER_LIST_INTEGRATION_SUMMARY_LIMIT}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-hk-deep">
            Carteira de clientes
          </h2>
          <p className="text-sm text-hk-muted">
            Localize, filtre e abra o hub operacional para conectar fontes de
            dados.
          </p>
        </div>
        <Button
          type="button"
          className="gap-2 self-start bg-hk-action text-white hover:bg-hk-strong sm:self-auto"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Novo cliente
        </Button>
      </div>

      <CustomersFiltersToolbar value={filters} onChange={setFilters} />

      {customers.length === 0 && !isPending ? (
        <CustomerEmptyState onCreate={() => setCreateOpen(true)} />
      ) : (
        <>
          {filtered.length === 0 && customers.length > 0 ? (
            <p className="rounded-lg border border-hk-border bg-hk-surface px-4 py-6 text-center text-sm text-hk-muted">
              Nenhum cliente corresponde aos filtros. Ajuste a busca ou limpe
              os critérios.
            </p>
          ) : (
            <CustomerList
              customers={filtered}
              summaries={summaries}
              summariesLoading={summariesLoading}
              listLoading={isPending}
              onOpenHub={openHub}
              onEditQuick={openHub}
            />
          )}
        </>
      )}

      <CreateCustomerFlow
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={handleCreated}
      />

      <CustomerDetailPanel
        customer={detailCustomer}
        open={detailOpen}
        onOpenChange={(o) => {
          setDetailOpen(o);
          if (!o) setDetailCustomer(null);
        }}
      />
    </div>
  );
}
