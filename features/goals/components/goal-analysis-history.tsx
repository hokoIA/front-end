"use client";

import type { GoalAnalysisUi } from "@/features/goals/types/ui";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";

export function GoalAnalysisHistory({
  analyses,
  onOpen,
}: {
  analyses: GoalAnalysisUi[];
  onOpen: (a: GoalAnalysisUi) => void;
}) {
  if (analyses.length === 0) {
    return (
      <p className="text-sm text-hk-muted">
        Nenhuma análise disponível. Quando o período terminar, use “Gerar análise
        do período”; o backend persiste o texto no campo analysis_text da meta.
      </p>
    );
  }

  const sorted = [...analyses].sort((a, b) =>
    (b.generatedAt ?? "").localeCompare(a.generatedAt ?? ""),
  );

  return (
    <ul className="space-y-2">
      {sorted.map((a) => (
        <li
          key={a.id}
          className="flex flex-col gap-2 rounded-lg border border-hk-border-subtle bg-hk-canvas/50 p-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-sm font-medium text-hk-deep">
              {a.title ?? "Análise do período"}
            </p>
            <p className="text-xs text-hk-muted">
              Gerada em: {a.generatedAt ?? "—"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="gap-1"
              onClick={() => onOpen(a)}
            >
              <Eye className="h-3.5 w-3.5" aria-hidden />
              Abrir
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="gap-1 text-hk-muted"
              onClick={() => {
                const blob = new Blob([a.content ?? ""], {
                  type: "text/plain;charset=utf-8",
                });
                const url = URL.createObjectURL(blob);
                const el = document.createElement("a");
                el.href = url;
                el.download = `analise-meta-${a.id}.txt`;
                el.click();
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="h-3.5 w-3.5" aria-hidden />
              Baixar
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
