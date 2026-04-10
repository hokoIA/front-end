export type KanbanBoardData = Record<string, unknown>;

export type KanbanColumn = {
  id?: string;
  name?: string;
  order?: number;
} & Record<string, unknown>;

export type KanbanCard = {
  id?: string;
  title?: string;
  columnId?: string;
} & Record<string, unknown>;

export type KanbanLabel = {
  id?: string;
  name?: string;
  color?: string;
} & Record<string, unknown>;
