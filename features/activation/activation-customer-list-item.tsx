import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Customer } from "@/lib/types/customer";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function ActivationCustomerListItem({ customer }: { customer: Customer }) {
  const connections = (customer.integrations ?? []).filter((item) =>
    ["connected", "authorized", "needs_renewal"].includes(String(item.status ?? "").toLowerCase()),
  );

  return (
    <div className="grid gap-3 px-4 py-3 transition-colors hover:bg-hk-canvas/70 md:grid-cols-[minmax(220px,1.35fr)_minmax(170px,0.9fr)_minmax(150px,0.75fr)_auto] md:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-hk-deep">{customer.name}</h3>
          <Badge variant="info" className="text-[10px]">Em ativação</Badge>
        </div>
        {typeof customer.email === "string" ? <p className="truncate text-xs text-hk-muted">{customer.email}</p> : null}
      </div>
      <div className="min-w-0 text-sm text-hk-muted">
        <p className="text-[11px] font-medium uppercase tracking-wide md:hidden">Integrações</p>
        {connections.length > 0
          ? connections.map((item) => item.resource_name || item.platform).filter(Boolean).join(", ")
          : "Nenhuma conexão registrada"}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-hk-muted">Etapa atual</p>
        <p className="mt-0.5 text-sm text-hk-ink">Em ativação</p>
      </div>
      <div className="flex items-center gap-2 md:justify-end">
        <Button asChild size="sm" className="gap-1 bg-hk-deep text-white hover:bg-hk-strong">
          <Link href={`/clientes/ativacao/${encodeURIComponent(customer.id_customer)}`}>
            Continuar <ChevronRight className="size-4 opacity-80" aria-hidden />
          </Link>
        </Button>
      </div>
    </div>
  );
}
