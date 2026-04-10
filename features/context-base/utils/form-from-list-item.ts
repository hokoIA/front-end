import type { ContextDocumentFormState, ContextDocumentListItem } from "../types";
import { createDefaultContextDocumentForm } from "./default-form";

/** Preenche o formulário a partir de um documento (útil para duplicar metadados). */
export function formStateFromListItem(
  item: ContextDocumentListItem,
): ContextDocumentFormState {
  const base = createDefaultContextDocumentForm();
  return {
    ...base,
    scope: item.documentScope,
    contentType: item.docType,
    mainCategory: item.mainCategory,
    subcategory: item.subcategory,
    title: `${item.title} (cópia)`,
    executiveSummary: item.summary,
    author: item.author,
    tagsRequired: item.tags.filter((t) => !t.includes(":")).join(", "),
    version: item.version,
    status: "draft",
    uploadMode: "text",
    textContent: item.contentPreview,
    competenceStart: item.competenceStart,
    competenceEnd: item.competenceEnd,
    validUntil: item.validUntil ?? "",
    isEvergreen: !item.validUntil,
    replacesAnother: Boolean(item.replacesId),
    replacesDocumentId: item.replacesId ?? "",
    confidentiality: item.confidentiality,
  };
}
