export type Goal = {
  id_goal?: string;
  id?: string;
  title?: string;
  name?: string;
} & Record<string, unknown>;

export type GoalInput = Record<string, unknown>;
