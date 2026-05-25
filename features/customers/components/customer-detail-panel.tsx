// features/customers/components/customer-detail-panel.tsx
"use client";

import { CustomerSummaryCard } from "@/features/customers/components/customer-summary-card";
import { CUSTOMER_HUB_PLATFORM_ADAPTERS } from "@/features/integrations/adapters/registry";
import { parseCustomerIntegrationRecord } from "@/features/integrations/utils/parse-integration-apis";
import { IntegrationsHealthBar } from "@/features/integrations/components/integrations-health-bar";
import { PlatformConnectFlow } from "@/features/integrations/components/platform-connect-flow";
import { PlatformIntegrationCard } from "@/features/integrations/components/platform-integration-card";
import { useCustomerIntegrationSummary } from "@/features/integrations/hooks/use-customer-integration-summary";
import type { IntegrationSurface } from "@/features/dashboard/types";
import type { IntegrationPlatformAdapter } from "@/features/integrations/adapters/types";
import { getCustomerLifecycleStatus } from "@/features/customers/utils/customer-fields";
import { useSelectedCustomer } from "@/components/providers/selected-customer-provider";
import { useEditCustomerMutation } from "@/hooks/api/use-customers-queries";
import { queryKeys } from "@/lib/api/query-keys";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Customer } from "@/lib/types/customer";
import { useQueryClient } from "@tanstack/react-query";
import { Archive, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";



function getIntegrationOperationalFallback(customer: Customer, platform: string) {
  const rows = Array.isArray(customer.integrations) ? customer.integrations : [];
  const found = rows.find((row) => {
    const raw = String(row?.platform ?? "").trim().toLowerCase();
    if (platform === "google_analytics") {
      return ["google_analytics", "googleanalytics", "ga4", "google"].includes(raw);
    }
    return raw === platform;
  });

  return parseCustomerIntegrationRecord(
    found as Record<string, unknown> | null | undefined,
  );
}

function resolvePanelOperational(
  customer: Customer,
  platform: string,
  summaryState: ReturnType<typeof getIntegrationOperationalFallback> | undefined,
) {
  const fallback = getIntegrationOperationalFallback(customer, platform);

  if (
    (summaryState === "unknown" ||
      summaryState === "disconnected" ||
      !summaryState) &&
    ["authorized", "connected", "needs_renewal"].includes(fallback)
  ) {
    return fallback;
  }

  return summaryState ?? fallback;
}

function getIntegrationResourceLabel(customer: Customer, platform: string): string | undefined {
  const rows = Array.isArray(customer.integrations) ? customer.integrations : [];
  const found = rows.find((row) => String(row.platform ?? "").toLowerCase() === platform);
  const name = found?.resource_name;
  return typeof name === "string" && name.trim() ? name : undefined;
}

function getSummaryResourceLabel(
  summary: ReturnType<typeof useCustomerIntegrationSummary>["data"],
  platform: IntegrationSurface,
): string | undefined {
  const name = summary?.resources?.[platform]?.name;

  return typeof name === "string" && name.trim() ? name : undefined;
}

function ComingSoonCard({ title }: { title: string }) {
  return (
    <div className="rounded-xl border border-dashed border-hk-border bg-hk-canvas/40 p-4 text-center">
      <p className="text-sm font-medium text-hk-deep">{title}</p>
      <p className="mt-1 text-xs text-hk-muted">
        Adapter reservado para expansão futura da API.
      </p>
    </div>
  );
}

export type CustomerDetailPanelMode = "connections" | "details";

export function CustomerDetailPanel({
  customer,
  open,
  mode,
  onOpenChange,
}: {
  customer: Customer | null;
  open: boolean;
  mode: CustomerDetailPanelMode;
  onOpenChange: (open: boolean) => void;
}) {
  const qc = useQueryClient();
  const { selectCustomer } = useSelectedCustomer();
  const summaryQ = useCustomerIntegrationSummary(
    customer?.id_customer ?? null,
  );
  const [flowAdapter, setFlowAdapter] =
    useState<IntegrationPlatformAdapter | null>(null);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const edit = useEditCustomerMutation();

  useEffect(() => {
    if (customer && open) selectCustomer(customer.id_customer);
  }, [customer, open, selectCustomer]);

  const lifecycle = customer
    ? getCustomerLifecycleStatus(customer)
    : "unknown";
  const archivedOrInactive =
    lifecycle === "archived" || lifecycle === "inactive";
  const showConnections = mode === "connections";
  const showDetails = mode === "details";

  const confirmRemoveIntegration = () => {
    toast.message(
      "Remoção de integração: endpoint dedicado ainda não exposto. Dashboards, análises e metas que dependem desta fonte podem deixar de atualizar até nova conexão.",
    );
    setRemoveTarget(null);
  };

  const archiveCustomer = async () => {
    if (!customer) return;
    try {
      await edit.mutateAsync({
        idCustomer: customer.id_customer,
        body: { status: "archived" },
      });
      toast.success("Cliente arquivado.");
      setArchiveOpen(false);
      onOpenChange(false);
    } catch {
      toast.error(
        "Não foi possível arquivar. Confirme se o backend aceita o campo de status no PUT.",
      );
    }
  };

  const handleMainOpenChange = (next: boolean) => {
    if (!next) {
      setFlowAdapter(null);
      setRemoveTarget(null);
      setArchiveOpen(false);
    }
    onOpenChange(next);
  };

  if (!customer) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={handleMainOpenChange}>
        <DialogContent className="max-h-[min(90vh,880px)] w-[min(96vw,42rem)] max-w-none overflow-y-auto border-hk-border p-0 gap-0">
          <div className="border-b border-hk-border bg-gradient-to-r from-hk-deep/5 to-hk-cyan/10 px-6 py-4">
            <DialogHeader>
              <DialogTitle>
                {showConnections ? "Conexões do cliente" : "Dados do cliente"}
              </DialogTitle>
            </DialogHeader>
          </div>

          <div className="space-y-6 px-6 py-5">
            {showDetails && archivedOrInactive ? (
              <div
                role="status"
                className="rounded-lg border border-amber-200 bg-amber-50/90 px-3 py-2 text-sm text-amber-950"
              >
                Cliente inativo ou arquivado: integrações podem falhar ou ficar
                obsoletas até reativação.
              </div>
            ) : null}

            {showDetails ? (
              <CustomerSummaryCard
                customer={customer}
                onUpdated={() => {
                  void qc.invalidateQueries({ queryKey: queryKeys.customers.all });
                }}
              />
            ) : null}

            {showConnections ? (
              <>
            <IntegrationsHealthBar
              summary={summaryQ.data ?? null}
              loading={summaryQ.isPending}
            />

            <section>
              <h3 className="text-sm font-semibold text-hk-deep">
                Plataformas & conexões
              </h3>
              <p className="mt-1 text-xs text-hk-muted">
                Cada bloco diz respeito a uma plataforma específica.
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {CUSTOMER_HUB_PLATFORM_ADAPTERS.map((adapter) => {
                  const op = resolvePanelOperational(
                    customer,
                    adapter.key,
                    summaryQ.data?.surfaces[adapter.key],
                  );
                  return (
                    <PlatformIntegrationCard
                      key={adapter.key}
                      surface={adapter.key}
                      label={adapter.label}
                      operational={op}
                      periodCoverage="unknown"
                      resourceLabel={
                        getSummaryResourceLabel(summaryQ.data, adapter.key) ??
                        getIntegrationResourceLabel(customer, adapter.key)
                      }
                      adapter={adapter}
                      onConnect={() => setFlowAdapter(adapter)}
                      onOpenSwap={() => setFlowAdapter(adapter)}
                      onRemoveRequest={() =>
                        setRemoveTarget(adapter.label)
                      }
                    />
                  );
                })}
                <ComingSoonCard title="Google Ads" />
                <ComingSoonCard title="Meta Ads" />
              </div>
            </section>
              </>
            ) : null}

            {showDetails ? (
            <div className="flex flex-wrap gap-2 border-t border-hk-border-subtle pt-4">
              <Button
                type="button"
                variant="outline"
                className="gap-2 text-rose-700 border-rose-200 hover:bg-rose-50"
                onClick={() => setArchiveOpen(true)}
                disabled={archivedOrInactive}
              >
                <Archive className="h-4 w-4" aria-hidden />
                Arquivar / desativar cliente
              </Button>
            </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      {flowAdapter ? (
        <PlatformConnectFlow
          open={Boolean(flowAdapter)}
          onOpenChange={(next) => {
            if (!next) setFlowAdapter(null);
          }}
          customerId={customer.id_customer}
          adapter={flowAdapter}
          operational={resolvePanelOperational(
            customer,
            flowAdapter.key,
            summaryQ.data?.surfaces[flowAdapter.key],
          )}
          onConnected={async () => {
            await summaryQ.refetch();
            await qc.invalidateQueries({ queryKey: queryKeys.customers.all });
          }}
        />
      ) : null}

      <Dialog open={Boolean(removeTarget)} onOpenChange={() => setRemoveTarget(null)}>
        <DialogContent className="border-hk-border">
          <DialogHeader>
            <DialogTitle>Remover integração?</DialogTitle>
            <DialogDescription>
              {removeTarget ? (
                <>
                  Você está prestes a remover a conexão com{" "}
                  <strong>{removeTarget}</strong>. Isso pode afetar dashboards,
                  análises comparativas e metas vinculadas a esta fonte até que
                  uma nova autorização seja concluída.
                </>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setRemoveTarget(null)}>
              Cancelar
            </Button>
            <Button
              type="button"
              className="bg-rose-600 text-white hover:bg-rose-700"
              onClick={confirmRemoveIntegration}
            >
              Entendi, continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <DialogContent className="border-hk-border">
          <DialogHeader>
            <DialogTitle>Arquivar cliente?</DialogTitle>
            <DialogDescription>
              O cliente deixará de aparecer como ativo na operação diária.
              Tentamos arquivar via API; se não houver suporte, removemos o
              registro.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setArchiveOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              className="bg-rose-600 text-white hover:bg-rose-700"
              onClick={() => void archiveCustomer()}
              disabled={edit.isPending}
            >
              {edit.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                "Confirmar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
