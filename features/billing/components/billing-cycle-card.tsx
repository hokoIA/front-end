"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarClock } from "lucide-react";

type Props = {
  periodStart: string | null;
  periodEnd: string | null;
};

function fmt(iso: string | null) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return iso;
  }
}

export function BillingCycleCard({ periodStart, periodEnd }: Props) {
  return (
    <Card className="border-hk-border shadow-hk-sm">
      <CardHeader className="flex flex-row items-start gap-3 space-y-0">
        <div className="flex size-10 items-center justify-center rounded-lg bg-hk-canvas text-hk-action">
          <CalendarClock className="size-5" strokeWidth={1.5} />
        </div>
        <div>
          <CardTitle className="text-lg text-hk-deep">Ciclo e renovação</CardTitle>
          <CardDescription>
            Datas fornecidas pela API de cobrança quando disponíveis.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-hk-muted">
            Início do período
          </p>
          <p className="mt-1 text-sm font-medium text-hk-deep">
            {fmt(periodStart)}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-hk-muted">
            Próxima cobrança / renovação
          </p>
          <p className="mt-1 text-sm font-medium text-hk-deep">
            {fmt(periodEnd)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
