"use client";

import { BrainCircuit } from "lucide-react";
import { PageHeader } from "@/components/data-display/page-header";

export function GoalsPageHeader() {
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Metas e execução"
        title="Planejamento Estratégico"
        description="Organize metas por cliente, conecte KPI a prazo e acompanhe evolução com análises parciais e finais."
      />
      <div className="flex items-start gap-3 rounded-xl border border-hk-border-subtle bg-hk-surface px-4 py-3 text-sm text-hk-muted shadow-hk-xs">
        <BrainCircuit
          className="mt-0.5 h-5 w-5 shrink-0 text-hk-action"
          aria-hidden
        />
        <p>
          <span className="font-medium text-hk-ink">Meta define direção.</span>{" "}
          A análise interpreta execução e orienta os próximos ajustes táticos.
        </p>
      </div>
    </div>
  );
}
