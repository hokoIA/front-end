import {
  createTeamInvite,
  deleteTeamInvite,
  disableTeamMember,
  listTeamInvites,
  listTeamMembers,
  resendTeamInvite,
  updateTeamMemberRole,
} from "@/lib/api/team";
import { queryKeys } from "@/lib/api/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useTeamMembersQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.team.members(),
    queryFn: listTeamMembers,
    enabled,
  });
}

export function useTeamInvitesQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.team.invites(),
    queryFn: listTeamInvites,
    enabled,
  });
}

export function useDisableTeamMemberMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: disableTeamMember,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.team.all });
    },
  });
}

export function useUpdateTeamMemberRoleMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      idTeamMember,
      body,
    }: {
      idTeamMember: string;
      body: { role: "Admin" | "Equipe" };
    }) => updateTeamMemberRole(idTeamMember, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.team.all });
    },
  });
}

export function useCreateTeamInviteMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { email: string }) => createTeamInvite(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.team.all });
    },
  });
}

export function useResendTeamInviteMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: resendTeamInvite,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.team.all });
    },
  });
}

export function useDeleteTeamInviteMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteTeamInvite,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.team.all });
    },
  });
}
