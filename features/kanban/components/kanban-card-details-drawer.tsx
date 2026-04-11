"use client";

import type {
  KanbanCardUi,
  KanbanColumnUi,
  KanbanLabelUi,
} from "@/features/kanban/types/ui";
import { parseKanbanCardActivity } from "@/features/kanban/utils/activity";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  Columns3,
  Pencil,
  Tag,
  Trash2,
  Users,
} from "lucide-react";

function formatDue(d?: string) {
  if (!d) return "—";
  if (d.length >= 10) return d.slice(0, 10);
  return d;
}

export function KanbanCardDetailsDrawer({
  open,
  onOpenChange,
  card,
  column,
  labels,
  onEdit,
  onDelete,
  onMoveRequest,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  card: KanbanCardUi | null;
  column: KanbanColumnUi | undefined;
  labels: KanbanLabelUi[];
  onEdit: () => void;
  onDelete: () => void;
  onMoveRequest?: () => void;
}) {
  if (!card) return null;

  const labelById = new Map(labels.map((l) => [l.id, l]));
  const activity = parseKanbanCardActivity(card.raw);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-lg gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <div className="max-h-[92vh] overflow-y-auto p-6">
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle className="pr-8 text-xl leading-snug">
              {card.title}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="flex flex-wrap gap-2 text-left">
                {card.customerName ? (
                  <Badge variant="secondary" className="font-normal">
                    {card.customerName}
                  </Badge>
                ) : null}
                {card.week ? (
                  <Badge variant="outline" className="font-normal">
                    {card.week}
                  </Badge>
                ) : null}
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-5 text-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-2 rounded-lg border border-hk-border bg-hk-canvas/50 p-3">
                <Columns3 className="mt-0.5 h-4 w-4 shrink-0 text-hk-muted" />
                <div>
                  <p className="text-xs font-medium text-hk-muted">Coluna</p>
                  <p className="mt-0.5 font-medium text-hk-deep">
                    {column?.name ?? "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-lg border border-hk-border bg-hk-canvas/50 p-3">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-hk-muted" />
                <div>
                  <p className="text-xs font-medium text-hk-muted">Prazo</p>
                  <p className="mt-0.5 font-medium text-hk-deep">
                    {formatDue(card.dueDate)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-lg border border-hk-border bg-hk-canvas/50 p-3">
              <Users className="mt-0.5 h-4 w-4 shrink-0 text-hk-muted" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-hk-muted">
                  Responsáveis
                </p>
                <p className="mt-1 text-hk-deep">
                  {card.assigneeNames.length > 0
                    ? card.assigneeNames.join(", ")
                    : "Não definidos"}
                </p>
              </div>
            </div>

            {card.labelIds.length > 0 ? (
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-hk-muted">
                  <Tag className="h-3.5 w-3.5" aria-hidden />
                  Etiquetas
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {card.labelIds.map((id) => {
                    const l = labelById.get(id);
                    return (
                      <Badge
                        key={id}
                        variant="secondary"
                        className="font-normal"
                        style={
                          l
                            ? {
                                backgroundColor: `${l.color}22`,
                                borderColor: `${l.color}44`,
                              }
                            : undefined
                        }
                      >
                        {l?.name ?? id}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {card.description ? (
              <div>
                <p className="mb-1 text-xs font-medium text-hk-muted">
                  Copy / descrição
                </p>
                <p className="whitespace-pre-wrap rounded-lg border border-hk-border bg-hk-surface p-3 text-hk-deep">
                  {card.description}
                </p>
              </div>
            ) : null}

            {card.internalNotes ? (
              <div>
                <p className="mb-1 text-xs font-medium text-amber-800/90">
                  Observações internas
                </p>
                <p className="whitespace-pre-wrap rounded-lg border border-amber-200/80 bg-amber-50/80 p-3 text-hk-deep">
                  {card.internalNotes}
                </p>
              </div>
            ) : null}

            {activity.length > 0 ? (
              <div>
                <Separator className="my-2" />
                <p className="mb-2 text-xs font-medium text-hk-muted">
                  Histórico recente
                </p>
                <ul className="space-y-1.5 text-xs text-hk-muted">
                  {activity.map((line, i) => (
                    <li key={i} className="border-l-2 border-hk-border pl-2">
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ) : card.updatedAt ? (
              <p className="text-xs text-hk-muted">
                Última atualização: {card.updatedAt}
              </p>
            ) : null}
          </div>

          <div className="mt-8 flex flex-wrap gap-2 border-t border-hk-border pt-4">
            {onMoveRequest ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onMoveRequest}
              >
                Mover no quadro
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                onOpenChange(false);
                onEdit();
              }}
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden />
              Editar
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                onOpenChange(false);
                onDelete();
              }}
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden />
              Excluir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
