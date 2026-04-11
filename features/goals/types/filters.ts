import type { GoalLifecycleStatus } from "./ui";
import type { GoalPriority } from "./ui";

export type PlanningHubSortKey = "title" | "endDate" | "priority" | "status";

export type PlanningFiltersState = {
  search: string;
  platform: string;
  status: GoalLifecycleStatus | "all";
  priority: GoalPriority | "all";
  periodStart: string;
  periodEnd: string;
  onlyPartialAnalysis: boolean;
  onlyFinalAnalysis: boolean;
  onlyInProgress: boolean;
  onlyClosed: boolean;
  sort: PlanningHubSortKey;
  sortDir: "asc" | "desc";
};

export const defaultPlanningFilters: PlanningFiltersState = {
  search: "",
  platform: "all",
  status: "all",
  priority: "all",
  periodStart: "",
  periodEnd: "",
  onlyPartialAnalysis: false,
  onlyFinalAnalysis: false,
  onlyInProgress: false,
  onlyClosed: false,
  sort: "endDate",
  sortDir: "asc",
};
