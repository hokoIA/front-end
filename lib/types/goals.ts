/**
 * Contrato alinhado ao backend de produção (`/api/goals`).
 * Não adicionar campos que a API real não persista.
 */

export type GoalKpiApi = {
  kpi: string;
  label: string;
  baseline?: number | null;
  target?: number | null;
  unit?: string | null;
};

/** Meta como retornada/gravada pela API. */
export type GoalApi = {
  id_goal?: string | number;
  id_user?: string | number;
  id_customer?: string | number;
  platform_name?: string;
  tipo_meta?: string;
  title?: string;
  descricao?: string;
  data_inicio?: string;
  data_fim?: string;
  kpis?: GoalKpiApi[];
  status?: string;
  analysis_text?: string | null;
  analysis_generated_at?: string | null;
  achieved?: boolean | null;
  achieved_score?: number | null;
  created_at?: string;
  updated_at?: string;
};

export type GoalListResponse = {
  success?: boolean;
  items?: GoalApi[];
};

export type GoalDetailResponse = {
  success?: boolean;
  goal?: GoalApi;
};

export type GoalSuggestionKpiApi = {
  kpi: string;
  label: string;
};

export type GoalSuggestionApi = {
  id?: string | number;
  title?: string;
  tipo_meta?: string;
  descricao?: string;
  rationale?: string;
  kpis?: GoalSuggestionKpiApi[];
};

export type GoalSuggestionsResponse = {
  success?: boolean;
  platform_name?: string;
  suggestions?: GoalSuggestionApi[];
};

export type GoalCreatePayload = {
  id_customer: number;
  platform_name: string;
  tipo_meta: string;
  title: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  kpis: Array<{
    kpi: string;
    label: string;
    baseline: number | null;
    target: number | null;
    unit: string | null;
  }>;
  status: string;
};

/** PATCH suportado pelo backend em PUT /api/goals/:id_goal */
export type GoalUpdatePayload = Partial<{
  platform_name: string;
  tipo_meta: string;
  title: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  kpis: GoalCreatePayload["kpis"];
  status: string;
}>;

export type GoalGenerateAnalysisResponse = {
  success?: boolean;
  goal?: GoalApi;
  message?: string;
};

export type GoalMutationResponse = {
  success?: boolean;
  goal?: GoalApi;
  message?: string;
};

export type GoalDeleteResponse = {
  success?: boolean;
  message?: string;
};

/** Alias usado em normalização e componentes que leem o JSON bruto. */
export type Goal = GoalApi;
