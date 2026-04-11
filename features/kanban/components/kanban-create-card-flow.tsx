"use client";

import type {
  KanbanCardUi,
  KanbanClientRowUi,
  KanbanColumnUi,
  KanbanLabelUi,
  KanbanTeamMemberUi,
} from "@/features/kanban/types/ui";
import { KanbanCardFormDialog } from "./kanban-card-form-dialog";

export function KanbanCreateCardFlow({
  open,
  onOpenChange,
  defaultColumnId,
  columns,
  labels,
  clients,
  team,
  onCreate,
  isPending,
  errorMessage,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  defaultColumnId?: string;
  columns: KanbanColumnUi[];
  labels: KanbanLabelUi[];
  clients: KanbanClientRowUi[];
  team: KanbanTeamMemberUi[];
  onCreate: (body: Record<string, unknown>) => void;
  isPending: boolean;
  errorMessage?: string | null;
}) {
  return (
    <KanbanCardFormDialog
      open={open}
      onOpenChange={onOpenChange}
      mode="create"
      initial={null}
      defaultColumnId={defaultColumnId}
      columns={columns}
      labels={labels}
      clients={clients}
      team={team}
      onCreate={onCreate}
      onUpdate={() => {}}
      isPending={isPending}
      errorMessage={errorMessage}
    />
  );
}
