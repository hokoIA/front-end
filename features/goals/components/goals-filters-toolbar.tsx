"use client";

import type { PlanningFiltersState } from "@/features/goals/types/filters";
import type { GoalLifecycleStatus } from "@/features/goals/types/ui";
import type { GoalPriority } from "@/features/goals/types/ui";
import { PLANNING_PLATFORM_OPTIONS } from "@/features/goals/utils/platform-labels";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

const STATUSES: { value: GoalLifecycleStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos os status" },
  { value: "draft", label: "Rascunho" },
  { value: "active", label: "Ativa" },
  { value: "monitoring", label: "Em acompanhamento" },
  { value: "attention", label: "Em atenção" },
  { value: "completed", label: "Concluída" },
  { value: "closed", label: "Encerrada" },
  { value: "archived", label: "Arquivada" },
  { value: "unknown", label: "Indefinido" },
];

const PRIORITIES: { value: GoalPriority | "all"; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "critical", label: "Crítica" },
  { value: "high", label: "Alta" },
  { value: "medium", label: "Média" },
  { value: "low", label: "Baixa" },
  { value: "unknown", label: "—" },
];

export function GoalsFiltersToolbar({
  value,
  onChange,
}: {
  value: PlanningFiltersState;
  onChange: (next: PlanningFiltersState) => void;
}) {
  return (
    <div className="rounded-xl border border-hk-border bg-hk-surface p-4 shadow-hk-sm">
      <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-4">
          <Label htmlFor="hk-goals-search" className="text-xs text-hk-muted">
            Buscar
          </Label>
          <div className="relative mt-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-hk-muted"
              aria-hidden
            />
            <Input
              id="hk-goals-search"
              placeholder="Título, cliente ou descrição"
              className="pl-9"
              value={value.search}
              onChange={(e) => onChange({ ...value, search: e.target.value })}
            />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
          <div>
            <Label className="text-xs text-hk-muted">Plataforma</Label>
            <Select
              value={value.platform}
              onValueChange={(v) => onChange({ ...value, platform: v })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLANNING_PLATFORM_OPTIONS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-hk-muted">Status</Label>
            <Select
              value={value.status}
              onValueChange={(v) =>
                onChange({
                  ...value,
                  status: v as PlanningFiltersState["status"],
                })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-hk-muted">Prioridade</Label>
            <Select
              value={value.priority}
              onValueChange={(v) =>
                onChange({
                  ...value,
                  priority: v as PlanningFiltersState["priority"],
                })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-hk-muted">Ordenação</Label>
            <Select
              value={`${value.sort}-${value.sortDir}`}
              onValueChange={(v) => {
                const [sort, sortDir] = v.split("-") as [
                  PlanningFiltersState["sort"],
                  PlanningFiltersState["sortDir"],
                ];
                onChange({ ...value, sort, sortDir });
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="endDate-asc">Fim (mais próximo)</SelectItem>
                <SelectItem value="endDate-desc">Fim (mais distante)</SelectItem>
                <SelectItem value="title-asc">Título (A–Z)</SelectItem>
                <SelectItem value="title-desc">Título (Z–A)</SelectItem>
                <SelectItem value="priority-desc">Prioridade (maior)</SelectItem>
                <SelectItem value="status-asc">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 border-t border-hk-border-subtle pt-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="grid gap-2">
          <Label htmlFor="hk-p-start" className="text-xs text-hk-muted">
            Período (início)
          </Label>
          <Input
            id="hk-p-start"
            type="date"
            value={value.periodStart}
            onChange={(e) =>
              onChange({ ...value, periodStart: e.target.value })
            }
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="hk-p-end" className="text-xs text-hk-muted">
            Período (fim)
          </Label>
          <Input
            id="hk-p-end"
            type="date"
            value={value.periodEnd}
            onChange={(e) => onChange({ ...value, periodEnd: e.target.value })}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 border-t border-hk-border-subtle pt-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <Checkbox
            checked={value.onlyInProgress}
            onCheckedChange={(c) =>
              onChange({ ...value, onlyInProgress: c === true })
            }
          />
          Em andamento
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <Checkbox
            checked={value.onlyClosed}
            onCheckedChange={(c) =>
              onChange({ ...value, onlyClosed: c === true })
            }
          />
          Encerradas
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <Checkbox
            checked={value.onlyPartialAnalysis}
            onCheckedChange={(c) =>
              onChange({ ...value, onlyPartialAnalysis: c === true })
            }
          />
          Com análise parcial
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <Checkbox
            checked={value.onlyFinalAnalysis}
            onCheckedChange={(c) =>
              onChange({ ...value, onlyFinalAnalysis: c === true })
            }
          />
          Com análise final
        </label>
      </div>
    </div>
  );
}
