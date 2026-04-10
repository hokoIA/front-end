import type { ContentTypeValue, GovernanceStatusValue } from "../types";

export const CONTENT_TYPE_OPTIONS: { value: ContentTypeValue; label: string }[] =
  [
    { value: "brand_identity", label: "Identidade de marca" },
    { value: "positioning", label: "Posicionamento" },
    { value: "briefing", label: "Briefing" },
    { value: "strategic_plan", label: "Planejamento estratégico" },
    { value: "communication_plan", label: "Plano de comunicação" },
    { value: "editorial_calendar", label: "Calendário editorial" },
    { value: "campaign", label: "Campanha" },
    { value: "performance_report", label: "Relatório de desempenho" },
    { value: "financial", label: "DRE / financeiro" },
    { value: "product_service", label: "Produto ou serviço" },
    { value: "persona_audience", label: "Persona / público-alvo" },
    { value: "competition_market", label: "Concorrência / mercado" },
    { value: "institutional", label: "Institucional" },
    { value: "commercial_sales", label: "Comercial / vendas" },
    { value: "operations_process", label: "Operação / processo" },
    { value: "customer_support", label: "Atendimento / suporte" },
    { value: "compliance_legal", label: "Compliance / jurídico" },
    { value: "manual_policy", label: "Manual / diretriz" },
    { value: "research_diagnostic", label: "Pesquisa / diagnóstico" },
    { value: "case_portfolio", label: "Case / portfólio" },
    { value: "other", label: "Outro" },
  ];

export const SCOPE_OPTIONS: {
  value: "client" | "agency" | "global";
  label: string;
  hint: string;
}[] = [
  {
    value: "client",
    label: "Cliente",
    hint: "Contexto específico do cliente selecionado",
  },
  {
    value: "agency",
    label: "Agência",
    hint: "Conhecimento reutilizável da agência",
  },
  {
    value: "global",
    label: "Global",
    hint: "Referências amplas da plataforma (uso restrito)",
  },
];

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
