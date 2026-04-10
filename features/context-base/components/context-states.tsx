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
import { AlertCircle, Building2, FolderOpen } from "lucide-react";

export function ContextNoCustomerState() {
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
          A base de contexto é sempre montada em torno de um cliente. Use o
          seletor global no topo da aplicação para enviar documentos, metadados
          e políticas de uso da IA neste escopo.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export function ContextEmptyDocumentsState() {
  return (
    <Card className="border-hk-border bg-hk-surface/80">
      <CardHeader>
        <div className="flex size-10 items-center justify-center rounded-full bg-hk-canvas text-hk-muted">
          <FolderOpen className="size-5" strokeWidth={1.5} />
        </div>
        <CardTitle className="text-base text-hk-deep">
          Acervo ainda vazio
        </CardTitle>
        <CardDescription>
          Nenhum documento listado para este cliente. Envie o primeiro contexto
          na área acima — briefings, diretrizes e relatórios oficiais fazem
          grande diferença na qualidade das análises.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export function ContextErrorState({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry?: () => void;
}) {
  return (
    <Card className="border-red-200 bg-red-50/50">
      <CardHeader className="pb-2">
        <div className="flex size-10 items-center justify-center rounded-full bg-red-100 text-red-700">
          <AlertCircle className="size-5" />
        </div>
        <CardTitle className="text-base text-hk-deep">
          Algo falhou ao carregar ou enviar
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
