/** Escopo fixo do contrato legado nesta tela. */
export type DocumentScopeValue = "client";

export type ContentTypeValue =
  | "identidade"
  | "estrategia"
  | "comunicacao"
  | "performance"
  | "produtos"
  | "vendas"
  | "operacao"
  | "suporte"
  | "cases";

export type GovernanceStatusValue =
  | "active"
  | "in_review"
  | "archived"
  | "expired"
  | "superseded"
  | "draft";

export type ContextRoleValue = "primary" | "complementary" | "historical";

/**
 * Estado completo do formulário na UI.
 * Campos extras permanecem para futura evolução, mas não entram no payload atual.
 */
export type ContextDocumentFormState = {
  scope: DocumentScopeValue;
  contentType: ContentTypeValue;
  mainCategory: string;
  subcategory: string;
  sector: string;
  title: string;
  executiveSummary: string;
  author: string;
  internalOwner: string;
  sourceOrigin: string;
  language: string;
  reliabilityLevel: string;
  confidentiality: string;
  visibility: string;
  tagsRequired: string;
  additionalKeywords: string;
  citedEntities: string;
  relatedPlatforms: string;
  iaObjective: string;
  documentCreatedAt: string;
  competenceStart: string;
  competenceEnd: string;
  validUntil: string;
  isEvergreen: boolean;
  status: GovernanceStatusValue;
  replacesAnother: boolean;
  replacesDocumentId: string;
  version: string;
  priorityUse: string;
  contextRole: ContextRoleValue;
  allowAnalysis: boolean;
  allowChat: boolean;
  isOfficial: boolean;
  isHistorical: boolean;
  strategicRelevance: string;
  uploadMode: "text" | "file";
  textContent: string;
};

export type ContextDocumentListItem = {
  id: string;
  client_id: string;
  customerName: string;
  title: string;
  docType: ContentTypeValue;
  mainCategory: string;
  subcategory: string;
  author: string;
  submittedAt: string;
  competenceStart: string;
  competenceEnd: string;
  validUntil: string | null;
  status: GovernanceStatusValue;
  tags: string[];
  origin: string;
  version: string;
  updatedAt: string;
  summary: string;
  contentPreview: string;
  uploadType: "text" | "file";
  fileName?: string;
  replacesId?: string;
  confidentiality: string;
  documentScope: DocumentScopeValue;
};

export type DocumentListFilters = {
  search: string;
  contentType: ContentTypeValue | "all";
  category: string;
  status: GovernanceStatusValue | "all";
  validity: "all" | "valid" | "expiring" | "expired";
  submittedFrom: string;
  submittedTo: string;
};
