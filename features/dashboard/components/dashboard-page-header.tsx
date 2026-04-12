"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type DashboardPageHeaderProps = {
  /** Período já aplicado — habilita impressão da visão atual. */
  printEnabled?: boolean;
  onPrintPeriod?: () => void;
};

export function DashboardPageHeader({
  printEnabled = false,
  onPrintPeriod,
}: DashboardPageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-hk-border-subtle pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-hk-deep">
          Dashboard
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-hk-muted">
          Leitura consolidada da performance do cliente no período. Métricas
          agrupadas por significado estratégico — alcance, engajamento, audiência,
          tráfego e conteúdo.
        </p>
      </div>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="shrink-0 gap-2 print:hidden"
        disabled={!printEnabled}
        title={
          printEnabled
            ? "Imprimir ou salvar como PDF a visão atual do período (navegador)."
            : "Aplique um período no dashboard para exportar a visão atual."
        }
        onClick={onPrintPeriod}
      >
        <Download className="size-4 opacity-60" />
        Exportar período
      </Button>
    </header>
  );
}
