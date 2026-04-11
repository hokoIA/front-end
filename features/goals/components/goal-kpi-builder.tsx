"use client";

import type { GoalKpiUi, KpiDirection } from "@/features/goals/types/ui";
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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

const DIRS: { value: KpiDirection; label: string }[] = [
  { value: "increase", label: "Aumentar" },
  { value: "decrease", label: "Reduzir" },
  { value: "maintain", label: "Manter" },
  { value: "unknown", label: "—" },
];

function emptyKpi(): GoalKpiUi {
  return {
    id: `kpi-${Date.now()}`,
    name: "",
    direction: "increase",
  };
}

export function GoalKpiBuilder({
  kpis,
  onChange,
}: {
  kpis: GoalKpiUi[];
  onChange: (next: GoalKpiUi[]) => void;
}) {
  const update = (i: number, patch: Partial<GoalKpiUi>) => {
    const next = [...kpis];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };

  const remove = (i: number) => {
    onChange(kpis.filter((_, j) => j !== i));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-hk-deep">KPIs / resultados-chave</p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="gap-1"
          onClick={() => onChange([...kpis, emptyKpi()])}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Adicionar KPI
        </Button>
      </div>
      {kpis.length === 0 ? (
        <p className="text-sm text-hk-muted">
          Adicione pelo menos um indicador para medir o plano.
        </p>
      ) : null}
      <div className="space-y-6">
        {kpis.map((k, i) => (
          <div
            key={k.id}
            className="rounded-lg border border-hk-border-subtle bg-hk-canvas/40 p-4"
          >
            <div className="mb-3 flex justify-end">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-hk-muted"
                aria-label="Remover KPI"
                onClick={() => remove(i)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2 sm:col-span-2">
                <Label>Nome do indicador</Label>
                <Input
                  value={k.name}
                  onChange={(e) => update(i, { name: e.target.value })}
                  placeholder="Ex.: Alcance orgânico mensal"
                />
              </div>
              <div className="grid gap-2">
                <Label>Baseline</Label>
                <Input
                  value={k.baseline ?? ""}
                  onChange={(e) => update(i, { baseline: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Meta alvo</Label>
                <Input
                  value={k.target ?? ""}
                  onChange={(e) => update(i, { target: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Unidade</Label>
                <Input
                  value={k.unit ?? ""}
                  onChange={(e) => update(i, { unit: e.target.value })}
                  placeholder="%, usuários, R$"
                />
              </div>
              <div className="grid gap-2">
                <Label>Direção esperada</Label>
                <Select
                  value={k.direction}
                  onValueChange={(v) =>
                    update(i, { direction: v as KpiDirection })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIRS.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label>Observação</Label>
                <Textarea
                  rows={2}
                  value={k.note ?? ""}
                  onChange={(e) => update(i, { note: e.target.value })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
