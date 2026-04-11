"use client";

import { CustomerStatusBadge } from "@/features/customers/components/customer-badges";
import {
  getCustomerCompany,
  getCustomerEmail,
  getCustomerLifecycleStatus,
  getCustomerNotes,
  getCustomerPhone,
  getCustomerCreatedAt,
} from "@/features/customers/utils/customer-fields";
import { useEditCustomerMutation } from "@/hooks/api/use-customers-queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Customer } from "@/lib/types/customer";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function CustomerSummaryCard({
  customer,
  onUpdated,
}: {
  customer: Customer;
  onUpdated?: () => void;
}) {
  const edit = useEditCustomerMutation();
  const [name, setName] = useState(customer.name);
  const [empresa, setEmpresa] = useState(getCustomerCompany(customer) ?? "");
  const [email, setEmail] = useState(getCustomerEmail(customer) ?? "");
  const [telefone, setTelefone] = useState(getCustomerPhone(customer) ?? "");
  const [notes, setNotes] = useState(getCustomerNotes(customer) ?? "");

  useEffect(() => {
    setName(customer.name);
    setEmpresa(getCustomerCompany(customer) ?? "");
    setEmail(getCustomerEmail(customer) ?? "");
    setTelefone(getCustomerPhone(customer) ?? "");
    setNotes(getCustomerNotes(customer) ?? "");
  }, [customer]);

  const created = getCustomerCreatedAt(customer);
  const lifecycle = getCustomerLifecycleStatus(customer);

  const save = async () => {
    if (!name.trim()) {
      toast.error("Nome é obrigatório.");
      return;
    }
    try {
      await edit.mutateAsync({
        idCustomer: customer.id_customer,
        body: {
          name: name.trim(),
          empresa: empresa.trim() || undefined,
          email: email.trim() || undefined,
          telefone: telefone.trim() || undefined,
          observacoes: notes.trim() || undefined,
        },
      });
      toast.success("Dados do cliente atualizados.");
      onUpdated?.();
    } catch {
      toast.error("Não foi possível salvar as alterações.");
    }
  };

  return (
    <section className="rounded-xl border border-hk-border bg-hk-canvas/40 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-hk-muted">
            Resumo do cliente
          </p>
          <h2 className="mt-1 text-lg font-semibold text-hk-deep">
            {customer.name}
          </h2>
          <p className="text-sm text-hk-muted">
            Criado em: {created ?? "—"}
          </p>
        </div>
        <CustomerStatusBadge status={lifecycle} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="hk-sum-name">Nome</Label>
          <Input
            id="hk-sum-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="hk-sum-empresa">Empresa</Label>
          <Input
            id="hk-sum-empresa"
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="hk-sum-email">E-mail</Label>
          <Input
            id="hk-sum-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="hk-sum-tel">Telefone</Label>
          <Input
            id="hk-sum-tel"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-3 grid gap-2">
        <Label htmlFor="hk-sum-notes">Observações operacionais</Label>
        <Textarea
          id="hk-sum-notes"
          rows={3}
          placeholder="Notas internas da agência sobre onboarding, contratos ou pendências."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          type="button"
          className="bg-hk-action text-white hover:bg-hk-strong"
          onClick={() => void save()}
          disabled={edit.isPending}
        >
          {edit.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            "Salvar alterações"
          )}
        </Button>
      </div>
    </section>
  );
}
