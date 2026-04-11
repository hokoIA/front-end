"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { toast } from "sonner";

/** Exportação: usa impressão do browser (Salvar como PDF). Conteúdo deve estar visível na tela. */
export function GoalExportPdfButton({
  label = "Exportar PDF",
  printAreaId,
}: {
  label?: string;
  /** id de um elemento a focar antes de imprimir (opcional). */
  printAreaId?: string;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={() => {
        if (printAreaId) {
          document.getElementById(printAreaId)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
        toast.message(
          "Na caixa de impressão, escolha “Salvar como PDF”. O layout segue o tema claro da aplicação.",
        );
        setTimeout(() => window.print(), 400);
      }}
    >
      <FileDown className="h-4 w-4" aria-hidden />
      {label}
    </Button>
  );
}
