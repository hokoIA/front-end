import type { AnalysisFormState } from "@/features/analises/types";
import type { AnalyzeStrategicPayload } from "@/lib/types/analyze";

/** Ajuste se o backend usar outros identificadores de voz / modo. */
export const DEFAULT_VOICE_PROFILE = "professional_agency_pt_b2b";
export const DEFAULT_DECISION_MODE = "strategic_executive_alignment";
export const DEFAULT_NARRATIVE_STYLE = "executive_markdown_report_pt";

export function buildStrategicAnalyzePayload(
  form: AnalysisFormState,
  agencyId: string,
  clientId: string,
): AnalyzeStrategicPayload {
  return {
    agency_id: agencyId,
    client_id: clientId,
    platforms: [...form.platforms],
    analysis_type: form.analysisType,
    analysis_focus: form.strategicFocus,
    start_date: form.dateStart,
    end_date: form.dateEnd,
    analysis_query: form.bias.trim(),
    voice_profile: DEFAULT_VOICE_PROFILE,
    decision_mode: DEFAULT_DECISION_MODE,
    narrative_style: DEFAULT_NARRATIVE_STYLE,
  };
}

export function resolveAgencyId(profile: {
  agency_id?: string;
  id: string;
} | null): string {
  if (!profile) return "";
  return (
    profile.agency_id ??
    process.env.NEXT_PUBLIC_DEFAULT_AGENCY_ID ??
    profile.id
  );
}
