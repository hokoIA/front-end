import type { Goal } from "@/lib/types/goals";

/** Status interno da UI após normalizar valores do backend. */
export type GoalLifecycleStatus =
  | "active"
  | "completed"
  | "closed"
  | "archived"
  | "unknown";

export type GoalKpiUi = {
  id: string;
  /** Campo `kpi` enviado à API. */
  kpi: string;
  /** Campo `label` na API (exibição). */
  name: string;
  baseline?: string;
  target?: string;
  unit?: string;
};

export type GoalAnalysisUi = {
  id: string;
  generatedAt?: string;
  periodLabel?: string;
  /** O backend atual só persiste análise final em `analysis_text`. */
  type: "final";
  title?: string;
  content?: string;
  raw?: unknown;
};

/** Modelo de UI desacoplado do JSON da API de metas. */
export type GoalUiModel = {
  id: string;
  customerId?: string;
  customerName?: string;
  platform?: string;
  goalType?: string;
  title: string;
  status: GoalLifecycleStatus;
  description?: string;
  startDate?: string;
  endDate?: string;
  kpis: GoalKpiUi[];
  analyses: GoalAnalysisUi[];
  /** Resultado declarado na análise gerada (quando existir). */
  achieved?: boolean | null;
  achievedScore?: number | null;
  raw: Goal;
};
