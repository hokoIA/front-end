import {
  isAdminRbac,
  rbacAllows,
  type NormalizedRbacMe,
} from "@/lib/types/rbac";
import type { TeamMemberUi } from "../types/ui";

export function emailsMatch(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export function canAccessTeamPage(
  rbac: NormalizedRbacMe | null | undefined,
): boolean {
  return (
    isAdminRbac(rbac) ||
    rbacAllows(rbac, "page:team:view") ||
    rbacAllows(rbac, "team:manage")
  );
}

export function canManageTeam(
  rbac: NormalizedRbacMe | null | undefined,
): boolean {
  return isAdminRbac(rbac) || rbacAllows(rbac, "team:manage");
}

export function canChangeRole(
  canManage: boolean,
  currentUserId: string | undefined,
  currentUserEmail: string | undefined,
  member: TeamMemberUi,
): boolean {
  if (!canManage) return false;
  if (currentUserId && member.idUser === currentUserId) return false;
  if (currentUserEmail && emailsMatch(currentUserEmail, member.email)) return false;
  return true;
}

export function canDisableMember(
  canManage: boolean,
  currentUserId: string | undefined,
  currentUserEmail: string | undefined,
  member: TeamMemberUi,
): boolean {
  if (!canChangeRole(canManage, currentUserId, currentUserEmail, member)) {
    return false;
  }
  if (member.status === "disabled") return false;
  if (member.role === "admin") return false;
  return true;
}
