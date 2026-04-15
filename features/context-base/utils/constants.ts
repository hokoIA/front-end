import type { ContentTypeValue, GovernanceStatusValue } from "../types";

export const CONTENT_TYPE_OPTIONS: { value: ContentTypeValue; label: string }[] =
  [
    { value: "identidade", label: "Identidade" },
    { value: "estrategia", label: "Estratégia" },
    { value: "comunicacao", label: "Comunicação" },
    { value: "performance", label: "Performance" },
    { value: "produtos", label: "Produtos" },
    { value: "vendas", label: "Vendas" },
    { value: "operacao", label: "Operação" },
    { value: "suporte", label: "Suporte" },
    { value: "cases", label: "Cases" },
  ];

// Futuro: recuperar escopos variáveis quando backend legado deixar de ser fixo em "client".
// export const SCOPE_OPTIONS = [...]

export const STATUS_OPTIONS: { value: GovernanceStatusValue; label: string }[] =
  [
    { value: "active", label: "Ativo" },
    { value: "in_review", label: "Em revisão" },
    { value: "draft", label: "Rascunho" },
    { value: "archived", label: "Arquivado" },
    { value: "expired", label: "Vencido" },
    { value: "superseded", label: "Substituído" },
  ];

export const CONFIDENTIALITY_OPTIONS = [
  { value: "public", label: "Público interno" },
  { value: "internal", label: "Interno agência" },
  { value: "restricted", label: "Restrito" },
  { value: "confidential", label: "Confidencial" },
] as const;

export const RELIABILITY_OPTIONS = [
  { value: "high", label: "Alta — fonte oficial" },
  { value: "medium", label: "Média — validado parcialmente" },
  { value: "low", label: "Baixa — referência exploratória" },
] as const;

export const VISIBILITY_OPTIONS = [
  { value: "agency_only", label: "Somente agência" },
  { value: "project_team", label: "Time do projeto" },
  { value: "client_facing", label: "Pode sustentar entrega ao cliente" },
] as const;

export const PRIORITY_OPTIONS = [
  { value: "critical", label: "Crítica" },
  { value: "high", label: "Alta" },
  { value: "normal", label: "Normal" },
  { value: "low", label: "Baixa" },
] as const;

export const LANGUAGE_OPTIONS = [
  { value: "pt-BR", label: "Português (BR)" },
  { value: "en", label: "Inglês" },
  { value: "es", label: "Espanhol" },
  { value: "other", label: "Outro" },
] as const;

export const MAIN_CATEGORY_PRESETS = [
  "Estratégia",
  "Marca & criativo",
  "Mídia & performance",
  "Conteúdo & social",
  "Dados & relatórios",
  "Operações",
  "Jurídico & compliance",
  "Outro",
] as const;
