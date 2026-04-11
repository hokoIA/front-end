"use client";

import type { KanbanCardUi, KanbanLabelUi } from "@/features/kanban/types/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { CalendarDays, ChevronRight, User } from "lucide-react";

function formatDue(d?: string) {
  if (!d) return null;
  return d.length >= 10 ? d.slice(0, 10) : d;
}

export function KanbanCard({
  card,
  labels,
  onOpen,
  overlay,
}: {
  card: KanbanCardUi;
  labels: KanbanLabelUi[];
  onOpen: () => void;
  overlay?: boolean;
}) {
  const labelById = new Map(labels.map((l) => [l.id, l]));
  const due = formatDue(card.dueDate);

  return (
    <article
      className={cn(
        "rounded-lg border border-hk-border bg-hk-surface p-3 shadow-hk-sm transition-shadow",
        overlay && "shadow-hk-md ring-2 ring-hk-action/20",
        "hover:border-hk-action/30 hover:shadow-hk-md",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-hk-deep">
          {card.title}
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 text-hk-muted hover:text-hk-deep"
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          aria-label="Ver detalhes"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {card.customerName ? (
        <p className="mt-2 text-xs font-medium text-hk-action">
          {card.customerName}
        </p>
      ) : null}

      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-hk-muted">
        {card.week ? (
          <span className="rounded bg-hk-canvas px-1.5 py-0.5 font-medium text-hk-deep/80">
            {card.week}
          </span>
        ) : null}
        {due ? (
          <span className="inline-flex items-center gap-0.5">
            <CalendarDays className="h-3 w-3" aria-hidden />
            {due}
          </span>
        ) : null}
      </div>

      {card.assigneeNames.length > 0 ? (
        <p className="mt-2 flex items-center gap-1 text-[11px] text-hk-muted">
          <User className="h-3 w-3 shrink-0" aria-hidden />
          <span className="truncate">{card.assigneeNames.join(", ")}</span>
        </p>
      ) : null}

      {card.labelIds.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {card.labelIds.map((id) => {
            const l = labelById.get(id);
            return (
              <Badge
                key={id}
                variant="outline"
                className="px-1.5 py-0 text-[10px] font-normal"
                style={
                  l
                    ? {
                        borderColor: `${l.color}66`,
                        color: "var(--hk-deep, #0f172a)",
                        backgroundColor: `${l.color}18`,
                      }
                    : undefined
                }
              >
                {l?.name ?? id}
              </Badge>
            );
          })}
        </div>
      ) : null}

      {card.copyPreview ? (
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-hk-muted">
          {card.copyPreview}
        </p>
      ) : null}

      <Button
        type="button"
        variant="link"
        className="mt-1 h-auto p-0 text-xs text-hk-action"
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
      >
        Abrir detalhes
      </Button>
    </article>
  );
}
