import type { AnalysisFormState } from "@/features/analises/types";
import type { AnalyzeStrategicPayload } from "@/lib/types/analyze";

export const DEFAULT_VOICE_PROFILE = "CMO";
export const DEFAULT_DECISION_MODE = "topicos";
export const DEFAULT_NARRATIVE_STYLE = "SCQA";

const MARKDOWN_REPORT_FORMAT = [
  "Formato obrigatório da resposta:",
  "- Retorne somente Markdown GFM, sem bloco de código envolvendo a resposta.",
  "- Estruture a análise como um relatório executivo pronto para exibição e exportação em PDF.",
  "- Use título, subtítulo curto, resumo executivo, seções com hierarquia, listas e tabelas quando ajudarem a leitura.",
  "- Não entregue texto corrido cru: a organização visual deve nascer nesta resposta em Markdown.",
  "- Adapte a estrutura ao tipo de análise e aos dados disponíveis; não preencha seções sem evidência.",
  "- Para análise prescritiva, priorize recomendações acionáveis e inclua, quando fizer sentido: o que fazer, evidência, impacto esperado, responsável sugerido, prazo e como medir.",
].join("\n");

const ANALYSIS_FOCUS_MAP = {
  branding_communication: "branding",
  business_growth: "negocio",
  integrated: "panorama",
} as const;

function buildAnalysisQuery(form: AnalysisFormState): string {
  const userQuery = form.bias.trim();
  if (!userQuery) return MARKDOWN_REPORT_FORMAT;

  return [
    "Direcionamento do usuário:",
    userQuery,
    "",
    MARKDOWN_REPORT_FORMAT,
  ].join("\n");
}

export function buildStrategicAnalyzePayload(
  form: AnalysisFormState,
  agencyId: string,
  clientId: string,
): AnalyzeStrategicPayload {
  const decisionMode =
    form.analysisType === "descriptive"
      ? "topicos"
      : DEFAULT_DECISION_MODE;

  return {
    agency_id: agencyId,
    id_customer: clientId,
    client_id: clientId,
    platforms: [...form.platforms],
    analysis_type: form.analysisType,
    analysis_focus: ANALYSIS_FOCUS_MAP[form.strategicFocus],
    start_date: form.dateStart,
    end_date: form.dateEnd,
    analysis_query: buildAnalysisQuery(form),
    voice_profile: DEFAULT_VOICE_PROFILE,
    decision_mode: decisionMode,
    narrative_style: DEFAULT_NARRATIVE_STYLE,
    output_format: "markdown",
    response_format: "markdown",
    formatting_instructions: MARKDOWN_REPORT_FORMAT,
    user_analysis_query: form.bias.trim(),
  };
}
