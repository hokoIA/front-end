import { seedDocumentsForClient } from "../mocks/client-documents.seed";
import type { ContextDocumentListItem } from "../types";

/**
 * Stub até existir endpoint real de listagem por cliente.
 * Troque por `httpJson` + `queryKeys.contextBase.documents` quando o backend expuser a rota.
 */
export async function fetchClientDocuments(
  clientId: string,
  customerName: string,
): Promise<ContextDocumentListItem[]> {
  await new Promise((r) => setTimeout(r, 450));
  return seedDocumentsForClient(clientId, customerName);
}
