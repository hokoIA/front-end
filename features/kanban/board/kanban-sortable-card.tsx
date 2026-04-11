"use client";

import type { KanbanCardUi, KanbanLabelUi } from "@/features/kanban/types/ui";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { KanbanCard } from "./kanban-card";

export function KanbanSortableCard({
  card,
  columnId,
  labels,
  onOpen,
  disabled,
}: {
  card: KanbanCardUi;
  columnId: string;
  labels: KanbanLabelUi[];
  onOpen: () => void;
  disabled?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: { type: "card", columnId },
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={
        isDragging ? "relative z-10 opacity-60" : "touch-none"
      }
      {...attributes}
      {...listeners}
    >
      <KanbanCard card={card} labels={labels} onOpen={onOpen} />
    </div>
  );
}
