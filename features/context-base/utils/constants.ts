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
  { value: "baixa", label: "Baixa" },
  { value: "media", label: "Média" },
  { value: "alta", label: "Alta" },
] as const;

export const LEGACY_MAIN_CATEGORY_BY_DOC_TYPE = {
  identidade:
    "Informações sobre missão, valores, história e como a marca se posiciona no mercado.",
  estrategia:
    "Metas da empresa, público-alvo, KPIs e análises estratégicas como SWOT e benchmarking.",
  comunicacao:
    "Diretrizes de tom de voz, mensagens, canais, campanhas e estratégia de conteúdo.",
  performance:
    "Métricas, funil de vendas, comportamento do cliente e comparativos de mercado.",
  produtos:
    "Portfólio, precificação e estratégias de desenvolvimento de produtos e serviços.",
  vendas: "Processos de vendas, metas comerciais e planos de crescimento.",
  operacao:
    "Processos internos, ferramentas, automações e estrutura operacional.",
  suporte:
    "Manuais, fluxos, procedimentos e materiais técnicos da empresa.",
  cases: "Exemplos práticos, resultados anteriores e estudos de mercado.",
} as const;

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
