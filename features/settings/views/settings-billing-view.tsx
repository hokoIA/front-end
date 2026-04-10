"use client";

import {
  BillingActionsPanel,
  BillingCycleCard,
  BillingOverviewCard,
  BillingUsageBreakdownCard,
  buildBillingDisplay,
} from "@/features/billing";
import { extractCheckoutUrl, extractPortalUrl } from "../utils/billing-portal";
import { SettingsPageHeader } from "../components/settings-page-header";
import { SettingsErrorState } from "../components/settings-states";
import {
  useBillingCheckoutMutation,
  useBillingMeQuery,
  useBillingPortalMutation,
} from "@/hooks/api/use-billing-queries";
import { useCustomersQuery } from "@/hooks/api/use-customers-queries";
import { hasActiveOrTrialingSubscription } from "@/lib/types/billing";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export function SettingsBillingView() {
  const billingQuery = useBillingMeQuery();
  const customersQuery = useCustomersQuery();
  const portalMut = useBillingPortalMutation();
  const checkoutMut = useBillingCheckoutMutation();

  const display = buildBillingDisplay(
    billingQuery.data,
    customersQuery.data?.length ?? 0,
  );
  const subActive = hasActiveOrTrialingSubscription(billingQuery.data);

  async function openPortal() {
    try {
      const res = await portalMut.mutateAsync(undefined);
      const url = extractPortalUrl(res);
      if (url) {
        window.location.href = url;
        return;
      }
      toast.message(
        "Portal aberto. Se nada ocorrer, verifique a resposta da API (campo url).",
      );
    } catch {
      /* toast global mutation */
    }
  }

  async function openCheckout() {
    try {
      const res = await checkoutMut.mutateAsync({});
      const url = extractCheckoutUrl(res);
      if (url) {
        window.location.href = url;
        return;
      }
      toast.error("Resposta de checkout sem URL de redirecionamento.");
    } catch {
      /* toast global */
    }
  }

  if (billingQuery.isError) {
    return (
      <SettingsErrorState
        error={billingQuery.error}
        onRetry={() => void billingQuery.refetch()}
      />
    );
  }

  return (
    <div className="space-y-8">
      <SettingsPageHeader
        title="Assinatura"
        description="Modelo ho.ko: plano base mensal com clientes incluídos e valor fixo por cliente adicional. Os números consolidados refletem a API quando disponível; caso contrário, usamos a contagem de clientes da plataforma."
        eyebrow="Configurações"
      />

      {billingQuery.isPending || customersQuery.isPending ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-48 animate-pulse rounded-xl bg-hk-border-subtle" />
          <div className="h-48 animate-pulse rounded-xl bg-hk-border-subtle" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <BillingOverviewCard display={display} />
            <BillingUsageBreakdownCard usage={display.usage} />
          </div>
          <BillingCycleCard
            periodStart={display.currentPeriodStart}
            periodEnd={display.currentPeriodEnd}
          />
          <BillingActionsPanel
            onManagePortal={() => void openPortal()}
            onCheckout={() => void openCheckout()}
            portalLoading={portalMut.isPending}
            checkoutLoading={checkoutMut.isPending}
            showCheckout={!subActive}
          />
          {(display.cancelAtPeriodEnd ||
            display.status === "canceled" ||
            display.status === "cancelled") && (
            <Card className="border-amber-200 bg-amber-50/40">
              <CardHeader>
                <CardTitle className="text-base text-amber-950">
                  Cancelamento
                </CardTitle>
                <CardDescription className="text-amber-950/90">
                  {display.cancelAtPeriodEnd
                    ? "Sua assinatura está marcada para encerrar ao fim do período de faturamento. Até lá, o acesso permanece ativo e as cobranças seguem o calendário do portal."
                    : "Assinatura cancelada ou inativa. Você pode reativar pelo portal de cobrança ou iniciar um novo checkout, conforme política da organização."}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-amber-950/85">
                Ao cancelar de forma definitiva, o workspace pode perder integrações
                e histórico conforme contrato. Dúvidas: Ajuda &amp; suporte.
              </CardContent>
            </Card>
          )}
          {!subActive && display.status === "none" && (
            <Card className="border-hk-border bg-hk-canvas/50">
              <CardHeader>
                <CardTitle className="text-base text-hk-deep">
                  Sem assinatura ativa
                </CardTitle>
                <CardDescription>
                  Ative um plano para liberar todos os módulos conforme o contrato
                  comercial. O valor exibido acima é a referência de produto (base +
                  clientes).
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
