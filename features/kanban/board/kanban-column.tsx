"use client";

import type { KanbanCardUi, KanbanColumnUi, KanbanLabelUi } from "@/features/kanban/types/ui";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanColumnHeader } from "./kanban-column-header";
import { KanbanSortableCard } from "./kanban-sortable-card";

export function KanbanColumn({
  column,
  cards,
  cardIds,
  labels,
  isVirtual,
  canMoveLeft,
  canMoveRight,
  onMoveLeft,
  onMoveRight,
  onEditColumn,
  onDeleteColumn,
  onAddCard,
  onOpenCard,
  dragDisabled,
}: {
  column: KanbanColumnUi;
  cards: KanbanCardUi[];
  cardIds: string[];
  labels: KanbanLabelUi[];
  isVirtual?: boolean;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onEditColumn: () => void;
  onDeleteColumn: () => void;
  onAddCard: () => void;
  onOpenCard: (card: KanbanCardUi) => void;
  dragDisabled?: boolean;
}) {
  const dropId = `drop-${column.id}`;
  const { setNodeRef, isOver } = useDroppable({ id: dropId });

  const cardById = new Map(cards.map((c) => [c.id, c]));

  return (
    <div
      className="flex w-[min(100%,20rem)] shrink-0 flex-col rounded-xl border border-hk-border bg-hk-canvas/30 shadow-hk-sm"
      style={{
        boxShadow: isOver ? `0 0 0 2px ${column.color}55` : undefined,
      }}
    >
      <KanbanColumnHeader
        column={column}
        cardCount={cards.length}
        isVirtual={isVirtual}
        canMoveLeft={canMoveLeft}
        canMoveRight={canMoveRight}
        onMoveLeft={onMoveLeft}
        onMoveRight={onMoveRight}
        onEdit={onEditColumn}
        onDelete={onDeleteColumn}
        onAddCard={onAddCard}
      />
      <div
        ref={setNodeRef}
        className="flex min-h-[140px] flex-1 flex-col gap-2 overflow-y-auto p-2"
      >
        <SortableContext
          items={cardIds}
          strategy={verticalListSortingStrategy}
        >
          {cardIds.map((id) => {
            const card = cardById.get(id);
            if (!card) return null;
            return (
              <KanbanSortableCard
                key={id}
                card={card}
                columnId={column.id}
                labels={labels}
                onOpen={() => onOpenCard(card)}
                disabled={dragDisabled}
              />
            );
          })}
        </SortableContext>
        {cards.length === 0 ? (
          <p className="pointer-events-none py-6 text-center text-xs text-hk-muted">
            Solte cards aqui
          </p>
        ) : null}
      </div>
    </div>
  );
}
