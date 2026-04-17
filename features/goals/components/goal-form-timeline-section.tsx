"use client";

import type { GoalLifecycleStatus } from "@/features/goals/types/ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUSES: GoalLifecycleStatus[] = [
  "active",
  "completed",
  "closed",
  "archived",
  "unknown",
];

const labels: Record<GoalLifecycleStatus, string> = {
  active: "Ativa",
  completed: "Concluída",
  closed: "Expirada",
  archived: "Cancelada",
  unknown: "Indefinido",
};

/**
 * FUTURA IMPLEMENTAÇÃO: edição completa de metas com campos adicionais do backend.
 * Hoje o fluxo principal de criação não usa este componente (datas são coletadas
 * diretamente no fluxo alinhado ao contrato atual).
 */
export function GoalFormTimelineSection({
  startDate,
  endDate,
  durationWeeks,
  checkpointCadence,
  status,
  onChange,
}: {
  startDate: string;
  endDate: string;
  durationWeeks: string;
  checkpointCadence: string;
  status: GoalLifecycleStatus;
  onChange: (patch: Record<string, string | GoalLifecycleStatus>) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-hk-deep">Temporalidade</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="g-start" className="text-sm font-medium">
            Início
          </Label>
          <Input
            id="g-start"
            type="date"
            value={startDate}
            onChange={(e) => onChange({ startDate: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="g-end" className="text-sm font-medium">
            Fim
          </Label>
          <Input
            id="g-end"
            type="date"
            value={endDate}
            onChange={(e) => onChange({ endDate: e.target.value })}
          />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="g-dur" className="text-sm font-medium">
            Duração estimada (semanas)
          </Label>
          <Input
            id="g-dur"
            type="number"
            min={0}
            value={durationWeeks}
            onChange={(e) => onChange({ durationWeeks: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="g-check" className="text-sm font-medium">
            Checkpoint (ex.: mensal)
          </Label>
          <Input
            id="g-check"
            value={checkpointCadence}
            onChange={(e) => onChange({ checkpointCadence: e.target.value })}
            placeholder="Mensal / quinzenal"
          />
        </div>
      </div>
      <div className="grid gap-2">
        <span className="text-sm font-medium text-hk-ink">Status</span>
        <Select
          value={status}
          onValueChange={(v) =>
            onChange({ status: v as GoalLifecycleStatus })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {labels[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
