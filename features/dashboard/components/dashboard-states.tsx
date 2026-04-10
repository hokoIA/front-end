"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getFriendlyErrorMessage } from "@/lib/api/errors";
import { Building2, PlugZap, Radio } from "lucide-react";
import Link from "next/link";

export function DashboardNoCustomerState() {
  return (
    <Card className="border-dashed border-hk-border bg-hk-surface/80">
      <CardHeader className="pb-2">
        <div className="flex size-11 items-center justify-center rounded-full bg-hk-canvas text-hk-action">
          <Building2 className="size-5" strokeWidth={1.5} />
        </div>
        <CardTitle className="text-lg text-hk-deep">
          Selecione um cliente para começar
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          O dashboard consolida métricas e conteúdo por cliente. Use o seletor no
          topo da aplicação ou cadastre um cliente em Clientes & Integrações.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="default" size="sm">
          <Link href="/clientes">Ir para clientes</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function DashboardNoIntegrationsState() {
  return (
    <Card className="border-hk-border bg-hk-surface">
      <CardHeader className="pb-2">
        <div className="flex size-11 items-center justify-center rounded-full bg-amber-50 text-amber-700">
          <PlugZap className="size-5" strokeWidth={1.5} />
        </div>
        <CardTitle className="text-lg text-hk-deep">
          Integrações pendentes
        </CardTitle>
        <CardDescription>
          Nenhuma integração aparece como ativa para este cliente. Conecte ao
          menos uma fonte para liberar leitura consolidada.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="secondary" size="sm">
          <Link href="/clientes">Configurar integrações</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function DashboardNoDataState() {
  return (
    <Card className="border-hk-border bg-hk-surface">
      <CardHeader className="pb-2">
        <div className="flex size-11 items-center justify-center rounded-full bg-hk-canvas text-hk-muted">
          <Radio className="size-5" strokeWidth={1.5} />
        </div>
        <CardTitle className="text-lg text-hk-deep">
          Sem dados neste período
        </CardTitle>
        <CardDescription>
          As integrações estão ativas, mas não retornaram valores para o intervalo
          selecionado. Amplie o período ou verifique a coleta na origem.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export function DashboardErrorState({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry?: () => void;
}) {
  return (
    <Card className="border-red-200 bg-red-50/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-hk-deep">
          Falha ao carregar o período
        </CardTitle>
        <CardDescription className="text-hk-ink">
          {getFriendlyErrorMessage(error)}
        </CardDescription>
      </CardHeader>
      {onRetry && (
        <CardContent>
          <Button type="button" variant="secondary" size="sm" onClick={onRetry}>
            Tentar novamente
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

export function DashboardBlockErrorState({
  title,
  error,
  onRetry,
}: {
  title: string;
  error: unknown;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50/40 px-4 py-3 text-sm">
      <p className="font-medium text-hk-deep">{title}</p>
      <p className="mt-1 text-hk-muted">{getFriendlyErrorMessage(error)}</p>
      {onRetry && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-2 h-8 px-2"
          onClick={onRetry}
        >
          Repetir
        </Button>
      )}
    </div>
  );
}
