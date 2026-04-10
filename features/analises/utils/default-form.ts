import type { AnalysisFormState } from "@/features/analises/types";

export function createDefaultAnalysisForm(): AnalysisFormState {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  return {
    dateStart: start.toISOString().slice(0, 10),
    dateEnd: end.toISOString().slice(0, 10),
    strategicFocus: "integrated",
    analysisType: "general",
    platforms: [
      "facebook",
      "instagram",
      "google_analytics",
      "linkedin",
      "youtube",
    ],
    bias: "",
  };
}
