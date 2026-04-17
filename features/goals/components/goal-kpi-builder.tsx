"use client";

import type { GoalKpiUi } from "@/features/goals/types/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

function emptyKpi(): GoalKpiUi {
  return {
    id: `kpi-${Date.now()}`,
    kpi: "",
    name: "",
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
        <p className="text-sm font-medium text-hk-deep">KPIs</p>
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
      <p className="text-xs text-hk-muted">
        Cada KPI precisa dos campos <strong>kpi</strong> (identificador) e{" "}
        <strong>label</strong> (nome exibido), conforme validação do backend.
      </p>
      {kpis.length === 0 ? (
        <p className="text-sm text-hk-muted">
          Adicione pelo menos um KPI antes de salvar.
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
              <div className="grid gap-2">
                <Label>Identificador (kpi)</Label>
                <Input
                  value={k.kpi}
                  onChange={(e) => update(i, { kpi: e.target.value })}
                  placeholder="Ex.: alcance_organico_mensal"
                />
              </div>
              <div className="grid gap-2">
                <Label>Nome (label)</Label>
                <Input
                  value={k.name}
                  onChange={(e) => update(i, { name: e.target.value })}
                  placeholder="Ex.: Alcance orgânico mensal"
                />
              </div>
              <div className="grid gap-2">
                <Label>Baseline (opcional)</Label>
                <Input
                  value={k.baseline ?? ""}
                  onChange={(e) => update(i, { baseline: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Meta alvo (opcional)</Label>
                <Input
                  value={k.target ?? ""}
                  onChange={(e) => update(i, { target: e.target.value })}
                />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label>Unidade (opcional)</Label>
                <Input
                  value={k.unit ?? ""}
                  onChange={(e) => update(i, { unit: e.target.value })}
                  placeholder="%, usuários, R$"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
