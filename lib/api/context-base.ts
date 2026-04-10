import type {
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
