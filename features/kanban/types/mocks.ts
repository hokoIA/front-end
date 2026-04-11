import type { KanbanCardUi, KanbanColumnUi, KanbanLabelUi } from "./ui";

/** Uso discreto em desenvolvimento ou fallbacks de teste. */
export const MOCK_KANBAN_COLUMNS: KanbanColumnUi[] = [
  {
    id: "mock-a",
    name: "Briefing",
    color: "#192bc2",
    order: 0,
    raw: {},
  },
  {
    id: "mock-b",
    name: "Produção",
    color: "#0e7490",
    order: 1,
    raw: {},
  },
];

export const MOCK_KANBAN_LABELS: KanbanLabelUi[] = [
  { id: "l1", name: "Urgente", color: "#dc2626", raw: {} },
  { id: "l2", name: "Cliente A", color: "#7c3aed", raw: {} },
];

export const MOCK_KANBAN_CARDS: KanbanCardUi[] = [
  {
    id: "c1",
    title: "Campanha de páscoa — peças redes",
    columnId: "mock-a",
    week: "2026-W15",
    customerName: "Cliente Demo",
    copyPreview: "Copy sugerida para stories e feed…",
    assigneeIds: [],
    assigneeNames: ["Ana"],
    labelIds: ["l1"],
    sortOrder: 0,
    raw: {},
  },
];
