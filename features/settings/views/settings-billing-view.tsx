"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  useBillingPlansQuery,
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

function resolveDefaultPlanCode(raw: unknown): string | null {
  if (!raw || typeof raw !== "object") return null;
  const root = raw as Record<string, unknown>;

  const directPlans = Array.isArray(root.plans) ? root.plans : null;
  const rootAsList = Array.isArray(raw) ? raw : null;
  const plans = directPlans ?? rootAsList;
  if (!plans) return null;

  for (const item of plans) {
    if (!item || typeof item !== "object") continue;
    const code = (item as Record<string, unknown>).code;
    if (typeof code === "string" && code.trim()) {
      return code;
    }
  }

  return null;
}

export function SettingsBillingView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const billingQuery = useBillingMeQuery();
  const plansQuery = useBillingPlansQuery();
  const customersQuery = useCustomersQuery();
  const portalMut = useBillingPortalMutation();
  const checkoutMut = useBillingCheckoutMutation();

  const display = buildBillingDisplay(
    billingQuery.data,
    customersQuery.data?.length ?? 0,
  );
  const subActive = hasActiveOrTrialingSubscription(billingQuery.data);
  const defaultPlanCode = resolveDefaultPlanCode(plansQuery.data);

  useEffect(() => {
    const checkout = searchParams.get("checkout");
    if (!checkout) return;

    if (checkout === "success") {
      toast.success("Pagamento confirmado. Sua assinatura será atualizada em instantes.");
      void billingQuery.refetch();
    } else if (checkout === "cancel") {
      toast.message("Checkout cancelado. Nenhuma cobrança foi realizada.");
    }

    const next = new URLSearchParams(searchParams.toString());
    next.delete("checkout");
    const qs = next.toString();
    router.replace(qs ? `/configuracoes/assinatura?${qs}` : "/configuracoes/assinatura");
  }, [searchParams, router, billingQuery]);

  async function openPortal() {
    if (!subActive) {
      toast.message("Portal liberado após ativar uma assinatura.");
      return;
    }
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
    if (!defaultPlanCode) {
      toast.error("Não foi possível identificar um plano disponível para checkout.");
      return;
    }
    try {
      const res = await checkoutMut.mutateAsync({ plan_code: defaultPlanCode });
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
    <div className="space-y-7 lg:space-y-8">
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
            portalDisabled={!subActive}
            checkoutLoading={checkoutMut.isPending || plansQuery.isPending}
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
                  comercial.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
