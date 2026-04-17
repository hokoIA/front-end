import type { GoalUiModel } from "@/features/goals/types/ui";

export function computePlanningOverview(
  goals: GoalUiModel[],
  customerScope: "all" | string,
): {
  active: number;
  completed: number;
  expired: number;
  cancelled: number;
  platformsWithActive: string[];
  customersWithActivePlanning: number;
  withAnalysis: number;
  readyForFinalHint: number;
} {
  const scoped =
    customerScope === "all"
      ? goals
      : goals.filter((g) => g.customerId === customerScope);

  let active = 0;
  let completed = 0;
  let expired = 0;
  let cancelled = 0;
  const platforms = new Set<string>();
  const customerIds = new Set<string>();
  let withAnalysis = 0;
  let readyForFinalHint = 0;

  const today = new Date().toISOString().slice(0, 10);

  for (const g of scoped) {
    if (g.status === "active") active += 1;
    if (g.status === "completed") completed += 1;
    if (g.status === "closed") expired += 1;
    if (g.status === "archived") cancelled += 1;
    if (g.status === "active" && g.platform) {
      platforms.add(g.platform);
    }
    if (g.status === "active" && g.customerId) {
      customerIds.add(g.customerId);
    }
    const hasAnalysis = g.analyses.length > 0;
    if (hasAnalysis) withAnalysis += 1;
    if (
      g.status === "active" &&
      !hasAnalysis &&
      g.endDate &&
      g.endDate <= today
    ) {
      readyForFinalHint += 1;
    }
  }

  return {
    active,
    completed,
    expired,
    cancelled,
    platformsWithActive: [...platforms].slice(0, 8),
    customersWithActivePlanning: customerIds.size,
    withAnalysis,
    readyForFinalHint,
  };
}
