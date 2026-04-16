/**
 * Contrato REAL legado em produção para POST /documents/store.
 * IMPORTANTE: não adicionar campos extras no payload atual.
 */
export type DocumentStorePayloadV1 = {
  documentScope: "client";
  docType: string;
  confidentiality: string;
  documentAuthor: string;
  documentSetor: string;
  documentTags: string;
  uploadType: "text" | "pdf" | "txt" | "csv";
  agency_id: string;
  documentText: string;
  client_id: string;
  customerName: string;
  mainCategory: string;
  subcategory: string;
};

export type DocumentStoreBody = DocumentStorePayloadV1;

export type DocumentStoreResponse = unknown;

export type DocumentListPayload = {
  agency_id: string;
  scope: "client";
  limit: number;
  client_id: string;
  doc_type?: string;
};

export type DocumentListItemLegacy = {
  vector_id?: string;
  id?: string;
  title?: string;
  docType?: string;
  doc_type?: string;
  mainCategory?: string;
  main_category?: string;
  subcategory?: string;
  sub_category?: string;
  documentAuthor?: string;
  document_author?: string;
  documentTags?: string;
  document_tags?: string;
  confidentiality?: string;
  documentScope?: string;
  document_scope?: string;
  uploadType?: "text" | "file";
  upload_type?: "text" | "file";
  customerName?: string;
  customer_name?: string;
  client_id?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  documentText?: string;
  document_text?: string;
} & Record<string, unknown>;

export type DocumentListResponse =
  | DocumentListItemLegacy[]
  | {
      documents?: DocumentListItemLegacy[];
      items?: DocumentListItemLegacy[];
      data?: DocumentListItemLegacy[];
    };

export type DocumentDetailsPayload = {
  vector_id: string;
  agency_id: string;
  scope: "client";
  client_id: string;
};

export type DocumentDetailsResponse = DocumentListItemLegacy | { data?: DocumentListItemLegacy };

export type DocumentDeletePayload = {
  vector_id: string;
  agency_id: string;
  scope: "client";
  client_id: string;
};

export type DocumentDeleteBatchPayload = {
  vector_ids: string[];
  agency_id: string;
  scope: "client";
  client_id: string;
};

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
