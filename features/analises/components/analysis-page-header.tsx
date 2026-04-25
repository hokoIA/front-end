"use client";

import { PageHeader } from "@/components/data-display/page-header";

export function AnalysisPageHeader() {
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Narrativa estratégica"
        title="Análises"
        description="Gere leituras executivas do período com foco em decisão. Este módulo transforma dados consolidados em interpretação orientada a negócio."
      />
      <p className="rounded-xl border border-hk-border-subtle bg-hk-surface px-4 py-3 text-sm leading-relaxed text-hk-muted shadow-hk-xs">
        O <span className="font-medium text-hk-ink">Dashboard</span> organiza
        métricas e microleituras;{" "}
        <span className="font-medium text-hk-ink">Análises</span> consolida o
        período em narrativa interpretativa para justificativas e planos de ação.
      </p>
    </div>
  );
}
