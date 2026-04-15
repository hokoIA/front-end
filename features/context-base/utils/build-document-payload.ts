import type { ContextDocumentFormState } from "../types";
import type { DocumentStorePayloadV1 } from "@/lib/types/documents";
/** Contrato legado: tags são valor cru informado no campo principal. */
export function buildDocumentTags(form: ContextDocumentFormState): string {
  return form.tagsRequired.trim();
}

/** Contrato legado: enviar o conteúdo efetivo sem composição artificial. */
export function buildDocumentTextBody(rawContent: string): string {
  return rawContent.trim();
}

export function buildDocumentStorePayloadV1(
  form: ContextDocumentFormState,
  params: {
    agencyId: string;
    clientId: string;
    customerName: string;
    documentText: string;
    uploadType: "text" | "file";
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
    mainCategory: form.mainCategory.trim() || "geral",
    subcategory: form.subcategory.trim() || "nao_classificado",
    // Futuro (não enviar agora no contrato real):
    // internalOwner, sourceOrigin, language, reliabilityLevel, visibility,
    // executiveSummary, competenceStart, competenceEnd, validUntil, isEvergreen,
    // version, replacesAnother, replacesDocumentId, contextRole, allowAnalysis,
    // allowChat, isOfficial, isHistorical, strategicRelevance, iaObjective, priorityUse.
  };
}

type UserLike = {
  id?: string;
  agency_id?: string;
  id_account?: string;
};
export function resolveAgencyIdForContext(
  authUser: UserLike | null,
  profileUser: UserLike | null,
): string {
  if (authUser?.agency_id) return authUser.agency_id;
  if (authUser?.id_account) return authUser.id_account;
  if (authUser?.id) return authUser.id;
  if (profileUser?.agency_id) return profileUser.agency_id;
  if (profileUser?.id_account) return profileUser.id_account;
  if (profileUser?.id) return profileUser.id;
  return process.env.NEXT_PUBLIC_DEFAULT_AGENCY_ID?.trim() ?? "";
}
