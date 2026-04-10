"use client";

import { AnalysisExportPdfButton } from "@/features/analises/components/analysis-export-pdf-button";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";

type Props = {
  markdown: string;
  getExportRoot: () => HTMLElement | null;
  exportFileName: string;
  onRegenerate: () => void;
  onEditParams: () => void;
  generateDisabled?: boolean;
};

export function AnalysisResultActions({
  markdown,
  getExportRoot,
  exportFileName,
  onRegenerate,
  onEditParams,
  generateDisabled,
}: Props) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(markdown);
      toast.success("Conteúdo copiado.");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-hk-border-subtle bg-hk-surface px-4 py-3 md:px-5">
      <AnalysisExportPdfButton
        getExportRoot={getExportRoot}
        fileName={exportFileName}
        disabled={!markdown.trim()}
      />
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="gap-2"
        disabled={!markdown.trim()}
        onClick={() => void copy()}
      >
        <Copy className="size-4" />
        Copiar
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="gap-2"
        disabled={generateDisabled}
        onClick={onRegenerate}
      >
        <RefreshCw className="size-4" />
        Gerar novamente
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="gap-2 text-hk-muted"
        onClick={onEditParams}
      >
        <SlidersHorizontal className="size-4" />
        Ajustar parâmetros
      </Button>
    </div>
  );
}
