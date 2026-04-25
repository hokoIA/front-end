export type TeamMember = {
  id_team_member: number | string;
  status: "active" | "disabled" | "pending" | string;
  invited_at: string | null;
  joined_at: string | null;
  disabled_at: string | null;
  id_user: number | string;
  name: string | null;
  email: string;
  role: "Admin" | "Equipe" | string;
} & Record<string, unknown>;

export type TeamInvite = {
  id_invite: number | string;
  email: string;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
  created_by_user_id: number | string;
} & Record<string, unknown>;
