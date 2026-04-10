import type { TeamInvite, TeamMember } from "@/lib/types/team";
import { endpoints } from "./endpoints";
import { httpJson } from "./http-client";

export async function listTeamMembers(): Promise<TeamMember[]> {
  const data = await httpJson<unknown>(endpoints.team.members(), {
    method: "GET",
  });
  if (Array.isArray(data)) return data as TeamMember[];
  if (
    data &&
    typeof data === "object" &&
    "data" in data &&
    Array.isArray((data as { data: unknown }).data)
  ) {
    return (data as { data: TeamMember[] }).data;
  }
  return [];
}

export async function disableTeamMember(idTeamMember: string): Promise<unknown> {
  return httpJson(endpoints.team.memberDisable(idTeamMember), {
    method: "PATCH",
    json: {},
  });
}

export async function updateTeamMemberRole(
  idTeamMember: string,
  body: Record<string, unknown>,
): Promise<unknown> {
  return httpJson(endpoints.team.memberRole(idTeamMember), {
    method: "PATCH",
    json: body,
  });
}

export async function listTeamInvites(): Promise<TeamInvite[]> {
  const data = await httpJson<unknown>(endpoints.team.invites(), {
    method: "GET",
  });
  if (Array.isArray(data)) return data as TeamInvite[];
  if (
    data &&
    typeof data === "object" &&
    "data" in data &&
    Array.isArray((data as { data: unknown }).data)
  ) {
    return (data as { data: TeamInvite[] }).data;
  }
  return [];
}

export async function createTeamInvite(
  body: Record<string, unknown>,
): Promise<unknown> {
  return httpJson(endpoints.team.invites(), { method: "POST", json: body });
}

export async function resendTeamInvite(idInvite: string): Promise<unknown> {
  return httpJson(endpoints.team.inviteResend(idInvite), {
    method: "POST",
    json: {},
  });
}

export async function deleteTeamInvite(idInvite: string): Promise<void> {
  await httpJson(endpoints.team.inviteDelete(idInvite), { method: "DELETE" });
}
