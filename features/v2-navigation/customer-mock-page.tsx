"use client";

import { PageHeader } from "@/components/data-display/page-header";
import { useSelectedCustomer } from "@/components/providers/selected-customer-provider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  title: string;
  description: string;
  sections: { title: string; detail: string }[];
  showStart?: boolean;
};

export function CustomerMockPage({ title, description, sections, showStart = false }: Props) {
  const { customers, selected, selectCustomer, isReady, isLoadingCustomers } = useSelectedCustomer();

  return (
    <div className="hk-page space-y-6 py-6">
      <PageHeader eyebrow="Área do cliente" title={title} description={selected ? `${selected.name} · ${description}` : description}
        actions={showStart && selected ? <Button disabled title="Disponível após integração">Iniciar ciclo</Button> : undefined} />
      <p className="rounded-lg border border-hk-info/20 bg-hk-info-soft px-4 py-3 text-sm text-hk-info">Estrutura visual V2</p>
      {!selected ? (
        <section className="hk-section max-w-xl space-y-4 p-5">
          <h2 className="text-base font-semibold text-hk-deep">Selecione um cliente para acessar esta área</h2>
          {!isReady || isLoadingCustomers ? (
            <div className="hk-skeleton h-9 w-full rounded-lg" />
          ) : customers.length === 0 ? (
            <p className="text-sm text-hk-muted">Nenhum cliente cadastrado. Cadastre um cliente em Clientes & Integrações.</p>
          ) : (
            <Select onValueChange={selectCustomer}>
              <SelectTrigger aria-label="Selecionar cliente"><SelectValue placeholder="Selecionar cliente" /></SelectTrigger>
              <SelectContent>{customers.map((customer) => <SelectItem key={customer.id_customer} value={customer.id_customer}>{customer.name}</SelectItem>)}</SelectContent>
            </Select>
          )}
        </section>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {sections.map((section) => (
            <section key={section.title} className="hk-section min-h-36 p-5" aria-label={section.title}>
              <h2 className="text-base font-semibold text-hk-deep">{section.title}</h2>
              <p className="mt-2 text-sm text-hk-muted">{section.detail}</p>
              <p className="mt-4 text-xs text-hk-muted">Nenhum dado conectado nesta etapa.</p>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
