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
    apiKey: "role_briefing_name",
    responseKey: "briefing",
  },
  {
    key: "design",
    label: "Responsável pelo design",
    apiKey: "role_design_name",
    responseKey: "design",
  },
  {
    key: "text",
    label: "Responsável pelo texto",
    apiKey: "role_text_name",
    responseKey: "text",
  },
  {
    key: "review",
    label: "Responsável pela revisão",
    apiKey: "role_review_name",
    responseKey: "review",
  },
  {
    key: "schedule",
    label: "Responsável pelo agendamento",
    apiKey: "role_schedule_name",
    responseKey: "schedule",
  },
] as const;

export type KanbanClientRoleKey = (typeof KANBAN_CLIENT_ROLE_KEYS)[number]["key"];
