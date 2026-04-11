"use client";

import { useGoalGenerateAnalysisMutation } from "@/hooks/api/use-goals-queries";
import { Button } from "@/components/ui/button";
import { Loader2, LineChart } from "lucide-react";
import { toast } from "sonner";

export function GoalGeneratePartialAnalysisButton({
  idGoal,
  disabled,
}: {
  idGoal: string;
  disabled?: boolean;
}) {
  const gen = useGoalGenerateAnalysisMutation();

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      className="gap-2"
      disabled={disabled || gen.isPending}
      onClick={() => {
        void (async () => {
          try {
            await gen.mutateAsync({
              idGoal,
              body: { analysis_type: "partial", tipo: "parcial" },
            });
            toast.success("Análise parcial solicitada. Atualizando histórico…");
          } catch {
            toast.error("Não foi possível gerar a análise parcial.");
          }
        })();
      }}
    >
      {gen.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : (
        <LineChart className="h-4 w-4" aria-hidden />
      )}
      Gerar análise parcial
    </Button>
  );
}
