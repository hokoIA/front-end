import type { RbacMeResponse } from "@/lib/types/rbac";
import type { TeamMemberUi } from "../types/ui";

const ADMIN_PERM_HINTS = [
  "team.admin",
  "team.manage",
  "manage_team",
  "members.manage",
  "account.admin",
  "admin",
];

/** Heurística: administrador da conta pode convidar e gerir equipe. */
export function isTeamAdminRbac(rbac: RbacMeResponse | null | undefined): boolean {
  if (!rbac) return false;
  const role = String(rbac.role ?? "").toLowerCase();
  if (role === "admin" || role === "owner" || role === "administrator") {
    return true;
  }
  const roles = (rbac.roles ?? []).map((x) => String(x).toLowerCase());
  if (roles.some((x) => ["admin", "owner", "administrator"].includes(x))) {
    return true;
  }
  const perms = rbac.permissions ?? [];
  return perms.some((p) => {
    const pl = String(p).toLowerCase();
    return ADMIN_PERM_HINTS.some((h) => pl === h || pl.endsWith(`.${h}`));
  });
}

export function emailsMatch(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

/** Bloqueia ações inseguras sobre o próprio usuário ou titular da conta. */
export function canManageMember(
  isAdmin: boolean,
  currentUserEmail: string | undefined,
  member: TeamMemberUi,
): boolean {
  if (!isAdmin) return false;
  if (member.isPrimary) return false;
  if (currentUserEmail && emailsMatch(currentUserEmail, member.email)) {
    return false;
  }
  return true;
}

export function canChangeRole(
  isAdmin: boolean,
  currentUserEmail: string | undefined,
  member: TeamMemberUi,
): boolean {
  return canManageMember(isAdmin, currentUserEmail, member);
}

export function canDisableMember(
  isAdmin: boolean,
  currentUserEmail: string | undefined,
  member: TeamMemberUi,
): boolean {
  if (!canManageMember(isAdmin, currentUserEmail, member)) return false;
  if (member.status === "disabled") return false;
  return true;
}

/** Quando o RBAC não expõe permissões, infere admin pelo papel na lista de membros. */
export function inferAdminFromMembership(
  members: TeamMemberUi[],
  email: string | undefined,
): boolean {
  if (!email) return false;
  const self = members.find((m) => emailsMatch(m.email, email));
  return self?.role === "admin";
}

export function canPerformTeamAdmin(
  rbac: RbacMeResponse | null | undefined,
  members: TeamMemberUi[],
  profileEmail: string | undefined,
): boolean {
  return (
    isTeamAdminRbac(rbac) || inferAdminFromMembership(members, profileEmail)
  );
}
