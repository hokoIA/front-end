import type { TeamInvite, TeamMember } from "@/lib/types/team";
import { endpoints } from "./endpoints";
import { httpJson } from "./http-client";

type MembersResponse = {
  success?: boolean;
  members?: TeamMember[];
  data?: TeamMember[];
};

type InvitesResponse = {
  success?: boolean;
  invites?: TeamInvite[];
  data?: TeamInvite[];
};

export async function listTeamMembers(): Promise<TeamMember[]> {
  const res = await httpJson<MembersResponse | TeamMember[]>(endpoints.team.members(), {
    method: "GET",
  });

  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.members)) return res.members;
  if (Array.isArray(res?.data)) return res.data;
  return [];
}

export async function disableTeamMember(idTeamMember: string): Promise<unknown> {
  return httpJson(endpoints.team.memberDisable(idTeamMember), {
    method: "PATCH",
  });
}

export async function updateTeamMemberRole(
  idTeamMember: string,
  body: { role: "Admin" | "Equipe" },
): Promise<unknown> {
  return httpJson(endpoints.team.memberRole(idTeamMember), {
    method: "PATCH",
    json: body,
  });
}

export async function listTeamInvites(): Promise<TeamInvite[]> {
  const res = await httpJson<InvitesResponse | TeamInvite[]>(endpoints.team.invites(), {
    method: "GET",
  });

  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.invites)) return res.invites;
  if (Array.isArray(res?.data)) return res.data;
  return [];
}

export async function createTeamInvite(
  body: { email: string },
): Promise<unknown> {
  return httpJson(endpoints.team.invites(), {
    method: "POST",
    json: { email: body.email },
  });
}

export async function resendTeamInvite(idInvite: string): Promise<unknown> {
  return httpJson(endpoints.team.inviteResend(idInvite), {
    method: "POST",
  });
}

export async function deleteTeamInvite(idInvite: string): Promise<void> {
  await httpJson(endpoints.team.inviteDelete(idInvite), { method: "DELETE" });
}
