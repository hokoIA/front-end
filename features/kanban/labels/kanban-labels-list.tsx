"use client";

import type { KanbanLabelUi } from "@/features/kanban/types/ui";
import { Button } from "@/components/ui/button";
import { Pencil, Tag, Trash2 } from "lucide-react";

export function KanbanLabelsList({
  labels,
  onEdit,
  onDelete,
}: {
  labels: KanbanLabelUi[];
  onEdit: (l: KanbanLabelUi) => void;
  onDelete: (l: KanbanLabelUi) => void;
}) {
  if (labels.length === 0) return null;

  return (
    <ul className="divide-y divide-hk-border rounded-xl border border-hk-border bg-hk-surface">
      {labels.map((l) => (
        <li
          key={l.id}
          className="flex items-center gap-3 px-4 py-3 first:rounded-t-xl last:rounded-b-xl"
        >
          <div
            className="h-8 w-8 shrink-0 rounded-lg border border-hk-border"
            style={{ backgroundColor: `${l.color}33` }}
            aria-hidden
          />
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Tag className="h-4 w-4 shrink-0 text-hk-muted" aria-hidden />
            <span className="truncate font-medium text-hk-deep">{l.name}</span>
            <span className="font-mono text-xs text-hk-muted">{l.color}</span>
          </div>
          <div className="flex shrink-0 gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-hk-muted"
              aria-label={`Editar ${l.name}`}
              onClick={() => onEdit(l)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-rose-600"
              aria-label={`Excluir ${l.name}`}
              onClick={() => onDelete(l)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
