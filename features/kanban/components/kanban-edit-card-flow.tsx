"use client";

import type {
  KanbanCardUi,
  KanbanClientRowUi,
  KanbanColumnUi,
  KanbanLabelUi,
  KanbanTeamMemberUi,
} from "@/features/kanban/types/ui";
import { KanbanCardFormDialog } from "./kanban-card-form-dialog";

export function KanbanEditCardFlow({
  open,
  onOpenChange,
  card,
  columns,
  labels,
  clients,
  team,
  onUpdate,
  isPending,
  errorMessage,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  card: KanbanCardUi | null;
  columns: KanbanColumnUi[];
  labels: KanbanLabelUi[];
  clients: KanbanClientRowUi[];
  team: KanbanTeamMemberUi[];
  onUpdate: (id: string, body: Record<string, unknown>) => void;
  isPending: boolean;
  errorMessage?: string | null;
}) {
  return (
    <KanbanCardFormDialog
      open={open}
      onOpenChange={onOpenChange}
      mode="edit"
      initial={card}
      columns={columns}
      labels={labels}
      clients={clients}
      team={team}
      onCreate={() => {}}
      onUpdate={onUpdate}
      isPending={isPending}
      errorMessage={errorMessage}
    />
  );
}
