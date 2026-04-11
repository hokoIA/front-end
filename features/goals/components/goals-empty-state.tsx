"use client";

import { Button } from "@/components/ui/button";
import { Compass, Sparkles } from "lucide-react";

export function GoalsEmptyState({
  onCreate,
  onSuggest,
}: {
  onCreate: () => void;
  onSuggest: () => void;
}) {
  return (
    <div className="rounded-xl border border-dashed border-hk-border bg-hk-surface px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-hk-lime/25 text-hk-deep">
        <Compass className="h-7 w-7" aria-hidden />
      </div>
      <h2 className="mt-6 text-lg font-semibold text-hk-deep">
        Nenhuma meta neste contexto
      </h2>
      <p className="mx-auto mt-2 max-w-lg text-sm text-hk-muted">
        Comece com uma meta manual estruturada ou peça sugestões da IA usando o
        contexto documental do cliente. O planejamento vivo conecta execução,
        acompanhamento e prova de resultado.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button
          type="button"
          className="gap-2 bg-hk-action text-white hover:bg-hk-strong"
          onClick={onCreate}
        >
          Nova meta
        </Button>
        <Button
          type="button"
          variant="outline"
          className="gap-2 border-hk-action/30"
          onClick={onSuggest}
        >
          <Sparkles className="h-4 w-4 text-hk-action" aria-hidden />
          Pedir sugestões da IA
        </Button>
      </div>
    </div>
  );
}
