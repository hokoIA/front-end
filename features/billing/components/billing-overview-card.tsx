"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BillingStatusBadge } from "./billing-status-badge";
import type { BillingDisplayModel } from "../types/display";

type Props = {
  display: BillingDisplayModel;
};

function money(n: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(n);
}

export function BillingOverviewCard({ display }: Props) {
  return (
    <Card className="border-hk-border shadow-hk-sm">
      <CardHeader>
        <CardDescription>Plano e status</CardDescription>
        <CardTitle className="text-xl text-hk-deep">{display.planLabel}</CardTitle>
        <div className="pt-2">
          <BillingStatusBadge
            status={display.status}
            label={display.statusLabel}
            cancelAtPeriodEnd={display.cancelAtPeriodEnd}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-hk-border-subtle bg-hk-canvas/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-hk-muted">
            Mensalidade estimada (produto)
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-hk-deep">
            {money(display.usage.totalMonthlyBrl)}
          </p>
          <p className="mt-2 text-xs text-hk-muted">
            Base {money(display.usage.baseMonthlyBrl)}
            {display.usage.excessClients > 0
              ? ` + ${display.usage.excessClients} cliente(s) adicional(is) × ${money(
                  display.usage.extrasMonthlyBrl / display.usage.excessClients,
                )} cada`
              : " · sem clientes excedentes"}
          </p>
        </div>
        {display.paymentSummary ? (
          <p className="text-sm text-hk-muted">{display.paymentSummary}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
