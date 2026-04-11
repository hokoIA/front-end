"use client";

import type { KanbanColumnUi } from "@/features/kanban/types/ui";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, ChevronRight, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

export function KanbanColumnHeader({
  column,
  cardCount,
  isVirtual,
  canMoveLeft,
  canMoveRight,
  onMoveLeft,
  onMoveRight,
  onEdit,
  onDelete,
  onAddCard,
}: {
  column: KanbanColumnUi;
  cardCount: number;
  isVirtual?: boolean;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddCard: () => void;
}) {
  return (
    <header
      className="flex shrink-0 items-center gap-2 border-b border-hk-border/80 px-3 py-2.5"
      style={{ borderBottomColor: `${column.color}44` }}
    >
      <div
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: column.color }}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-sm font-semibold text-hk-deep">
          {column.name}
        </h2>
        <p className="text-[11px] text-hk-muted">
          {cardCount} {cardCount === 1 ? "card" : "cards"}
        </p>
      </div>

      {!isVirtual ? (
        <div className="flex shrink-0 items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-hk-muted"
            disabled={!canMoveLeft}
            onClick={onMoveLeft}
            aria-label="Mover coluna à esquerda"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-hk-muted"
            disabled={!canMoveRight}
            onClick={onMoveRight}
            aria-label="Mover coluna à direita"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-hk-muted"
                aria-label="Ações da coluna"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onSelect={onAddCard}>
                Novo card nesta coluna
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={onEdit} className="gap-2">
                <Pencil className="h-3.5 w-3.5" />
                Editar coluna
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={onDelete}
                className="text-rose-600 focus:text-rose-600"
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Excluir coluna
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <p className="text-[10px] text-hk-muted">Ajuste de coluna</p>
      )}
    </header>
  );
}
