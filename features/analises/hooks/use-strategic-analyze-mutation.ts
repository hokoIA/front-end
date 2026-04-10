import { postAnalyze } from "@/lib/api/analyses";
import { mockStrategicAnalyzeResponse } from "@/features/analises/mocks/strategic-sample";
import type {
  AnalyzeResponse,
  AnalyzeStrategicPayload,
} from "@/lib/types/analyze";
import { useMutation } from "@tanstack/react-query";

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

export function useStrategicAnalyzeMutation() {
  return useMutation({
    mutationFn: async (
      body: AnalyzeStrategicPayload,
    ): Promise<AnalyzeResponse> => {
      if (process.env.NEXT_PUBLIC_ANALYZE_USE_MOCK === "true") {
        await delay(1800);
        return mockStrategicAnalyzeResponse();
      }
      return postAnalyze(body);
    },
  });
}
