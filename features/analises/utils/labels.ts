import type {
  AnalysisPlatformValue,
  AnalysisTypeValue,
  StrategicFocusValue,
} from "@/features/analises/types";

export const STRATEGIC_FOCUS_LABELS: Record<StrategicFocusValue, string> = {
  branding_communication: "Branding & Comunicação",
  business_growth: "Negócios & Crescimento",
  integrated: "Visão integrada",
};

export const ANALYSIS_TYPE_LABELS: Record<AnalysisTypeValue, string> = {
  descriptive: "Descritiva",
  predictive: "Preditiva",
  prescriptive: "Prescritiva",
  general: "Geral",
};

export const PLATFORM_LABELS: Record<AnalysisPlatformValue, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  google_analytics: "Google Analytics / GA4",
  linkedin: "LinkedIn",
  youtube: "YouTube",
};
