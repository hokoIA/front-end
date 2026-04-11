"use client";

import type { KanbanLabelUi } from "@/features/kanban/types/ui";
import { KanbanErrorState } from "@/features/kanban/components/kanban-error-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { KanbanLabelsList } from "./kanban-labels-list";
import { Plus, Tags } from "lucide-react";

export function KanbanLabelsPanel({
  labels,
  loading,
  error,
  onRetry,
  onOpenCreate,
  onOpenEdit,
  onRequestDelete,
  emptyHint,
}: {
  labels: KanbanLabelUi[];
  loading: boolean;
  error: Error | null;
  onRetry: () => void;
  onOpenCreate: () => void;
  onOpenEdit: (l: KanbanLabelUi) => void;
  onRequestDelete: (l: KanbanLabelUi) => void;
  emptyHint?: boolean;
}) {
  if (error) {
    return <KanbanErrorState error={error} onRetry={onRetry} />;
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-xs" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-hk-deep">Etiquetas</h2>
          <p className="mt-1 text-sm text-hk-muted">
            Organize cards com cores consistentes. Filtros do quadro usam estes
            rótulos.
          </p>
        </div>
        <Button
          type="button"
          className="gap-2 self-start bg-hk-action text-white hover:bg-hk-strong sm:self-auto"
          onClick={onOpenCreate}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Nova etiqueta
        </Button>
      </div>

      {labels.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-hk-border bg-hk-canvas/40 px-6 py-14 text-center">
          <Tags className="h-10 w-10 text-hk-muted" aria-hidden />
          <p className="mt-3 text-sm font-medium text-hk-deep">
            Nenhuma etiqueta cadastrada
          </p>
          <p className="mt-1 max-w-md text-xs text-hk-muted">
            {emptyHint
              ? "Crie etiquetas para marcar prioridade, tipo de entrega ou cliente."
              : "As etiquetas aparecerão aqui após a primeira criação."}
          </p>
          <Button
            type="button"
            className="mt-4 bg-hk-deep text-white hover:bg-hk-strong"
            onClick={onOpenCreate}
          >
            Criar etiqueta
          </Button>
        </div>
      ) : (
        <KanbanLabelsList
          labels={labels}
          onEdit={onOpenEdit}
          onDelete={onRequestDelete}
        />
      )}
    </div>
  );
}
