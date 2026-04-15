import type {
  DocumentDeleteBatchPayload,
  DocumentDeletePayload,
  DocumentDetailsPayload,
  DocumentDetailsResponse,
  DocumentListPayload,
  DocumentListResponse,
  DocumentStoreBody,
  DocumentStoreResponse,
} from "@/lib/types/documents";
import { endpoints } from "./endpoints";
import { httpJson } from "./http-client";

export async function postDocumentStore(
  body: DocumentStoreBody,
): Promise<DocumentStoreResponse> {
  return httpJson<DocumentStoreResponse>(endpoints.documents.store(), {
    method: "POST",
    base: "analyze",
    json: body,
  });
}

export async function postDocumentsList(
  body: DocumentListPayload,
): Promise<DocumentListResponse> {
  return httpJson<DocumentListResponse>(endpoints.documents.list(), {
    method: "POST",
    base: "analyze",
    json: body,
  });
}

export async function postDocumentsDetails(
  body: DocumentDetailsPayload,
): Promise<DocumentDetailsResponse> {
  return httpJson<DocumentDetailsResponse>(endpoints.documents.details(), {
    method: "POST",
    base: "analyze",
    json: body,
  });
}

export async function deleteDocument(body: DocumentDeletePayload): Promise<unknown> {
  return httpJson<unknown>(endpoints.documents.delete(), {
    method: "DELETE",
    base: "analyze",
    json: body,
  });
}

export async function deleteDocumentsBatch(
  body: DocumentDeleteBatchPayload,
): Promise<unknown> {
  return httpJson<unknown>(endpoints.documents.deleteBatch(), {
    method: "DELETE",
    base: "analyze",
    json: body,
  });
}
