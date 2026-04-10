import type {
  AnalyzeRequestBody,
  AnalyzeResponse,
  AnalyzeStrategicPayload,
} from "@/lib/types/analyze";
import { endpoints } from "./endpoints";
import { httpJson } from "./http-client";

export async function postAnalyze(
  body: AnalyzeStrategicPayload | AnalyzeRequestBody,
): Promise<AnalyzeResponse> {
  return httpJson<AnalyzeResponse>(endpoints.analyze.analyze(), {
    method: "POST",
    base: "analyze",
    json: body,
  });
}
