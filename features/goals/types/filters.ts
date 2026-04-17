import type { GoalLifecycleStatus } from "./ui";

export type PlanningHubSortKey = "title" | "endDate" | "status";

export type PlanningFiltersState = {
  search: string;
  platform: string;
  status: GoalLifecycleStatus | "all";
  periodStart: string;
  periodEnd: string;
  /** Meta com `analysis_text` preenchido (análise gerada). */
  onlyWithAnalysis: boolean;
  onlyInProgress: boolean;
  onlyClosed: boolean;
  sort: PlanningHubSortKey;
  sortDir: "asc" | "desc";
};

export const defaultPlanningFilters: PlanningFiltersState = {
  search: "",
  platform: "all",
  status: "all",
  periodStart: "",
  periodEnd: "",
  onlyWithAnalysis: false,
  onlyInProgress: false,
  onlyClosed: false,
  sort: "endDate",
  sortDir: "asc",
};
