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
import { AlertTriangle, Building2, Radio, Unplug } from "lucide-react";
import Link from "next/link";

export function AnalysisNoCustomerState() {
  return (
    <Card className="border-dashed border-hk-border bg-hk-surface/90">
      <CardHeader>
        <div className="flex size-11 items-center justify-center rounded-full bg-hk-canvas text-hk-action">
          <Building2 className="size-5" strokeWidth={1.5} />
        </div>
        <CardTitle className="text-lg text-hk-deep">
          Selecione um cliente
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          A análise estratégica é sempre gerada no contexto de um cliente. Use o
          seletor no topo da aplicação antes de configurar o período.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export function AnalysisNoIntegrationsState() {
  return (
    <Card className="border-amber-200 bg-amber-50/40">
      <CardHeader className="pb-2">
        <div className="flex size-10 items-center justify-center rounded-full bg-amber-100 text-amber-800">
          <Unplug className="size-5" />
        </div>
        <CardTitle className="text-base text-hk-deep">
          Cobertura limitada de integrações
        </CardTitle>
        <CardDescription>
          Nenhuma integração principal aparece ativa. A leitura pode ficar
          superficial — conecte fontes em Clientes & Integrações.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild size="sm" variant="secondary">
          <Link href="/clientes">Configurar integrações</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function AnalysisLowCoverageBanner({
  disconnectedLabels,
}: {
  disconnectedLabels: string[];
}) {
  if (disconnectedLabels.length === 0) return null;
  return (
    <div className="flex gap-3 rounded-lg border border-hk-cyan/40 bg-hk-canvas/80 px-4 py-3 text-sm">
      <AlertTriangle
        className="size-5 shrink-0 text-hk-action"
        strokeWidth={1.5}
      />
      <div>
        <p className="font-medium text-hk-deep">Cobertura parcial de dados</p>
        <p className="mt-1 text-hk-muted">
          Sem conexão ou dados recentes em:{" "}
          <span className="font-medium text-hk-ink">
            {disconnectedLabels.join(", ")}
          </span>
          . A narrativa pode omitir essas frentes.
        </p>
      </div>
    </div>
  );
}

export function AnalysisNoDataState() {
  return (
    <Card className="border-hk-border">
      <CardHeader>
        <div className="flex size-10 items-center justify-center rounded-full bg-hk-canvas text-hk-muted">
          <Radio className="size-5" />
        </div>
        <CardTitle className="text-base text-hk-deep">
          Resposta vazia
        </CardTitle>
        <CardDescription>
          A API retornou sem texto de análise. Verifique o período, as
          plataformas selecionadas ou tente regenerar.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export function AnalysisErrorState({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry?: () => void;
}) {
  return (
    <Card className="border-red-200 bg-red-50/50">
      <CardHeader>
        <CardTitle className="text-base text-hk-deep">
          Não foi possível gerar a análise
        </CardTitle>
        <CardDescription className="text-hk-ink">
          {getFriendlyErrorMessage(error)}
        </CardDescription>
      </CardHeader>
      {onRetry && (
        <CardContent>
          <Button type="button" size="sm" variant="secondary" onClick={onRetry}>
            Tentar novamente
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
