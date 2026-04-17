import type { PlanningFiltersState } from "@/features/goals/types/filters";
import type { GoalUiModel } from "@/features/goals/types/ui";

function inPeriod(g: GoalUiModel, start: string, end: string): boolean {
  if (!start && !end) return true;
  const gs = g.startDate ?? "";
  const ge = g.endDate ?? "";
  if (start && ge && ge < start) return false;
  if (end && gs && gs > end) return false;
  return true;
}

export function filterPlanningGoals(
  goals: GoalUiModel[],
  filters: PlanningFiltersState,
  customerScope: "all" | string,
): GoalUiModel[] {
  let rows = goals;

  if (customerScope !== "all") {
    rows = rows.filter((g) => g.customerId === customerScope);
  }

  const q = filters.search.trim().toLowerCase();
  if (q) {
    rows = rows.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        (g.customerName ?? "").toLowerCase().includes(q) ||
        (g.description ?? "").toLowerCase().includes(q),
    );
  }

  if (filters.platform !== "all") {
    rows = rows.filter(
      (g) =>
        (g.platform ?? "").toLowerCase() === filters.platform.toLowerCase(),
    );
  }

  if (filters.status !== "all") {
    rows = rows.filter((g) => g.status === filters.status);
  }

  rows = rows.filter((g) =>
    inPeriod(g, filters.periodStart, filters.periodEnd),
  );

  if (filters.onlyWithAnalysis) {
    rows = rows.filter((g) => g.analyses.length > 0);
  }
  if (filters.onlyInProgress) {
    rows = rows.filter((g) => g.status === "active");
  }
  if (filters.onlyClosed) {
    rows = rows.filter((g) =>
      ["completed", "closed", "archived"].includes(g.status),
    );
  }

  const dir = filters.sortDir === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    if (filters.sort === "title") {
      return dir * a.title.localeCompare(b.title, "pt-BR");
    }
    if (filters.sort === "status") {
      return dir * a.status.localeCompare(b.status);
    }
    const da = a.endDate ?? "";
    const db = b.endDate ?? "";
    return dir * da.localeCompare(db);
  });
}
