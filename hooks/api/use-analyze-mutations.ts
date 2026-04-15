import { postAnalyze } from "@/lib/api/analyses";
import {
  deleteDocument,
  deleteDocumentsBatch,
  postDocumentStore,
  postDocumentsDetails,
} from "@/lib/api/context-base";
import type {
  AnalyzeRequestBody,
  AnalyzeStrategicPayload,
} from "@/lib/types/analyze";
import type {
  DocumentDeleteBatchPayload,
  DocumentDeletePayload,
  DocumentDetailsPayload,
  DocumentStoreBody,
} from "@/lib/types/documents";
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

export function useDocumentDetailsMutation() {
  return useMutation({
    mutationFn: (body: DocumentDetailsPayload) => postDocumentsDetails(body),
  });
}

export function useDocumentDeleteMutation() {
  return useMutation({
    mutationFn: (body: DocumentDeletePayload) => deleteDocument(body),
  });
}

export function useDocumentDeleteBatchMutation() {
  return useMutation({
    mutationFn: (body: DocumentDeleteBatchPayload) => deleteDocumentsBatch(body),
  });
}
