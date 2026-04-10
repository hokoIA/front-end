"use client";

import { SettingsPageHeader } from "../components/settings-page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfileQuery } from "@/hooks/api/use-auth-queries";
import { useBillingMeQuery } from "@/hooks/api/use-billing-queries";
import { useCustomersQuery } from "@/hooks/api/use-customers-queries";
import { buildBillingDisplay } from "@/features/billing";
import { hasActiveOrTrialingSubscription } from "@/lib/types/billing";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { SETTINGS_NAV_ITEMS } from "../constants/nav";
import { Skeleton } from "@/components/ui/skeleton";

export function SettingsOverviewView() {
  const { data: profile, isPending: pLoading } = useProfileQuery();
  const { data: billing, isPending: bLoading } = useBillingMeQuery();
  const { data: customers = [], isPending: cLoading } = useCustomersQuery();

  const display = buildBillingDisplay(billing, customers.length);
  const subActive = hasActiveOrTrialingSubscription(billing);

  const items = SETTINGS_NAV_ITEMS.filter((i) => i.href !== "/configuracoes");

  return (
    <div className="space-y-8">
      <SettingsPageHeader
        title="Visão geral"
        description="Resumo da conta, cobrança e atalhos para cada área administrativa do workspace."
        eyebrow="Configurações"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-hk-border bg-hk-surface/90">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-hk-muted">
              Conta
            </CardTitle>
            {pLoading ? (
              <Skeleton className="h-7 w-40" />
            ) : (
              <p className="text-lg font-semibold text-hk-deep">
                {profile?.name || "Sem nome"}
              </p>
            )}
            <CardDescription className="text-hk-ink">
              {pLoading ? "…" : profile?.email}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-hk-border bg-hk-surface/90">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-hk-muted">
              Assinatura
            </CardTitle>
            {bLoading || cLoading ? (
              <Skeleton className="h-7 w-48" />
            ) : (
              <p className="text-lg font-semibold text-hk-deep">
                {display.statusLabel}
              </p>
            )}
            <CardDescription>
              {bLoading || cLoading
                ? "Carregando…"
                : subActive
                  ? `~ ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(display.usage.totalMonthlyBrl)} / mês · ${display.usage.activeClients} cliente(s)`
                  : "Sem assinatura ativa ou dados pendentes da API."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-hk-deep">Áreas</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="group block">
                <Card className="h-full border-hk-border transition-colors hover:border-hk-action/30 hover:shadow-hk-sm">
                  <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
                    <div className="min-w-0 space-y-1">
                      <CardTitle className="text-base text-hk-deep group-hover:text-hk-action">
                        {item.label}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {item.description}
                      </CardDescription>
                    </div>
                    <ChevronRight
                      className="size-4 shrink-0 text-hk-muted transition-transform group-hover:translate-x-0.5 group-hover:text-hk-action"
                      aria-hidden
                    />
                  </CardHeader>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
