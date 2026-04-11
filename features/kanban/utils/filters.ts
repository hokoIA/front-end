import type { KanbanCardUi, KanbanLabelUi } from "../types/ui";

export type KanbanBoardFilters = {
  search: string;
  customerId: string;
  assigneeId: string;
  week: string;
};

export const defaultKanbanBoardFilters: KanbanBoardFilters = {
  search: "",
  customerId: "all",
  assigneeId: "all",
  week: "all",
};

export function filterKanbanCards(
  cards: KanbanCardUi[],
  labels: KanbanLabelUi[],
  f: KanbanBoardFilters,
): KanbanCardUi[] {
  const labelById = new Map(labels.map((l) => [l.id, l]));

  return cards.filter((c) => {
    if (f.customerId !== "all" && c.customerId !== f.customerId) {
      return false;
    }
    if (
      f.assigneeId !== "all" &&
      !c.assigneeIds.includes(f.assigneeId)
    ) {
      return false;
    }
    if (f.week !== "all" && (c.week ?? "") !== f.week) {
      return false;
    }
    if (f.search.trim()) {
      const q = f.search.trim().toLowerCase();
      const labelNames = c.labelIds
        .map((id) => labelById.get(id)?.name ?? "")
        .join(" ")
        .toLowerCase();
      const blob = [
        c.title,
        c.customerName ?? "",
        c.copyPreview ?? "",
        c.description ?? "",
        labelNames,
      ]
        .join(" ")
        .toLowerCase();
      if (!blob.includes(q)) return false;
    }
    return true;
  });
}

export function weekOptionsFromCards(cards: KanbanCardUi[]): string[] {
  const set = new Set<string>();
  for (const c of cards) {
    if (c.week) set.add(c.week);
  }
  return [...set].sort();
}
