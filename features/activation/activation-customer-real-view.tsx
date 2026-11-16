"use client";

import { PageHeader } from "@/components/data-display/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCustomerActivationQuery } from "@/hooks/api/use-customers-queries";
import { useRbacMeQuery } from "@/hooks/api/use-rbac-queries";
import { rbacAllows } from "@/lib/types/rbac";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

function Surface({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="border-hk-border bg-hk-surface p-5 shadow-hk-sm">
      <h2 className="text-base font-semibold text-hk-deep">{title}</h2>
      <div className="mt-3 text-sm text-hk-muted">{children}</div>
    </Card>
  );
}

export function ActivationCustomerRealView({ customerId }: { customerId: string }) {
  const { data: rbac, isPending: checkingAccess } = useRbacMeQuery();
  const allowed = rbacAllows(rbac, "activation:manage");
  const { data, isPending, isError, refetch } = useCustomerActivationQuery(customerId, allowed);

  if (checkingAccess) {
    return <div className="hk-page py-8 text-sm text-hk-muted" role="status">Verificando acesso…</div>;
  }
  if (!allowed) {
    return (
      <div className="hk-page hk-page--narrow py-10">
        <Surface title="Acesso não autorizado">
          <p>Você não tem permissão para gerenciar a Ativação deste cliente.</p>
          <Button asChild variant="outline" className="mt-4"><Link href="/clientes">Voltar para Clientes</Link></Button>
        </Surface>
      </div>
    );
  }
  if (isPending) {
    return <div className="hk-page py-8 text-sm text-hk-muted" role="status">Carregando cliente…</div>;
  }
  if (isError || !data) {
    return (
      <div className="hk-page hk-page--narrow py-10">
        <Surface title="Não foi possível abrir a Ativação">
          <p>Verifique se o cliente ainda está em Ativação e tente novamente.</p>
          <div className="mt-4 flex gap-2">
            <Button type="button" variant="outline" onClick={() => void refetch()}>Tentar novamente</Button>
            <Button asChild variant="outline"><Link href="/clientes">Voltar para Clientes</Link></Button>
          </div>
        </Surface>
      </div>
    );
  }

  const { customer } = data;
  return (
    <div className="hk-page space-y-6 pb-16 pt-4">
      <Link href="/clientes" className="inline-flex items-center gap-2 text-sm font-medium text-hk-muted hover:text-hk-action">
        <ArrowLeft className="size-4" aria-hidden /> Clientes &amp; Integrações
      </Link>
      <PageHeader
        eyebrow="Clientes / Em ativação"
        title={customer.name}
        description="Reúna as informações do cliente antes de liberar o trabalho estratégico e operacional."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Surface title="Informações iniciais">
          <dl className="grid gap-3 sm:grid-cols-2">
            <div><dt className="font-medium text-hk-deep">Empresa</dt><dd>{customer.company || "Não informada"}</dd></div>
            <div><dt className="font-medium text-hk-deep">E-mail</dt><dd>{customer.email || "Não informado"}</dd></div>
            <div><dt className="font-medium text-hk-deep">Telefone</dt><dd>{customer.phone || "Não informado"}</dd></div>
            <div><dt className="font-medium text-hk-deep">Status</dt><dd>Em ativação</dd></div>
          </dl>
        </Surface>
        <Surface title="Próximos passos">
          <p>O cadastro básico está salvo. Materiais, conexões e avaliação serão liberados nas próximas entregas da Ativação.</p>
        </Surface>
      </div>
    </div>
  );
}
