import type { ContextDocumentFormState } from "../types";

export function createDefaultContextDocumentForm(): ContextDocumentFormState {
  const today = new Date().toISOString().slice(0, 10);
  return {
    scope: "client",
    contentType: "estrategia",
    mainCategory: "",
    subcategory: "",
    sector: "",
    title: "",
    executiveSummary: "",
    author: "",
    internalOwner: "",
    sourceOrigin: "",
    language: "pt-BR",
    reliabilityLevel: "medium",
    confidentiality: "media",
    visibility: "agency_only",
    tagsRequired: "",
    additionalKeywords: "",
    citedEntities: "",
    relatedPlatforms: "",
    iaObjective: "",
    documentCreatedAt: today,
    competenceStart: today,
    competenceEnd: today,
    validUntil: "",
    isEvergreen: false,
    status: "active",
    replacesAnother: false,
    replacesDocumentId: "",
    version: "1.0",
    priorityUse: "normal",
    contextRole: "complementary",
    allowAnalysis: true,
    allowChat: true,
    isOfficial: false,
    isHistorical: false,
    strategicRelevance: "",
    // Campos abaixo seguem apenas para preparação futura de governança.
    // O payload legado atual envia somente os 13 campos oficiais.
    uploadMode: "text",
    textContent: "",
  };
}
