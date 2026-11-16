"use client";

import { PageHeader } from "@/components/data-display/page-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateCustomerFlow } from "@/features/customers/components/create-customer-flow";
import { CustomerDetailPanel } from "@/features/customers/components/customer-detail-panel";
import { CustomerEmptyState } from "@/features/customers/components/customer-empty-state";
import { CustomerList } from "@/features/customers/components/customer-list";
import { CustomersErrorState } from "@/features/customers/components/customers-error-state";
import { CustomersFiltersToolbar } from "@/features/customers/components/customers-filters-toolbar";
import { CustomersOverviewBar } from "@/features/customers/components/customers-overview-bar";
import { defaultCustomerHubFilters } from "@/features/customers/types/filters";
import { getCustomerLifecycleStatus } from "@/features/customers/utils/customer-fields";
import {
  computeHubOverview,
  filterAndSortCustomers,
} from "@/features/customers/utils/filter-sort-customers";
import { CUSTOMER_LIST_INTEGRATION_SUMMARY_LIMIT } from "@/features/integrations/hooks/use-customers-integration-summaries";
import { useCustomersIntegrationSummaries } from "@/features/integrations/hooks/use-customers-integration-summaries";
import {
  useCustomersQuery,
  useDeleteCustomerMutation,
} from "@/hooks/api/use-customers-queries";
import { useRbacMeQuery } from "@/hooks/api/use-rbac-queries";
import { rbacAllows } from "@/lib/types/rbac";
import { queryKeys } from "@/lib/api/query-keys";
import type { Customer } from "@/lib/types/customer";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type CustomerPanelMode = "connections" | "details";

export function CustomersHubView() {
  const qc = useQueryClient();
  const router = useRouter();
  const { data: rbac } = useRbacMeQuery();
  const canManageActivation = rbacAllows(rbac, "activation:manage");
  const { data: customers = [], isPending, isError, error, refetch } =
    useCustomersQuery();
  const [filters, setFilters] = useState(defaultCustomerHubFilters);
  const [createOpen, setCreateOpen] = useState(false);
  const [detailCustomer, setDetailCustomer] = useState<Customer | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailMode, setDetailMode] =
    useState<CustomerPanelMode>("connections");
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const deleteCustomer = useDeleteCustomerMutation();

  const operationalCustomers = useMemo(
    () => customers.filter((c) => getCustomerLifecycleStatus(c) !== "activation"),
    [customers],
  );
  const visibleCustomers = useMemo(
    () => canManageActivation ? customers : operationalCustomers,
    [canManageActivation, customers, operationalCustomers],
  );
  const ids = useMemo(
    () => operationalCustomers.map((c) => c.id_customer),
    [operationalCustomers],
  );
  const { byId: summaries, isLoading: summariesLoading, batchDisabled } =
    useCustomersIntegrationSummaries(ids);

  const summariesReady =
    operationalCustomers.length === 0 ||
    (!batchDisabled && !summariesLoading && operationalCustomers.length > 0);

  const overview = useMemo(
    () =>
      ({ ...computeHubOverview({
        customers: operationalCustomers,
        summaries,
        summariesReady,
      }), total: visibleCustomers.length }),
    [visibleCustomers.length, operationalCustomers, summaries, summariesReady],
  );

  const filtered = useMemo(
    () => filterAndSortCustomers(visibleCustomers, filters, summaries),
    [visibleCustomers, filters, summaries],
  );
  const filteredActivation = filtered.filter((c) => getCustomerLifecycleStatus(c) === "activation");
  const filteredOperational = filtered.filter((c) => getCustomerLifecycleStatus(c) !== "activation");

  const openPanel = (c: Customer, mode: CustomerPanelMode) => {
    setDetailMode(mode);
    setDetailCustomer(c);
    setDetailOpen(true);
  };

  const confirmDeleteFromList = async () => {
    if (!deleteTarget) return;

    try {
      await deleteCustomer.mutateAsync(deleteTarget.id_customer);
      toast.success("Cliente agendado para desativação.");
      setDeleteTarget(null);
    } catch {
      toast.error("Não foi possível desativar o cliente.");
    }
  };

  const handleCreated = (id?: string) => {
    void (async () => {
      await qc.refetchQueries({ queryKey: queryKeys.customers.list() });
      const list = qc.getQueryData<Customer[]>(queryKeys.customers.list());
      if (id && list) {
        const found = list.find((x) => x.id_customer === id);
        if (found) {
          if (getCustomerLifecycleStatus(found) === "activation") {
            router.push(`/clientes/ativacao/${encodeURIComponent(id)}`);
            return;
          }
          setDetailMode("details");
          setDetailCustomer(found);
          setDetailOpen(true);
        }
      }
    })();
  };

  if (isError) {
    return (
      <div className="hk-page hk-page--mid flex flex-col gap-6 py-7">
        <CustomersErrorState
          error={error instanceof Error ? error : null}
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  return (
    <div className="hk-page space-y-7 pb-16 pt-3 lg:space-y-8 lg:pt-4">
      <PageHeader
        title=""
        description="Conecte seus clientes com suas plataformas e páginas."
        actions={
          canManageActivation ? <Button
              type="button"
              className="gap-2 self-start bg-hk-action text-white hover:bg-hk-strong sm:self-auto"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="h-4 w-4" aria-hidden />
              Novo cliente
            </Button> : null
        }
      />
      <CustomersOverviewBar
        total={overview.total}
        active={overview.active}
        withoutIntegration={overview.withoutIntegration}
        pendingIntegration={overview.pendingIntegration}
        attentionIntegration={overview.attentionIntegration}
        readyForUse={overview.readyForUse}
        topPlatforms={overview.topPlatforms}
        loadingIntegrations={summariesLoading && operationalCustomers.length > 0}
        batchDisabled={batchDisabled}
        listBatchLimit={CUSTOMER_LIST_INTEGRATION_SUMMARY_LIMIT}
      />

      <CustomersFiltersToolbar value={filters} onChange={setFilters} showActivation={canManageActivation} />

      {visibleCustomers.length === 0 && !isPending && !filters.search && filters.lifecycle === "all" ? (
        canManageActivation ? <CustomerEmptyState onCreate={() => setCreateOpen(true)} /> : <p className="rounded-lg border border-hk-border bg-hk-surface px-4 py-6 text-center text-sm text-hk-muted">Nenhum cliente disponível.</p>
      ) : (
        <>
          {filtered.length === 0 && filteredActivation.length === 0 && !isPending ? (
            <p className="rounded-lg border border-hk-border bg-hk-surface px-4 py-6 text-center text-sm text-hk-muted">
              Nenhum cliente corresponde aos filtros. Ajuste a busca ou limpe
              os critérios.
            </p>
          ) : (
            <CustomerList
              customers={filteredOperational}
              activationCustomers={filteredActivation}
              summaries={summaries}
              summariesLoading={summariesLoading}
              listLoading={isPending}
              onOpenHub={(c) => openPanel(c, "connections")}
              onEditQuick={(c) => openPanel(c, "details")}
              onDeleteRequest={setDeleteTarget}
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
        mode={detailMode}
        onOpenChange={(o) => {
          setDetailOpen(o);
          if (!o) setDetailCustomer(null);
        }}
      />

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open && !deleteCustomer.isPending) setDeleteTarget(null);
        }}
      >
        <DialogContent className="border-hk-border">
          <DialogHeader>
            <DialogTitle>Desativar cliente?</DialogTitle>
            <DialogDescription>
              {deleteTarget ? (
                <>
                  O cliente <strong>{deleteTarget.name}</strong> ficará ativo
                  até o final do mês. Depois disso, a rotina de limpeza remove
                  clientes inativos do banco.
                </>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleteCustomer.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className="bg-rose-600 text-white hover:bg-rose-700"
              onClick={() => void confirmDeleteFromList()}
              disabled={deleteCustomer.isPending}
            >
              {deleteCustomer.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                "Confirmar desativação"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
