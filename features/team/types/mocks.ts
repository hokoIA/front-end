import type { TeamInviteUi, TeamMemberUi } from "./ui";

/** Dados fictícios para testes de layout (não usar em produção). */
export const MOCK_TEAM_MEMBERS: TeamMemberUi[] = [
  {
    id: "m1",
    name: "Você (exemplo)",
    email: "admin@exemplo.com",
    role: "admin",
    status: "active",
    joinedAt: "2025-01-10",
    isPrimary: true,
    raw: {},
  },
  {
    id: "m2",
    name: "Ana Marketing",
    email: "ana@exemplo.com",
    role: "team",
    status: "active",
    joinedAt: "2025-03-02",
    isPrimary: false,
    raw: {},
  },
];

export const MOCK_TEAM_INVITES: TeamInviteUi[] = [
  {
    id: "i1",
    email: "novo@exemplo.com",
    role: "team",
    status: "pending",
    sentAt: "2025-04-01",
    expiresAt: "2025-04-15",
    raw: {},
  },
];
