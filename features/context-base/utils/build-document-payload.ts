import type { ContextDocumentFormState } from "../types";
import { LEGACY_MAIN_CATEGORY_BY_DOC_TYPE } from "./constants";
import type { DocumentStorePayloadV1 } from "@/lib/types/documents";
/** Contrato legado: tags são valor cru informado no campo principal. */
export function buildDocumentTags(form: ContextDocumentFormState): string {
  return form.tagsRequired.trim();
}

/** Contrato legado: enviar o conteúdo efetivo sem composição artificial. */
export function buildDocumentTextBody(rawContent: string): string {
  return rawContent.trim();
}

export function resolveLegacyUploadType(file: File | null): DocumentStorePayloadV1["uploadType"] {
  if (!file) return "text";
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return "pdf";
  if (name.endsWith(".txt")) return "txt";
  if (name.endsWith(".csv")) return "csv";
  // Fallback legado: backend só aceita text/pdf/txt/csv.
  return "text";
}

export function buildDocumentStorePayloadV1(
  form: ContextDocumentFormState,
  params: {
    agencyId: string;
    clientId: string;
    customerName: string;
    documentText: string;
    uploadType: DocumentStorePayloadV1["uploadType"];
  },
): DocumentStorePayloadV1 {
  return {
    // Regra atual: esta tela opera sempre em escopo cliente.
    documentScope: "client",
    docType: form.contentType,
    confidentiality: form.confidentiality,
    documentAuthor: form.author.trim(),
    documentSetor: form.sector.trim(),
    documentTags: buildDocumentTags(form),
    uploadType: params.uploadType,
    agency_id: params.agencyId,
    documentText: params.documentText,
    client_id: params.clientId,
    customerName: params.customerName,
    mainCategory:
      form.mainCategory.trim() || LEGACY_MAIN_CATEGORY_BY_DOC_TYPE[form.contentType] || "",
    subcategory: form.subcategory.trim() || "",
    // Futuro (não enviar agora no contrato real):
    // internalOwner, sourceOrigin, language, reliabilityLevel, visibility,
    // executiveSummary, competenceStart, competenceEnd, validUntil, isEvergreen,
    // version, replacesAnother, replacesDocumentId, contextRole, allowAnalysis,
    // allowChat, isOfficial, isHistorical, strategicRelevance, iaObjective, priorityUse.
  };
}
