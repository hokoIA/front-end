/** KPI sugerido pela API (`kpis: [{ kpi, label }]`). */
export type GoalSuggestionKpiRow = {
  kpi: string;
  label: string;
};

/** Sugestão retornada por POST /api/goals/actions/suggestions. */
export type GoalSuggestion = {
  id: string;
  title: string;
  tipoMeta?: string;
  descricao?: string;
  rationale?: string;
  /** `platform_name` da requisição / resposta. */
  platform: string;
  kpis: GoalSuggestionKpiRow[];
  raw?: unknown;
};
