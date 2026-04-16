import type { AnalysisFormState } from "@/features/analises/types";
import type { AnalyzeStrategicPayload } from "@/lib/types/analyze";

export const DEFAULT_VOICE_PROFILE = "CMO";
export const DEFAULT_DECISION_MODE = "topicos";
export const DEFAULT_NARRATIVE_STYLE = "SCQA";

const ANALYSIS_FOCUS_MAP = {
  branding_communication: "branding",
  business_growth: "negocio",
  integrated: "panorama",
} as const;

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
    client_id: clientId,
    platforms: [...form.platforms],
    analysis_type: form.analysisType,
    analysis_focus: ANALYSIS_FOCUS_MAP[form.strategicFocus],
    start_date: form.dateStart,
    end_date: form.dateEnd,
    analysis_query: form.bias.trim(),
    voice_profile: DEFAULT_VOICE_PROFILE,
    decision_mode: decisionMode,
    narrative_style: DEFAULT_NARRATIVE_STYLE,
  };
}
