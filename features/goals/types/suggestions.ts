import type { GoalPriority } from "./ui";

/** Sugestão retornada por POST /api/goals/actions/suggestions (formato flexível). */
export type GoalSuggestion = {
  id: string;
  title: string;
  strategicObjective: string;
  platform: string;
  rationaleTiming: string;
  suggestedKpis: string[];
  horizonLabel: string;
  priority: GoalPriority;
  description?: string;
  smart?: string;
  goalType?: string;
  startDate?: string;
  endDate?: string;
  raw?: unknown;
};
