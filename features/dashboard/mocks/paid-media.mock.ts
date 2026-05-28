export type PaidMediaMetricKey =
  | "investment"
  | "impressions"
  | "reach"
  | "frequency"
  | "cpm"
  | "objective"
  | "conversationsStarted"
  | "roas"
  | "costPerLead"
  | "ctr"
  | "conversions"
  | "costPerConversion"
  | "leads"
  | "cpc";

export type PaidMediaLevelKey = "campaign" | "adSet" | "ad";

export type PaidMediaPlatformKey = "meta" | "google" | "linkedin";

export type PaidMediaRow = {
  id: string;
  name: string;
  values: Partial<Record<PaidMediaMetricKey, number | string>>;
};

export type PaidMediaLevel = {
  key: PaidMediaLevelKey;
  label: string;
  rows: PaidMediaRow[];
};

export type PaidMediaPlatformMock = {
  key: PaidMediaPlatformKey;
  label: string;
  shortLabel: string;
  primaryActionLabel: string;
  levels: PaidMediaLevel[];
};

export const paidMediaMock: PaidMediaPlatformMock[] = [
  {
    key: "meta",
    label: "Meta Ads",
    shortLabel: "Meta",
    primaryActionLabel: "Conversas",
    levels: [
      {
        key: "campaign",
        label: "Campanhas",
        rows: [
          {
            id: "meta-cp-1",
            name: "Capta\u00e7\u00e3o WhatsApp | Maio",
            values: {
              investment: 18420,
              impressions: 612400,
              reach: 248900,
              frequency: 2.46,
              cpm: 30.08,
              objective: "Mensagens",
              conversationsStarted: 934,
              roas: 4.8,
              costPerLead: 19.72,
            },
          },
          {
            id: "meta-cp-2",
            name: "Remarketing | Prova social",
            values: {
              investment: 7250,
              impressions: 198300,
              reach: 84400,
              frequency: 2.35,
              cpm: 36.56,
              objective: "Convers\u00f5es",
              conversationsStarted: 286,
              roas: 6.1,
              costPerLead: 25.35,
            },
          },
          {
            id: "meta-cp-3",
            name: "Topo de funil | Reels",
            values: {
              investment: 9360,
              impressions: 411700,
              reach: 231200,
              frequency: 1.78,
              cpm: 22.74,
              objective: "Alcance",
              conversationsStarted: 188,
              roas: 2.9,
              costPerLead: 49.79,
            },
          },
        ],
      },
      {
        key: "adSet",
        label: "Conjuntos",
        rows: [
          {
            id: "meta-as-1",
            name: "Lookalike compradores 2%",
            values: {
              investment: 11980,
              reach: 136500,
              frequency: 2.24,
              cpm: 29.18,
              ctr: 1.84,
            },
          },
          {
            id: "meta-as-2",
            name: "Interesses | Mercado premium",
            values: {
              investment: 8620,
              reach: 104300,
              frequency: 2.06,
              cpm: 34.92,
              ctr: 1.41,
            },
          },
          {
            id: "meta-as-3",
            name: "Retargeting 30 dias",
            values: {
              investment: 4430,
              reach: 31200,
              frequency: 3.14,
              cpm: 45.22,
              ctr: 2.37,
            },
          },
        ],
      },
      {
        key: "ad",
        label: "An\u00fancios",
        rows: [
          {
            id: "meta-ad-1",
            name: "Video curto | Beneficio direto",
            values: {
              impressions: 248900,
              ctr: 2.18,
              cpc: 1.62,
              cpm: 27.81,
              costPerLead: 17.94,
            },
          },
          {
            id: "meta-ad-2",
            name: "Carrossel | Depoimentos",
            values: {
              impressions: 183200,
              ctr: 1.76,
              cpc: 2.08,
              cpm: 36.61,
              costPerLead: 23.88,
            },
          },
          {
            id: "meta-ad-3",
            name: "Imagem | Oferta consultiva",
            values: {
              impressions: 132600,
              ctr: 1.32,
              cpc: 2.46,
              cpm: 32.49,
              costPerLead: 31.16,
            },
          },
        ],
      },
    ],
  },
  {
    key: "google",
    label: "Google Ads",
    shortLabel: "Google",
    primaryActionLabel: "Convers\u00f5es",
    levels: [
      {
        key: "campaign",
        label: "Campanhas",
        rows: [
          {
            id: "google-cp-1",
            name: "Search | Alta intencao",
            values: {
              investment: 13280,
              impressions: 154900,
              reach: 92300,
              frequency: 1.68,
              cpm: 85.73,
              conversions: 412,
              roas: 7.4,
              costPerConversion: 32.23,
            },
          },
          {
            id: "google-cp-2",
            name: "Performance Max | Produtos",
            values: {
              investment: 16640,
              impressions: 498500,
              reach: 287100,
              frequency: 1.74,
              cpm: 33.38,
              conversions: 526,
              roas: 5.9,
              costPerConversion: 31.63,
            },
          },
          {
            id: "google-cp-3",
            name: "Display | Remarketing",
            values: {
              investment: 4880,
              impressions: 612700,
              reach: 326400,
              frequency: 1.88,
              cpm: 7.96,
              conversions: 97,
              roas: 3.8,
              costPerConversion: 50.31,
            },
          },
        ],
      },
      {
        key: "adSet",
        label: "Conjuntos",
        rows: [
          {
            id: "google-as-1",
            name: "Grupo | Marca + concorrentes",
            values: {
              investment: 8120,
              reach: 64400,
              frequency: 1.51,
              cpm: 83.52,
              ctr: 6.22,
            },
          },
          {
            id: "google-as-2",
            name: "Grupo | Termos transacionais",
            values: {
              investment: 5160,
              reach: 27900,
              frequency: 2.06,
              cpm: 89.87,
              ctr: 7.18,
            },
          },
          {
            id: "google-as-3",
            name: "Grupo | Retargeting dinamico",
            values: {
              investment: 4420,
              reach: 241800,
              frequency: 1.92,
              cpm: 9.52,
              ctr: 0.81,
            },
          },
        ],
      },
      {
        key: "ad",
        label: "An\u00fancios",
        rows: [
          {
            id: "google-ad-1",
            name: "RSA | Solucao completa",
            values: {
              impressions: 78600,
              ctr: 7.41,
              cpc: 2.18,
              cpm: 161.56,
              costPerLead: 30.42,
            },
          },
          {
            id: "google-ad-2",
            name: "RSA | Comparativo de valor",
            values: {
              impressions: 64200,
              ctr: 5.96,
              cpc: 2.46,
              cpm: 146.62,
              costPerLead: 35.18,
            },
          },
          {
            id: "google-ad-3",
            name: "Display | Ultima visita",
            values: {
              impressions: 219400,
              ctr: 0.92,
              cpc: 1.14,
              cpm: 10.49,
              costPerLead: 42.67,
            },
          },
        ],
      },
    ],
  },
  {
    key: "linkedin",
    label: "LinkedIn Ads",
    shortLabel: "LinkedIn",
    primaryActionLabel: "Leads",
    levels: [
      {
        key: "campaign",
        label: "Campanhas",
        rows: [
          {
            id: "linkedin-cp-1",
            name: "Lead Gen | Decisores B2B",
            values: {
              investment: 9580,
              impressions: 88200,
              reach: 64100,
              frequency: 1.38,
              cpm: 108.62,
              objective: "Lead generation",
              leads: 174,
              ctr: 0.93,
              costPerLead: 55.06,
              roas: 3.6,
            },
          },
          {
            id: "linkedin-cp-2",
            name: "Thought leadership | Awareness",
            values: {
              investment: 6240,
              impressions: 121600,
              reach: 77400,
              frequency: 1.57,
              cpm: 51.32,
              objective: "Brand awareness",
              leads: 68,
              ctr: 0.61,
              costPerLead: 91.76,
              roas: 2.1,
            },
          },
          {
            id: "linkedin-cp-3",
            name: "Remarketing | Visitantes site",
            values: {
              investment: 3860,
              impressions: 42900,
              reach: 18800,
              frequency: 2.28,
              cpm: 89.98,
              objective: "Website conversions",
              leads: 92,
              ctr: 1.18,
              costPerLead: 41.96,
              roas: 4.2,
            },
          },
        ],
      },
      {
        key: "adSet",
        label: "Conjuntos",
        rows: [
          {
            id: "linkedin-as-1",
            name: "Cargos | C-level e diretores",
            values: {
              investment: 7820,
              reach: 38400,
              frequency: 1.42,
              cpm: 143.29,
              ctr: 0.88,
            },
          },
          {
            id: "linkedin-as-2",
            name: "Segmento | SaaS e tecnologia",
            values: {
              investment: 4860,
              reach: 42100,
              frequency: 1.64,
              cpm: 70.36,
              ctr: 0.74,
            },
          },
          {
            id: "linkedin-as-3",
            name: "Retargeting | Engajados 90 dias",
            values: {
              investment: 3290,
              reach: 12900,
              frequency: 2.36,
              cpm: 108.08,
              ctr: 1.31,
            },
          },
        ],
      },
      {
        key: "ad",
        label: "An\u00fancios",
        rows: [
          {
            id: "linkedin-ad-1",
            name: "Documento | Checklist executivo",
            values: {
              impressions: 51600,
              ctr: 1.21,
              cpc: 8.94,
              cpm: 108.17,
              costPerLead: 48.63,
            },
          },
          {
            id: "linkedin-ad-2",
            name: "Imagem | Benchmark do setor",
            values: {
              impressions: 38400,
              ctr: 0.82,
              cpc: 11.72,
              cpm: 96.1,
              costPerLead: 68.2,
            },
          },
          {
            id: "linkedin-ad-3",
            name: "Video | Visao do especialista",
            values: {
              impressions: 42100,
              ctr: 0.58,
              cpc: 13.16,
              cpm: 76.91,
              costPerLead: 84.42,
            },
          },
        ],
      },
    ],
  },
];
