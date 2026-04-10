/** Valores enviados ao backend (inglês/snake estável) */
export type StrategicFocusValue =
  | "branding_communication"
  | "business_growth"
  | "integrated";

export type AnalysisTypeValue =
  | "descriptive"
  | "predictive"
  | "prescriptive"
  | "general";

export type AnalysisPlatformValue =
  | "facebook"
  | "instagram"
  | "google_analytics"
  | "linkedin"
  | "youtube";

export type AnalysisFormState = {
  dateStart: string;
  dateEnd: string;
  strategicFocus: StrategicFocusValue;
  analysisType: AnalysisTypeValue;
  platforms: AnalysisPlatformValue[];
  bias: string;
};

export type AnalysisResultMeta = {
  customerName: string;
  clientId: string;
  dateStart: string;
  dateEnd: string;
  strategicFocus: StrategicFocusValue;
  analysisType: AnalysisTypeValue;
  platforms: AnalysisPlatformValue[];
  generatedAt: string;
  /** Direcionamento opcional informado na configuração */
  bias?: string;
};
