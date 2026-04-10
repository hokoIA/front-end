import { postAnalyze } from "@/lib/api/analyses";
import { postDocumentStore } from "@/lib/api/context-base";
import type {
  AnalyzeRequestBody,
  AnalyzeStrategicPayload,
} from "@/lib/types/analyze";
import type { DocumentStoreBody } from "@/lib/types/documents";
import { useMutation } from "@tanstack/react-query";

export function useAnalyzeMutation() {
  return useMutation({
    mutationFn: (body: AnalyzeStrategicPayload | AnalyzeRequestBody) =>
      postAnalyze(body),
  });
}

export function useDocumentStoreMutation() {
  return useMutation({
    mutationFn: (body: DocumentStoreBody) => postDocumentStore(body),
  });
}
