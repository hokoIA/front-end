"use client";

import { GoalListItem } from "@/features/goals/components/goal-list-item";
import type { GoalUiModel } from "@/features/goals/types/ui";
import { Skeleton } from "@/components/ui/skeleton";

export function GoalsList({
  goals,
  loading,
  onOpenGoal,
}: {
  goals: GoalUiModel[];
  loading?: boolean;
  onOpenGoal: (g: GoalUiModel) => void;
}) {
  if (loading) {
    return (
      <div className="space-y-3" aria-busy="true" aria-label="Carregando metas">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {goals.map((g) => (
        <GoalListItem key={g.id} goal={g} onOpen={() => onOpenGoal(g)} />
      ))}
    </div>
  );
}
