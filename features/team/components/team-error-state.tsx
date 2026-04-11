"use client";

import { HttpError } from "@/lib/api/http-client";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export function TeamErrorState({
  error,
  onRetry,
}: {
  error: Error | null;
  onRetry: () => void;
}) {
  const session =
    error instanceof HttpError && error.kind === "unauthorized";
  const forbidden =
    error instanceof HttpError && error.kind === "forbidden";

  return (
    <div
      role="alert"
      className="rounded-xl border border-hk-border bg-hk-surface p-6 shadow-hk-sm"
    >
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-800">
          <AlertTriangle className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-hk-deep">
            {session
              ? "Sessão expirada"
              : forbidden
                ? "Sem permissão para ver a equipe"
                : "Não foi possível carregar os dados"}
          </h2>
          <p className="mt-1 text-sm text-hk-muted">
            {session
              ? "Entre novamente para gerenciar membros e convites."
              : forbidden
                ? "Esta área pode ser limitada a administradores da conta."
                : (error?.message ??
                  "Tente novamente em instantes ou contate o suporte.")}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4 gap-2"
            onClick={onRetry}
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden />
            Tentar novamente
          </Button>
        </div>
      </div>
    </div>
  );
}
