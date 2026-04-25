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

function normalizeInviteStatus(
  acceptedAt: unknown,
  expiresAt: unknown,
): TeamInviteStatusUi {
  if (acceptedAt) return "accepted";
  const expires = expiresAt ? new Date(String(expiresAt)) : null;
  if (expires && Number.isFinite(expires.getTime()) && expires.getTime() < Date.now()) {
    return "expired";
  }
  return "pending";
}

export function normalizeTeamMember(
  m: TeamMember,
  index: number,
): TeamMemberUi {
  const r = record(m) ?? {};
  const id = str(r.id_team_member ?? r.id) || `member-${index}`;
  const idUser = str(r.id_user ?? r.user_id ?? r.id_user_fk);
  const email = str(r.email ?? r.mail ?? r.user_email);
  const nameDirect = str(
    r.name ?? r.nome ?? r.full_name ?? r.display_name,
  );
  const statusRaw = str(r.status).toLowerCase();
  const disabled =
    r.disabled === true ||
    r.active === false ||
    statusRaw === "disabled" ||
    statusRaw === "inactive";

  const u = record(r.user);
  const nameFromUser = u ? str(u.name ?? u.email) : "";
  const displayName = nameDirect || nameFromUser || email || "Membro";

  return {
    id,
    idUser,
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
    disabledAt: str(r.disabled_at) || undefined,
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
  const sentAt = str(
    r.created_at ?? r.sent_at ?? r.invited_at ?? r.data_envio,
  );
  const expiresAt = str(
    r.expires_at ?? r.expiration ?? r.valid_until ?? r.data_expiracao,
  );

  return {
    id,
    email: email || "—",
    role: "team",
    status:
      r.status || r.situacao
        ? mapInviteStatus(r.status ?? r.situacao)
        : normalizeInviteStatus(r.accepted_at, r.expires_at),
    sentAt: sentAt || undefined,
    expiresAt: expiresAt || undefined,
    raw: r,
  };
}
