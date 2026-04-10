export type TeamMember = {
  id_team_member?: string;
  id?: string;
  email?: string;
  role?: string;
  disabled?: boolean;
} & Record<string, unknown>;

export type TeamInvite = {
  id_invite?: string;
  id?: string;
  email?: string;
  status?: string;
} & Record<string, unknown>;
