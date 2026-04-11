"use client";

import type { KanbanBoardFilters } from "@/features/kanban/utils/filters";
import type { KanbanClientRowUi, KanbanTeamMemberUi } from "@/features/kanban/types/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutGrid, Plus, Search } from "lucide-react";

export function KanbanFiltersToolbar({
  value,
  onChange,
  weekOptions,
  clients,
  team,
  onNewColumn,
  onNewCard,
  newCardDisabled,
}: {
  value: KanbanBoardFilters;
  onChange: (next: KanbanBoardFilters) => void;
  weekOptions: string[];
  clients: KanbanClientRowUi[];
  team: KanbanTeamMemberUi[];
  onNewColumn: () => void;
  onNewCard: () => void;
  newCardDisabled?: boolean;
}) {
  return (
    <section
      aria-label="Filtros do quadro"
      className="rounded-xl border border-hk-border bg-hk-surface p-4 shadow-hk-sm md:p-5"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="sm:col-span-2 xl:col-span-1">
            <Label htmlFor="hk-kanban-search" className="text-xs text-hk-muted">
              Busca
            </Label>
            <div className="relative mt-1">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-hk-muted"
                aria-hidden
              />
              <Input
                id="hk-kanban-search"
                className="pl-9"
                placeholder="Título, cliente, copy ou etiqueta"
                value={value.search}
                onChange={(e) =>
                  onChange({ ...value, search: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <Label htmlFor="hk-kanban-client" className="text-xs text-hk-muted">
              Cliente
            </Label>
            <Select
              value={value.customerId}
              onValueChange={(customerId) =>
                onChange({ ...value, customerId })
              }
            >
              <SelectTrigger id="hk-kanban-client" className="mt-1">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label
              htmlFor="hk-kanban-assignee"
              className="text-xs text-hk-muted"
            >
              Responsável
            </Label>
            <Select
              value={value.assigneeId}
              onValueChange={(assigneeId) =>
                onChange({ ...value, assigneeId })
              }
            >
              <SelectTrigger id="hk-kanban-assignee" className="mt-1">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {team.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="hk-kanban-week" className="text-xs text-hk-muted">
              Semana
            </Label>
            <Select
              value={value.week}
              onValueChange={(week) => onChange({ ...value, week })}
            >
              <SelectTrigger id="hk-kanban-week" className="mt-1">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {weekOptions.map((w) => (
                  <SelectItem key={w} value={w}>
                    {w}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 lg:shrink-0">
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={onNewColumn}
          >
            <LayoutGrid className="h-4 w-4" aria-hidden />
            Nova coluna
          </Button>
          <Button
            type="button"
            className="gap-2 bg-hk-action text-white hover:bg-hk-strong"
            onClick={onNewCard}
            disabled={newCardDisabled}
          >
            <Plus className="h-4 w-4" aria-hidden />
            Novo card
          </Button>
        </div>
      </div>
    </section>
  );
}
