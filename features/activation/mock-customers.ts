export type MinimumStatus = "pending" | "processing" | "identified" | "manual";

export type MinimumItem = {
  id: string;
  label: string;
  status: MinimumStatus;
  source?: string;
};

export type MaterialItem = {
  id: string;
  title: string;
  kind: "Arquivo" | "Ata" | "Texto";
  status: "Processando" | "Processado" | "Falha";
  covers: string[];
};

export type ConnectionItem = {
  name: "Instagram" | "Meta Ads" | "Google Analytics";
  state: "Conectado" | "Renovar acesso" | "Não conectado";
  detail?: string;
};

export type ActivationMockCustomer = {
  id: string;
  name: string;
  contact: string;
  phone: string;
  situation: string;
  nextAction: string;
  objective: string;
  minimums: MinimumItem[];
  materials: MaterialItem[];
  connections: ConnectionItem[];
  evaluation: "not-ready" | "ready" | "running" | "failed" | "review" | "active";
};

// Dados fictícios e requisitos mínimos ilustrativos. Nenhum ID corresponde à API real.
const labels = [
  { id: "scope", label: "Escopo e direcionamento inicial" },
  { id: "brand", label: "Referências de marca e comunicação" },
  { id: "business", label: "Contexto do negócio" },
] as const;

const ata = (title: string): MaterialItem => ({
  id: "meeting",
  title,
  kind: "Ata",
  status: "Processado",
  covers: [labels[0].label, labels[2].label],
});
const brand = (title: string, status: MaterialItem["status"] = "Processado"): MaterialItem => ({
  id: "brand",
  title,
  kind: "Arquivo",
  status,
  covers: status === "Processado" ? [labels[1].label] : [],
});
const sources = (meetingTitle: string, brandTitle: string) => [meetingTitle, brandTitle, meetingTitle];
function minimums(
  states: [MinimumStatus, MinimumStatus, MinimumStatus],
  sourceTitles: string[],
): MinimumItem[] {
  return labels.map((item, index) => ({
    ...item,
    status: states[index],
    source: states[index] === "identified" || states[index] === "manual" ? sourceTitles[index] : undefined,
  }));
}
const connections = (
  instagram: ConnectionItem["state"],
  meta: ConnectionItem["state"],
  analytics: ConnectionItem["state"],
): ConnectionItem[] => [
  { name: "Instagram", state: instagram },
  { name: "Meta Ads", state: meta },
  { name: "Google Analytics", state: analytics },
];

const completedMinimums = (meeting: string, brandFile: string) =>
  minimums(["identified", "identified", "manual"], sources(meeting, brandFile));

export const ACTIVATION_MOCK_CUSTOMERS: ActivationMockCustomer[] = [
  {
    id: "mock-casa-aurora",
    name: "Casa Aurora",
    contact: "Marina Costa",
    phone: "(00) 00000-0000",
    situation: "Coleta não iniciada",
    nextAction: "Adicionar o primeiro material",
    objective: "",
    minimums: minimums(["pending", "pending", "pending"], []),
    materials: [],
    connections: connections("Não conectado", "Não conectado", "Não conectado"),
    evaluation: "not-ready",
  },
  {
    id: "mock-vale-claro",
    name: "Vale Claro",
    contact: "Rafael Lima",
    phone: "(00) 00000-0000",
    situation: "Coleta em andamento",
    nextAction: "Completar informações mínimas",
    objective: "Revisar o posicionamento da marca e organizar a comunicação digital.",
    minimums: minimums(["identified", "pending", "manual"], sources("Ata de descoberta", "")),
    materials: [ata("Ata de descoberta")],
    connections: connections("Conectado", "Renovar acesso", "Não conectado"),
    evaluation: "not-ready",
  },
  {
    id: "mock-brisa-norte",
    name: "Brisa Norte",
    contact: "Beatriz Rocha",
    phone: "(00) 00000-0000",
    situation: "Material em processamento",
    nextAction: "Aguardar processamento",
    objective: "Compreender os públicos e melhorar a consistência da marca.",
    minimums: minimums(["identified", "processing", "manual"], sources("Ata de alinhamento", "Guia de marca")),
    materials: [ata("Ata de alinhamento"), brand("Guia de marca", "Processando")],
    connections: connections("Conectado", "Não conectado", "Não conectado"),
    evaluation: "not-ready",
  },
  {
    id: "mock-pomar",
    name: "Pomar Criativo",
    contact: "Daniela Souza",
    phone: "(00) 00000-0000",
    situation: "Envio exige revisão",
    nextAction: "Revisar material com falha",
    objective: "Organizar referências e objetivos da comunicação.",
    minimums: minimums(["identified", "pending", "manual"], sources("Ata de briefing", "Manual da marca")),
    materials: [ata("Ata de briefing"), brand("Manual da marca", "Falha")],
    connections: connections("Não conectado", "Não conectado", "Não conectado"),
    evaluation: "not-ready",
  },
  {
    id: "mock-linha-viva",
    name: "Linha Viva",
    contact: "André Martins",
    phone: "(00) 00000-0000",
    situation: "Mínimos cobertos",
    nextAction: "Solicitar avaliação geral",
    objective: "Identificar oportunidades de comunicação para os próximos meses.",
    minimums: completedMinimums("Ata inicial", "Referências visuais"),
    materials: [ata("Ata inicial"), brand("Referências visuais")],
    connections: connections("Conectado", "Não conectado", "Conectado"),
    evaluation: "ready",
  },
  {
    id: "mock-margem",
    name: "Margem Studio",
    contact: "Paula Ribeiro",
    phone: "(00) 00000-0000",
    situation: "Avaliação em andamento",
    nextAction: "Aguardar resultado",
    objective: "Reorganizar a presença digital a partir do contexto da marca.",
    minimums: completedMinimums("Ata de contexto", "Guia de identidade"),
    materials: [ata("Ata de contexto"), brand("Guia de identidade")],
    connections: connections("Conectado", "Conectado", "Não conectado"),
    evaluation: "running",
  },
  {
    id: "mock-pedra-azul",
    name: "Pedra Azul",
    contact: "Luana Ferreira",
    phone: "(00) 00000-0000",
    situation: "Revisão necessária",
    nextAction: "Revisar solicitações da avaliação",
    objective: "Planejar expansão com base em informações comerciais e de marca.",
    minimums: completedMinimums("Ata de planejamento", "Referências de marca"),
    materials: [ata("Ata de planejamento"), brand("Referências de marca")],
    connections: connections("Conectado", "Renovar acesso", "Não conectado"),
    evaluation: "review",
  },
  {
    id: "mock-vista-leve",
    name: "Vista Leve",
    contact: "Henrique Melo",
    phone: "(00) 00000-0000",
    situation: "Avaliação interrompida",
    nextAction: "Tentar avaliação novamente",
    objective: "Consolidar o contexto comercial e de comunicação.",
    minimums: completedMinimums("Ata comercial", "Guia visual"),
    materials: [ata("Ata comercial"), brand("Guia visual")],
    connections: connections("Conectado", "Não conectado", "Não conectado"),
    evaluation: "failed",
  },
];
