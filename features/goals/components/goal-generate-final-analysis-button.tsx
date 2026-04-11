"use client";

import { useGoalGenerateAnalysisMutation } from "@/hooks/api/use-goals-queries";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function GoalGenerateFinalAnalysisButton({
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
      className="gap-2 bg-hk-deep text-white hover:bg-hk-strong"
      size="sm"
      disabled={disabled || gen.isPending}
      onClick={() => {
        void (async () => {
          try {
            await gen.mutateAsync({
              idGoal,
              body: { analysis_type: "final", tipo: "final" },
            });
            toast.success("Análise final solicitada. Atualizando histórico…");
          } catch {
            toast.error("Não foi possível gerar a análise final.");
          }
        })();
      }}
    >
      {gen.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : (
        <CheckCircle2 className="h-4 w-4" aria-hidden />
      )}
      Gerar análise final
    </Button>
  );
}
