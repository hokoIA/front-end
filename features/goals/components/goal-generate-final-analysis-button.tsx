"use client";

import { HttpError } from "@/lib/api/http-client";
import { useGoalGenerateAnalysisMutation } from "@/hooks/api/use-goals-queries";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function GoalGenerateFinalAnalysisButton({
  idGoal,
  periodEndDate,
  hasAnalysis,
  disabled,
}: {
  idGoal: string;
  /** data_fim (YYYY-MM-DD) — o backend só gera após o fim do período. */
  periodEndDate?: string;
  hasAnalysis: boolean;
  disabled?: boolean;
}) {
  const gen = useGoalGenerateAnalysisMutation();
  const today = new Date().toISOString().slice(0, 10);
  const periodNotEnded = Boolean(periodEndDate && periodEndDate > today);

  const blocked =
    Boolean(disabled) ||
    gen.isPending ||
    hasAnalysis ||
    periodNotEnded;

  return (
    <Button
      type="button"
      className="gap-2 bg-hk-deep text-white hover:bg-hk-strong"
      size="sm"
      disabled={blocked}
      title={
        periodNotEnded
          ? "Disponível após a data de fim do período (contrato do backend)."
          : hasAnalysis
            ? "Esta meta já possui análise registrada."
            : undefined
      }
      onClick={() => {
        void (async () => {
          try {
            await gen.mutateAsync({ idGoal });
            toast.success(
              "Análise gerada. A meta foi atualizada com o texto e o status retornados pelo backend.",
            );
          } catch (e) {
            const msg =
              e instanceof HttpError
                ? e.message
                : e instanceof Error
                  ? e.message
                  : "Não foi possível gerar a análise.";
            toast.error(msg);
          }
        })();
      }}
    >
      {gen.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : (
        <CheckCircle2 className="h-4 w-4" aria-hidden />
      )}
      Gerar análise do período
    </Button>
  );
}
