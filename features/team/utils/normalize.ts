import type { TeamInviteUi, TeamMemberUi, TeamInviteStatusUi, TeamRoleUi } from "../types/ui";
import type { TeamInvite, TeamMember } from "@/lib/types/team";
import { record } from "./record";

function str(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

export function mapTeamRole(raw: unknown): TeamRoleUi {
  const s = str(raw).toLowerCase();
  if (
    ["admin", "administrator", "owner", "dono", "superadmin"].includes(s)
  ) {
    return "admin";
  }
  return "team";
}

function mapInviteStatus(raw: unknown): TeamInviteStatusUi {
  const s = str(raw).toLowerCase();
  if (["pending", "pendente", "sent", "enviado"].includes(s)) return "pending";
  if (["accepted", "aceito", "completed"].includes(s)) return "accepted";
  if (["expired", "expirado"].includes(s)) return "expired";
  if (["revoked", "cancelado", "cancelled", "canceled"].includes(s)) {
    return "revoked";
  }
  return "unknown";
}

export function normalizeTeamMember(
  m: TeamMember,
  index: number,
): TeamMemberUi {
  const r = record(m) ?? {};
  const id =
    str(r.id_team_member ?? r.id ?? r.user_id) || `member-${index}`;
  const email = str(r.email ?? r.mail ?? r.user_email);
  const nameDirect = str(
    r.name ?? r.nome ?? r.full_name ?? r.display_name,
  );
  const disabled =
    r.disabled === true ||
    r.active === false ||
    str(r.status).toLowerCase() === "disabled" ||
    str(r.status).toLowerCase() === "inactive";
  const isPrimary =
    r.is_owner === true ||
    r.owner === true ||
    r.primary === true ||
    r.is_primary === true ||
    str(r.account_role).toLowerCase() === "owner";

  const u = record(r.user);
  const nameFromUser = u ? str(u.name ?? u.email) : "";
  const displayName = nameDirect || nameFromUser || email || "Membro";

  return {
    id,
    name: displayName,
    email: email || "—",
    role: mapTeamRole(r.role ?? r.papel ?? r.access_level),
    status: disabled ? "disabled" : "active",
    joinedAt: str(
      r.joined_at ??
        r.created_at ??
        r.data_entrada ??
        r.member_since,
    ) || undefined,
    isPrimary,
    raw: r,
  };
}

export function normalizeTeamInvite(
  inv: TeamInvite,
  index: number,
): TeamInviteUi {
  const r = record(inv) ?? {};
  const id = str(r.id_invite ?? r.id) || `invite-${index}`;
  const email = str(r.email ?? r.mail ?? r.invited_email);
  return {
    id,
    email: email || "—",
    role: mapTeamRole(
      r.role ?? r.papel ?? r.invited_role ?? r.access_level,
    ),
    status: mapInviteStatus(r.status ?? r.situacao),
    sentAt: str(
      r.sent_at ?? r.created_at ?? r.invited_at ?? r.data_envio,
    ) || undefined,
    expiresAt: str(
      r.expires_at ?? r.expiration ?? r.valid_until ?? r.data_expiracao,
    ) || undefined,
    raw: r,
  };
}
