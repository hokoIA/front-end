"use client";

import { HttpError } from "@/lib/api/http-client";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export function KanbanErrorState({
  error,
  onRetry,
  title,
}: {
  error: Error | null;
  onRetry: () => void;
  title?: string;
}) {
  const session =
    error instanceof HttpError && error.kind === "unauthorized";
  const forbidden =
    error instanceof HttpError && error.kind === "forbidden";

  const heading =
    title ??
    (session
      ? "Sessão expirada"
      : forbidden
        ? "Permissão negada"
        : "Não foi possível carregar o Kanban");

  const description = session
    ? "Entre novamente para acessar a central operacional."
    : forbidden
      ? "Sua função não permite acessar este módulo ou realizar esta ação."
      : (error?.message ??
        "Tente novamente em instantes ou contate o suporte.");

  return (
    <div
      role="alert"
      className="rounded-xl border border-hk-border bg-hk-surface p-6 shadow-hk-sm"
    >
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-500/15 text-rose-800">
          <AlertTriangle className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-hk-deep">{heading}</h2>
          <p className="mt-1 text-sm text-hk-muted">{description}</p>
          {!forbidden ? (
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
          ) : null}
        </div>
      </div>
    </div>
  );
}
