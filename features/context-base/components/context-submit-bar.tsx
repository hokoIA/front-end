"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";

type Props = {
  onSubmit: () => void;
  loading: boolean;
  disabled?: boolean;
};

export function ContextSubmitBar({ onSubmit, loading, disabled }: Props) {
  return (
    <div className="flex flex-col gap-3 border-t border-hk-border-subtle bg-hk-canvas/40 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
      <p className="text-xs leading-relaxed text-hk-muted">
        {loading
          ? "Indexando e preparando vetores no serviço de análise. Evite fechar a aba."
          : "Ao enviar, o documento segue para a base contextual do cliente, sujeito às políticas de confidencialidade definidas acima."}
      </p>
      <Button
        type="button"
        size="lg"
        className="min-w-[200px] gap-2"
        disabled={disabled || loading}
        onClick={onSubmit}
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Send className="size-4" />
        )}
        {loading ? "Enviando contexto…" : "Enviar para a base"}
      </Button>
    </div>
  );
}
