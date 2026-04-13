"use client";

import { Button } from "@/components/ui/button";
import { exportAnalysisElementToPdf } from "@/features/analises/utils/export-analysis-pdf";
import { FileDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  getExportRoot: () => HTMLElement | null;
  fileName: string;
  /** Se a captura HTML falhar (CSS/CORS), gera PDF em texto a partir do markdown. */
  fallbackMarkdown?: string;
  disabled?: boolean;
};

export function AnalysisExportPdfButton({
  getExportRoot,
  fileName,
  fallbackMarkdown,
  disabled,
}: Props) {
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    const el = getExportRoot();
    if (!el) {
      toast.error("Nada para exportar.");
      return;
    }
    setBusy(true);
    try {
      await exportAnalysisElementToPdf(el, fileName, {
        fallbackPlainText: fallbackMarkdown,
      });
      toast.success("PDF gerado.");
    } catch (e) {
      console.error("[analises] PDF:", e);
      toast.error("Falha ao gerar PDF. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      className="gap-2"
      disabled={disabled || busy}
      onClick={() => void handleClick()}
    >
      {busy ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <FileDown className="size-4" />
      )}
      Baixar PDF
    </Button>
  );
}
