/** Papéis exibidos na UI (mapeados a partir do backend). */
export type TeamRoleUi = "admin" | "team";

/** Situação do membro na conta. */
export type TeamMemberStatusUi = "active" | "disabled";

/** Situação do convite. */
export type TeamInviteStatusUi =
  | "pending"
  | "accepted"
  | "expired"
  | "revoked"
  | "unknown";

export type TeamMemberUi = {
  id: string;
  name: string;
  email: string;
  role: TeamRoleUi;
  status: TeamMemberStatusUi;
  joinedAt?: string;
  /** Proprietário / admin principal — ações destrutivas bloqueadas na UI. */
  isPrimary: boolean;
  raw: Record<string, unknown>;
};

export type TeamInviteUi = {
  id: string;
  email: string;
  role: TeamRoleUi;
  status: TeamInviteStatusUi;
  sentAt?: string;
  expiresAt?: string;
  raw: Record<string, unknown>;
};
