import type { ContextDocumentListItem } from "../types";
import { postDocumentsList } from "@/lib/api/context-base";
import type {
  DocumentListItemLegacy,
  DocumentListPayload,
  DocumentListResponse,
} from "@/lib/types/documents";

function splitTags(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/[,;\n]+/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function pickList(resp: DocumentListResponse): DocumentListItemLegacy[] {
  if (Array.isArray(resp)) return resp;
  if (Array.isArray(resp.documents)) return resp.documents;
  if (Array.isArray(resp.items)) return resp.items;
  if (Array.isArray(resp.data)) return resp.data;
  return [];
}

function toListItem(
  raw: DocumentListItemLegacy,
  fallback: { clientId: string; customerName: string; index: number },
): ContextDocumentListItem {
  const id =
    String(raw.vector_id ?? raw.id ?? `${fallback.clientId}-${fallback.index + 1}`);
  const docType = String(raw.docType ?? raw.doc_type ?? "estrategia");
  const text = String(raw.documentText ?? raw.document_text ?? "");
  const preview = text.slice(0, 500);
  const created = String(raw.createdAt ?? raw.created_at ?? new Date().toISOString());
  const updated = String(raw.updatedAt ?? raw.updated_at ?? created);

  return {
    id,
    client_id: String(raw.client_id ?? fallback.clientId),
    customerName: String(raw.customerName ?? raw.customer_name ?? fallback.customerName),
    title: String(raw.title ?? `Documento ${fallback.index + 1}`),
    docType: docType as ContextDocumentListItem["docType"],
    mainCategory: String(raw.mainCategory ?? raw.main_category ?? "geral"),
    subcategory: String(raw.subcategory ?? raw.sub_category ?? "nao_classificado"),
    author: String(raw.documentAuthor ?? raw.document_author ?? "Não informado"),
    submittedAt: created,
    competenceStart: created.slice(0, 10),
    competenceEnd: created.slice(0, 10),
    validUntil: null,
    status: "active",
    tags: splitTags(String(raw.documentTags ?? raw.document_tags ?? "")),
    origin: "Legado",
    version: "1.0",
    updatedAt: updated,
    summary: preview || "Documento legado carregado do serviço de contexto.",
    contentPreview: preview || "Sem prévia de conteúdo disponível.",
    uploadType: (raw.uploadType ?? raw.upload_type ?? "text") as "text" | "file",
    confidentiality: String(raw.confidentiality ?? "internal"),
    documentScope: "client",
  };
}

export async function fetchClientDocuments(
  params: DocumentListPayload & { customerName: string },
): Promise<ContextDocumentListItem[]> {
  const response = await postDocumentsList(params);
  console.log("🚀 fetchClientDocuments ~ response:", response)
  return pickList(response).map((item, index) =>
    toListItem(item, {
      clientId: params.client_id,
      customerName: params.customerName,
      index,
    }),
  );
}
