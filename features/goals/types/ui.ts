import type { Goal } from "@/lib/types/goals";

export type GoalLifecycleStatus =
  | "draft"
  | "active"
  | "monitoring"
  | "attention"
  | "completed"
  | "closed"
  | "archived"
  | "unknown";

export type GoalOrigin =
  | "manual"
  | "ai"
  | "meeting"
  | "prior_analysis"
  | "unknown";

export type GoalPriority = "low" | "medium" | "high" | "critical" | "unknown";

export type KpiDirection = "increase" | "decrease" | "maintain" | "unknown";

export type GoalKpiUi = {
  id: string;
  name: string;
  baseline?: string;
  target?: string;
  unit?: string;
  direction: KpiDirection;
  note?: string;
  progressPct?: number;
};

export type GoalAnalysisType = "partial" | "final";

export type GoalAnalysisUi = {
  id: string;
  generatedAt?: string;
  periodLabel?: string;
  type: GoalAnalysisType;
  title?: string;
  content?: string;
  raw?: unknown;
};

/** Modelo de UI desacoplado do contrato bruto da API. */
export type GoalUiModel = {
  id: string;
  customerId?: string;
  customerName?: string;
  platform?: string;
  goalType?: string;
  title: string;
  priority: GoalPriority;
  origin: GoalOrigin;
  status: GoalLifecycleStatus;
  responsible?: string;
  campaignLink?: string;
  description?: string;
  smart?: string;
  rationale?: string;
  hypothesis?: string;
  expectedImpact?: string;
  internalNotes?: string;
  startDate?: string;
  endDate?: string;
  durationWeeks?: number;
  checkpointCadence?: string;
  kpis: GoalKpiUi[];
  analyses: GoalAnalysisUi[];
  progressApprox?: number;
  raw: Goal;
};
