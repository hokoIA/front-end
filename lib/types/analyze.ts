/**
 * Contrato esperado pelo POST {ANALYZE_API}/analyze/
 * Campos adicionais podem ser aceitos pelo backend sem quebrar o front.
 */
export type AnalyzeStrategicPayload = {
  agency_id: string;
  client_id: string;
  platforms: string[];
  analysis_type: string;
  analysis_focus: string;
  start_date: string;
  end_date: string;
  analysis_query: string;
  voice_profile: string;
  decision_mode: string;
  narrative_style: string;
} & Record<string, unknown>;

export type AnalyzeStrategicResponse = {
  result?: string;
} & Record<string, unknown>;

/** Compatível com chamadas genéricas legadas */
export type AnalyzeRequestBody = Record<string, unknown>;

export type AnalyzeResponse = unknown;
