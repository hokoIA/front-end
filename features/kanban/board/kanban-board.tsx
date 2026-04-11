"use client";

import type { KanbanCardUi, KanbanColumnUi, KanbanLabelUi } from "@/features/kanban/types/ui";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { KanbanCard } from "./kanban-card";
import { KanbanColumn } from "./kanban-column";

const UNASSIGNED = "unassigned";

function sortCardsInColumn(cards: KanbanCardUi[]): KanbanCardUi[] {
  return [...cards].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.title.localeCompare(b.title);
  });
}

function buildColumnCardIds(
  columns: KanbanColumnUi[],
  cards: KanbanCardUi[],
): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const col of columns) {
    map[col.id] = sortCardsInColumn(cards.filter((c) => c.columnId === col.id)).map(
      (c) => c.id,
    );
  }
  return map;
}

function findColumnOfCard(
  cardId: string,
  map: Record<string, string[]>,
): string | null {
  for (const [colId, ids] of Object.entries(map)) {
    if (ids.includes(cardId)) return colId;
  }
  return null;
}

export function KanbanBoard({
  columns,
  cards,
  labels,
  onOpenCard,
  onAddCard,
  onEditColumn,
  onDeleteColumn,
  onReorderColumn,
  moveCard,
  movePending,
}: {
  columns: KanbanColumnUi[];
  cards: KanbanCardUi[];
  labels: KanbanLabelUi[];
  onOpenCard: (card: KanbanCardUi) => void;
  onAddCard: (columnId: string) => void;
  onEditColumn: (column: KanbanColumnUi) => void;
  onDeleteColumn: (column: KanbanColumnUi) => void;
  onReorderColumn: (columnId: string, direction: -1 | 1) => void;
  moveCard: (args: {
    cardId: string;
    targetColumnId: string;
    orderIndex: number;
  }) => void;
  movePending?: boolean;
}) {
  const columnCardMap = useMemo(
    () => buildColumnCardIds(columns, cards),
    [columns, cards],
  );

  const cardById = useMemo(() => new Map(cards.map((c) => [c.id, c])), [cards]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const activeCard = activeId ? cardById.get(activeId) : undefined;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const colIndex = (id: string) => columns.findIndex((c) => c.id === id);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || movePending) return;

    const activeCardId = String(active.id);
    const overId = String(over.id);

    const map = buildColumnCardIds(columns, cards);
    const sourceCol = findColumnOfCard(activeCardId, map);
    if (!sourceCol) return;

    const targetCol = overId.startsWith("drop-")
      ? overId.slice("drop-".length)
      : findColumnOfCard(overId, map);
    if (!targetCol) return;

    let orderIndex = 0;

    if (sourceCol === targetCol) {
      const items = [...map[sourceCol]];
      const oldIndex = items.indexOf(activeCardId);
      if (oldIndex === -1) return;
      if (overId.startsWith("drop-")) {
        const newOrder = arrayMove(items, oldIndex, items.length - 1);
        orderIndex = newOrder.indexOf(activeCardId);
      } else {
        const overIndex = items.indexOf(overId);
        if (overIndex === -1) return;
        if (oldIndex === overIndex) return;
        const newOrder = arrayMove(items, oldIndex, overIndex);
        orderIndex = newOrder.indexOf(activeCardId);
      }
    } else {
      const dest = map[targetCol] ?? [];
      if (overId.startsWith("drop-")) {
        orderIndex = dest.length;
      } else {
        const overIndex = dest.indexOf(overId);
        orderIndex = overIndex >= 0 ? overIndex : dest.length;
      }
    }

    moveCard({
      cardId: activeCardId,
      targetColumnId: targetCol,
      orderIndex,
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-4 overflow-x-auto pb-3 pt-1 [scrollbar-gutter:stable]">
        {columns.map((col) => {
          const ids = columnCardMap[col.id] ?? [];
          const colCards = ids
            .map((id) => cardById.get(id))
            .filter(Boolean) as KanbanCardUi[];
          const idx = colIndex(col.id);
          const isVirtual = col.id === UNASSIGNED;

          return (
            <KanbanColumn
              key={col.id}
              column={col}
              cards={colCards}
              cardIds={ids}
              labels={labels}
              isVirtual={isVirtual}
              canMoveLeft={!isVirtual && idx > 0}
              canMoveRight={!isVirtual && idx >= 0 && idx < columns.length - 1}
              onMoveLeft={() => onReorderColumn(col.id, -1)}
              onMoveRight={() => onReorderColumn(col.id, 1)}
              onEditColumn={() => onEditColumn(col)}
              onDeleteColumn={() => onDeleteColumn(col)}
              onAddCard={() => onAddCard(col.id)}
              onOpenCard={onOpenCard}
              dragDisabled={!!movePending}
            />
          );
        })}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeCard ? (
          <div className="w-[min(100vw-2rem,20rem)] rotate-1 cursor-grabbing">
            <KanbanCard
              card={activeCard}
              labels={labels}
              onOpen={() => {}}
              overlay
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export function KanbanBoardSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-3">
      {[0, 1, 2].map((k) => (
        <div
          key={k}
          className="h-[28rem] w-[min(100%,20rem)] shrink-0 animate-pulse rounded-xl border border-hk-border bg-hk-canvas/60"
        />
      ))}
    </div>
  );
}
