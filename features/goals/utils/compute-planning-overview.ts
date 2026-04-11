import type { GoalUiModel } from "@/features/goals/types/ui";

const activeLike = new Set([
  "active",
  "monitoring",
  "attention",
  "draft",
]);

const doneLike = new Set(["completed", "closed"]);

export function computePlanningOverview(
  goals: GoalUiModel[],
  customerScope: "all" | string,
): {
  active: number;
  completed: number;
  attention: number;
  platformsWithActive: string[];
  customersWithActivePlanning: number;
  withPartialAnalysis: number;
  readyForFinalHint: number;
} {
  const scoped =
    customerScope === "all"
      ? goals
      : goals.filter((g) => g.customerId === customerScope);

  let active = 0;
  let completed = 0;
  let attention = 0;
  const platforms = new Set<string>();
  const customerIds = new Set<string>();
  let withPartialAnalysis = 0;
  let readyForFinalHint = 0;

  const today = new Date().toISOString().slice(0, 10);

  for (const g of scoped) {
    if (g.status === "attention") attention += 1;
    if (activeLike.has(g.status) && g.status !== "draft") active += 1;
    if (doneLike.has(g.status)) completed += 1;
    if (
      (g.status === "active" ||
        g.status === "monitoring" ||
        g.status === "attention") &&
      g.platform
    ) {
      platforms.add(g.platform);
    }
    if (activeLike.has(g.status) && g.customerId) {
      customerIds.add(g.customerId);
    }
    const hasPartial = g.analyses.some((a) => a.type === "partial");
    const hasFinal = g.analyses.some((a) => a.type === "final");
    if (hasPartial) withPartialAnalysis += 1;
    if (
      (g.status === "active" || g.status === "monitoring") &&
      !hasFinal &&
      g.endDate &&
      g.endDate <= today
    ) {
      readyForFinalHint += 1;
    }
  }

  return {
    active,
    completed,
    attention,
    platformsWithActive: [...platforms].slice(0, 8),
    customersWithActivePlanning: customerIds.size,
    withPartialAnalysis,
    readyForFinalHint,
  };
}
