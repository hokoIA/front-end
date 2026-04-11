"use client";

import { Button } from "@/components/ui/button";
import { Kanban, Sparkles } from "lucide-react";

export function KanbanEmptyBoardState({
  onCreateColumn,
}: {
  onCreateColumn: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-hk-border bg-hk-canvas/40 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-hk-action/10 text-hk-action">
        <Kanban className="h-7 w-7" aria-hidden />
      </div>
      <h2 className="mt-5 text-lg font-semibold text-hk-deep">
        Nenhuma coluna ainda
      </h2>
      <p className="mt-2 max-w-md text-sm text-hk-muted">
        Comece definindo etapas do seu fluxo (briefing, produção, revisão…).
        Depois você adiciona cards, responsáveis e vínculos com clientes.
      </p>
      <Button
        type="button"
        className="mt-6 gap-2 bg-hk-deep text-white hover:bg-hk-strong"
        onClick={onCreateColumn}
      >
        <Sparkles className="h-4 w-4" aria-hidden />
        Criar primeira coluna
      </Button>
    </div>
  );
}
