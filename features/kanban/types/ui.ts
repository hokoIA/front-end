/** Modelos de UI desacoplados do contrato bruto da API Kanban. */

export type KanbanColumnUi = {
  id: string;
  name: string;
  color: string;
  order: number;
  raw: Record<string, unknown>;
};

export type KanbanLabelUi = {
  id: string;
  name: string;
  color: string;
  raw: Record<string, unknown>;
};

export type KanbanCardUi = {
  id: string;
  title: string;
  columnId: string;
  week?: string;
  dueDate?: string;
  copyPreview?: string;
  description?: string;
  internalNotes?: string;
  customerId?: string;
  customerName?: string;
  assigneeIds: string[];
  assigneeNames: string[];
  labelIds: string[];
  sortOrder: number;
  updatedAt?: string;
  raw: Record<string, unknown>;
};

export type KanbanTeamMemberUi = {
  id: string;
  name: string;
  email: string;
  raw: Record<string, unknown>;
};

export type KanbanClientRowUi = {
  id: string;
  name: string;
  raw: Record<string, unknown>;
};

/** Papéis operacionais por cliente (chaves enviadas no PUT de profile). */
export const KANBAN_CLIENT_ROLE_KEYS = [
  {
    key: "briefing",
    label: "Responsável pelo briefing",
    apiKeys: ["briefing_lead", "briefing", "responsavel_briefing"],
  },
  {
    key: "design",
    label: "Responsável pelo design",
    apiKeys: ["design_lead", "design", "responsavel_design"],
  },
  {
    key: "copy",
    label: "Responsável pelo texto",
    apiKeys: ["copy_lead", "copy", "texto", "responsavel_texto"],
  },
  {
    key: "review",
    label: "Responsável pela revisão",
    apiKeys: ["review_lead", "review", "revisao", "responsavel_revisao"],
  },
  {
    key: "scheduling",
    label: "Responsável pelo agendamento",
    apiKeys: [
      "scheduling_lead",
      "scheduling",
      "agendamento",
      "responsavel_agendamento",
    ],
  },
] as const;

export type KanbanClientRoleKey = (typeof KANBAN_CLIENT_ROLE_KEYS)[number]["key"];
