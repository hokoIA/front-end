/**
 * POST /documents/store — campos suportados pelo backend atual.
 * Campos adicionais podem ser mesclados via `Record` sem quebrar o contrato.
 */
export type DocumentStorePayloadV1 = {
  documentScope: string;
  docType: string;
  confidentiality: string;
  documentAuthor: string;
  documentSetor: string;
  documentTags: string;
  uploadType: string;
  agency_id: string;
  documentText: string;
  client_id: string;
  customerName: string;
  mainCategory: string;
  subcategory: string;
};

export type DocumentStoreBody = DocumentStorePayloadV1 & Record<string, unknown>;

export type DocumentStoreResponse = unknown;

/** Metadados estendidos na UI — preparação para API futura (não enviados hoje). */
export type ContextDocumentExtendedMetaV0 = {
  internalOwner?: string;
  sourceOrigin?: string;
  language?: string;
  reliabilityLevel?: string;
  visibility?: string;
  executiveSummary?: string;
  competenceStart?: string;
  competenceEnd?: string;
  validUntil?: string | null;
  isEvergreen?: boolean;
  version?: string;
  replacesAnother?: boolean;
  replacesDocumentId?: string;
  contextRole?: string;
  allowAnalysis?: boolean;
  allowChat?: boolean;
  isOfficial?: boolean;
  isHistorical?: boolean;
  strategicRelevance?: string;
  iaObjective?: string;
  priorityUse?: string;
};
