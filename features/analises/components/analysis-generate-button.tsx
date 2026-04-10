"use client";

import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

type Props = {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export function AnalysisGenerateButton({ onClick, loading, disabled }: Props) {
  return (
    <Button
      type="button"
      size="lg"
      className="h-11 min-w-[200px] gap-2 px-6"
      onClick={onClick}
      disabled={disabled || loading}
    >
      <FileText className="size-4" />
      {loading ? "Gerando análise…" : "Gerar análise"}
    </Button>
  );
}
