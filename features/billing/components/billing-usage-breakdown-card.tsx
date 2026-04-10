"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HK_BASE_PLAN_MONTHLY_BRL,
  HK_EXTRA_CLIENT_MONTHLY_BRL,
  HK_INCLUDED_CLIENTS,
} from "../constants/pricing";
import type { BillingUsageBreakdown } from "../types/display";

type Props = {
  usage: BillingUsageBreakdown;
};

function money(n: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(n);
}

export function BillingUsageBreakdownCard({ usage }: Props) {
  return (
    <Card className="border-hk-border shadow-hk-sm">
      <CardHeader>
        <CardTitle className="text-lg text-hk-deep">Uso de clientes</CardTitle>
        <CardDescription>
          Modelo ho.ko: base de {money(HK_BASE_PLAN_MONTHLY_BRL)} / mês inclui até{" "}
          {HK_INCLUDED_CLIENTS} clientes. Cada cliente adicional:{" "}
          {money(HK_EXTRA_CLIENT_MONTHLY_BRL)} / mês.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-lg border border-hk-border-subtle bg-hk-surface/80 p-3">
            <dt className="text-hk-muted">Clientes ativos</dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums text-hk-deep">
              {usage.activeClients}
            </dd>
          </div>
          <div className="rounded-lg border border-hk-border-subtle bg-hk-surface/80 p-3">
            <dt className="text-hk-muted">Inclusos no plano</dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums text-hk-deep">
              {usage.includedSlots}
            </dd>
          </div>
          <div className="rounded-lg border border-hk-border-subtle bg-hk-surface/80 p-3">
            <dt className="text-hk-muted">Clientes excedentes</dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums text-hk-deep">
              {usage.excessClients}
            </dd>
          </div>
          <div className="rounded-lg border border-hk-border-subtle bg-hk-surface/80 p-3">
            <dt className="text-hk-muted">Adicional por extras</dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums text-hk-deep">
              {money(usage.extrasMonthlyBrl)}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
