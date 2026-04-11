import type { GoalSuggestion } from "./suggestions";

/** Sugestões fictícias para desenvolvimento / fallback tipado. */
export const MOCK_GOAL_SUGGESTIONS: GoalSuggestion[] = [
  {
    id: "mock-s1",
    title: "Consistência de publicação orgânica (Meta)",
    strategicObjective:
      "Estabelecer ritmo mínimo de conteúdo para sustentar alcance e consideração.",
    platform: "facebook",
    rationaleTiming:
      "Documentos indicam queda de frequência; reforço orgânico reduz dependência de mídia paga.",
    suggestedKpis: ["Posts / semana", "Alcance orgânico", "Engajamento por post"],
    horizonLabel: "90 dias",
    priority: "high",
    description:
      "Planejar calendário editorial alinhado à voz da marca e aos pilares do contexto.",
    smart:
      "Publicar no mínimo 3 reels e 2 carrosséis por semana, medidos no Meta Business Suite.",
  },
  {
    id: "mock-s2",
    title: "Tráfego qualificado via GA4",
    strategicObjective:
      "Direcionar investimento e conteúdo para sessões com maior intenção.",
    platform: "google_analytics",
    rationaleTiming:
      "Base vetorial cita objetivo de leads; funil atual não discrimina canais de valor.",
    suggestedKpis: [
      "Sessões qualificadas",
      "Taxa de conversão assistida",
      "Tempo médio na página-alvo",
    ],
    horizonLabel: "60 dias",
    priority: "critical",
  },
  {
    id: "mock-s3",
    title: "YouTube: retenção nos primeiros 30s",
    strategicObjective: "Melhorar hook dos vídeos longos para sustentar watch time.",
    platform: "youtube",
    rationaleTiming:
      "Análises anteriores mostram queda brusca após o primeiro quartil.",
    suggestedKpis: ["Retenção a 30s", "Watch time médio", "CTR de thumbnail"],
    horizonLabel: "45 dias",
    priority: "medium",
  },
  {
    id: "mock-s4",
    title: "LinkedIn: autoridade para B2B",
    strategicObjective:
      "Posicionar thought leadership para apoiar ciclo comercial mais longo.",
    platform: "linkedin",
    rationaleTiming:
      "Cliente em expansão B2B; documentos enfatizam credibilidade antes de demo.",
    suggestedKpis: ["Impressões", "Cliques no link da bio", "Leads inbound"],
    horizonLabel: "120 dias",
    priority: "medium",
  },
  {
    id: "mock-s5",
    title: "Instagram: conversão via stories",
    strategicObjective:
      "Transformar engajamento leve em cliques para landing e formulários.",
    platform: "instagram",
    rationaleTiming:
      "Campanhas atuais geram alcance mas poucos cliques; stories têm melhor CTA histórico.",
    suggestedKpis: ["Cliques em link", "Respostas a enquetes", "DMs iniciadas"],
    horizonLabel: "30 dias",
    priority: "high",
  },
];
