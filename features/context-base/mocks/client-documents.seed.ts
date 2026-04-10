import type { ContextDocumentListItem } from "../types";

/** Modelo de linhas — instanciado por cliente em `seedDocumentsForClient`. */
const ROWS: Omit<
  ContextDocumentListItem,
  "id" | "client_id" | "customerName"
>[] = [
  {
    title: "Diretrizes de voz e tom 2025",
    docType: "brand_identity",
    mainCategory: "Marca & criativo",
    subcategory: "Identidade verbal",
    author: "Estratégia Hoko",
    submittedAt: "2025-11-12T14:30:00.000Z",
    competenceStart: "2025-01-01",
    competenceEnd: "2025-12-31",
    validUntil: "2026-06-30",
    status: "active",
    tags: ["marca", "tom_de_voz", "oficial:sim", "uso_ia:analises"],
    origin: "Workshop com cliente",
    version: "2.1",
    updatedAt: "2025-11-18T10:00:00.000Z",
    summary:
      "Define princípios de comunicação, vocabulário preferido e o que evitar em peças e respostas da IA.",
    contentPreview:
      "## Princípios\n1. Clareza antes de criatividade...\n## Evitar\n- Jargões vazios...",
    uploadType: "text",
    confidentiality: "internal",
    documentScope: "client",
  },
  {
    title: "Briefing Q4 — campanha de consideração",
    docType: "briefing",
    mainCategory: "Estratégia",
    subcategory: "Campanha",
    author: "Account Lead",
    submittedAt: "2025-10-02T09:15:00.000Z",
    competenceStart: "2025-10-01",
    competenceEnd: "2025-12-15",
    validUntil: "2025-12-31",
    status: "in_review",
    tags: ["briefing", "q4", "mid_funnel", "papel_contexto:primary"],
    origin: "Cliente — versão revisada",
    version: "0.9",
    updatedAt: "2025-10-28T16:20:00.000Z",
    summary:
      "Público-alvo, oferta, mensagens-chave, provas e restrições legais para uso em análises do período.",
    contentPreview:
      "### Objetivo\nAumentar consideração...\n### Provas\nDepoimentos, dados de uso...",
    uploadType: "file",
    fileName: "briefing-q4-rev3.pdf",
    confidentiality: "restricted",
    documentScope: "client",
  },
  {
    title: "Relatório de performance — modelo legado",
    docType: "performance_report",
    mainCategory: "Dados & relatórios",
    subcategory: "Performance",
    author: "Mídia",
    submittedAt: "2024-03-20T11:00:00.000Z",
    competenceStart: "2023-01-01",
    competenceEnd: "2023-12-31",
    validUntil: "2024-01-31",
    status: "expired",
    tags: ["legado", "historico:sim", "uso_ia:analises"],
    origin: "Export Meta + GA",
    version: "1.0",
    updatedAt: "2024-03-20T11:00:00.000Z",
    summary:
      "Consolidado anual antigo; mantido apenas como referência histórica para comparações longas.",
    contentPreview: "Métricas anuais 2023 — não usar como fonte primária.",
    uploadType: "file",
    fileName: "relatorio-2023.pdf",
    confidentiality: "internal",
    documentScope: "client",
    replacesId: undefined,
  },
];

export function seedDocumentsForClient(
  clientId: string,
  customerName: string,
): ContextDocumentListItem[] {
  return ROWS.map((row, i) => ({
    ...row,
    id: `mock-${clientId}-${i + 1}`,
    client_id: clientId,
    customerName,
  }));
}
