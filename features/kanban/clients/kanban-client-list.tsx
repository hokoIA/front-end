"use client";

import type { KanbanClientRowUi } from "@/features/kanban/types/ui";
import { cn } from "@/lib/utils/cn";
import { Building2 } from "lucide-react";

export function KanbanClientList({
  clients,
  selectedId,
  onSelect,
  loading,
}: {
  clients: KanbanClientRowUi[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-2 p-2">
        {[0, 1, 2, 3].map((k) => (
          <div
            key={k}
            className="h-12 animate-pulse rounded-lg bg-hk-canvas/80"
          />
        ))}
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-hk-muted">
        Nenhum cliente retornado pela API do Kanban.
      </div>
    );
  }

  return (
    <ul className="space-y-1 p-2" role="listbox" aria-label="Clientes">
      {clients.map((c) => {
        const active = c.id === selectedId;
        return (
          <li key={c.id}>
            <button
              type="button"
              role="option"
              aria-selected={active}
              onClick={() => onSelect(c.id)}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                active
                  ? "border-hk-action/40 bg-hk-action/10 text-hk-deep"
                  : "border-transparent bg-hk-surface hover:border-hk-border hover:bg-hk-canvas/50",
              )}
            >
              <Building2
                className="h-4 w-4 shrink-0 text-hk-muted"
                aria-hidden
              />
              <span className="truncate font-medium">{c.name}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
