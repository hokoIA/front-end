"use client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/data-display/page-header";
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
    <PageHeader
      eyebrow="Visão consolidada"
      title="Dashboard"
      description="Leitura operacional e estratégica da performance do cliente no período: alcance, visibilidade, audiência, tráfego e conteúdo."
      actions={
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
      }
    />
  );
}
