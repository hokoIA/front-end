import type { ContextDocumentFormState } from "../types";
import type { DocumentStorePayloadV1 } from "@/lib/types/documents";

function splitList(raw: string): string[] {
  return raw
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function slugTag(s: string, max = 48): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "_")
    .slice(0, max);
}

/** Monta `documentTags` enriquecido para retrieval, sem alterar o contrato V1 do backend. */
export function buildDocumentTags(form: ContextDocumentFormState): string {
  const parts: string[] = [];
  for (const t of splitList(form.tagsRequired)) parts.push(t);
  for (const t of splitList(form.additionalKeywords)) parts.push(t);
  for (const t of splitList(form.citedEntities)) {
    const e = t.slice(0, 48);
    if (e) parts.push(`entidade:${e}`);
  }
  for (const t of splitList(form.relatedPlatforms))
    parts.push(`plataforma:${slugTag(t, 24)}`);

  if (form.internalOwner.trim())
    parts.push(`responsavel:${slugTag(form.internalOwner, 40)}`);
  if (form.sourceOrigin.trim())
    parts.push(`origem:${slugTag(form.sourceOrigin, 40)}`);
  parts.push(`idioma:${form.language}`);
  parts.push(`confiabilidade:${form.reliabilityLevel}`);
  parts.push(`visibilidade:${form.visibility}`);
  parts.push(`prioridade:${form.priorityUse}`);
  parts.push(`papel_contexto:${form.contextRole}`);
  if (form.allowAnalysis) parts.push("uso_ia:analises");
  if (form.allowChat) parts.push("uso_ia:chat");
  if (form.isOfficial) parts.push("oficial:sim");
  if (form.isHistorical) parts.push("historico:sim");
  if (form.strategicRelevance.trim())
    parts.push(`relevancia:${slugTag(form.strategicRelevance, 40)}`);
  if (form.iaObjective.trim())
    parts.push(`objetivo_ia:${slugTag(form.iaObjective, 48)}`);
  if (form.isEvergreen) parts.push("perene:sim");
  if (form.status) parts.push(`status_envio:${form.status}`);
  if (form.replacesAnother && form.replacesDocumentId.trim())
    parts.push(`substitui:${slugTag(form.replacesDocumentId, 32)}`);
  if (form.version.trim()) parts.push(`versao:${form.version.trim()}`);

  return parts.join(", ");
}

export function buildDocumentTextBody(
  form: ContextDocumentFormState,
  rawContent: string,
): string {
  const parts: string[] = [];
  if (form.title.trim()) {
    parts.push(`# ${form.title.trim()}`);
  }
  if (form.executiveSummary.trim()) {
    parts.push(
      `## Resumo executivo\n\n${form.executiveSummary.trim()}`,
    );
  }
  const metaLines = [
    form.documentCreatedAt && `Data de criação (declarada): ${form.documentCreatedAt}`,
    form.competenceStart &&
      form.competenceEnd &&
      `Competência: ${form.competenceStart} a ${form.competenceEnd}`,
    form.validUntil && !form.isEvergreen && `Válido até: ${form.validUntil}`,
    form.isEvergreen && "Documento declarado como perene",
  ].filter(Boolean);
  if (metaLines.length) {
    parts.push(`## Metadados declarados\n\n${metaLines.join("\n")}`);
  }
  parts.push(`## Conteúdo\n\n${rawContent.trim()}`);
  return parts.join("\n\n---\n\n");
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
    documentScope: form.scope,
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
  };
}

export function resolveAgencyIdForContext(profile: {
  agency_id?: string;
  id: string;
} | null): string {
  if (!profile) return "";
  return (
    profile.agency_id ??
    process.env.NEXT_PUBLIC_DEFAULT_AGENCY_ID ??
    profile.id
  );
}
