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

type UserLike = {
  id?: string;
  agency_id?: string;
  id_account?: string;
};
/**
 * Contrato atual do analyze em produção usa `agency_id` atrelado ao usuário autenticado.
 * Se migrar para `id_account`, ajuste aqui no adapter (não na view).
 */
export function resolveAgencyId(
  authUser: UserLike | null,
  profileUser: UserLike | null,
): string {
  if (authUser?.id) return authUser.id;
  if (profileUser?.id) return profileUser.id;
  return process.env.NEXT_PUBLIC_DEFAULT_AGENCY_ID?.trim() ?? "";
}
