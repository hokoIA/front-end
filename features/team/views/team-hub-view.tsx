"use client";

import { InviteMemberCard } from "@/features/team/components/invite-member-card";
import { PendingInvitesList } from "@/features/team/components/pending-invites-list";
import { TeamEmptyState } from "@/features/team/components/team-empty-state";
import { TeamErrorState } from "@/features/team/components/team-error-state";
import { TeamMembersList } from "@/features/team/components/team-members-list";
import { TeamNoPermissionState } from "@/features/team/components/team-no-permission-state";
import { TeamOverviewBar } from "@/features/team/components/team-overview-bar";
import { TeamPageHeader } from "@/features/team/components/team-page-header";
import type { TeamInviteUi, TeamMemberUi, TeamRoleUi } from "@/features/team/types/ui";
import { teamOperationMessage } from "@/features/team/utils/http-message";
import { normalizeTeamInvite, normalizeTeamMember } from "@/features/team/utils/normalize";
import { computeTeamOverview } from "@/features/team/utils/overview";
import {
  canAccessTeamPage,
  canManageTeam,
} from "@/features/team/utils/permissions";
import {
  useAuthStatusQuery,
  useProfileQuery,
} from "@/hooks/api/use-auth-queries";
import { useRbacMeQuery } from "@/hooks/api/use-rbac-queries";
import {
  useCreateTeamInviteMutation,
  useDeleteTeamInviteMutation,
  useDisableTeamMemberMutation,
  useResendTeamInviteMutation,
  useTeamInvitesQuery,
  useTeamMembersQuery,
  useUpdateTeamMemberRoleMutation,
} from "@/hooks/api/use-team-queries";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

function roleToApiRole(role: TeamRoleUi): "Admin" | "Equipe" {
  return role === "admin" ? "Admin" : "Equipe";
}

export function TeamHubView() {
  const { data: auth } = useAuthStatusQuery();
  const authed = auth?.authenticated === true;
  const profile = useProfileQuery(authed);
  const rbacQ = useRbacMeQuery();
  const rbac = rbacQ.data;
  const canAccess = canAccessTeamPage(rbac);
  const canManage = canManageTeam(rbac);
  const rbacReady = rbacQ.isSuccess;

  const membersQ = useTeamMembersQuery(rbacReady && canManage);
  const invitesQ = useTeamInvitesQuery(rbacReady && canManage);

  const currentEmail =
    rbac?.email || profile.data?.email || auth?.user?.email || undefined;
  const currentUserId =
    rbac?.id_user || (auth?.user?.id ? String(auth.user.id) : undefined);

  const members = useMemo(
    () => (membersQ.data ?? []).map((m, i) => normalizeTeamMember(m, i)),
    [membersQ.data],
  );

  const invites = useMemo(
    () => (invitesQ.data ?? []).map((i, idx) => normalizeTeamInvite(i, idx)),
    [invitesQ.data],
  );

  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => {
      if (a.status !== b.status) return a.status === "active" ? -1 : 1;
      return a.name.localeCompare(b.name, "pt-BR");
    });
  }, [members]);

  const overview = useMemo(
    () => computeTeamOverview(members, invites),
    [members, invites],
  );

  const [inviteEmail, setInviteEmail] = useState("");
  const [roleTarget, setRoleTarget] = useState<TeamMemberUi | null>(null);
  const [newRole, setNewRole] = useState<TeamRoleUi>("team");
  const [disableTarget, setDisableTarget] = useState<TeamMemberUi | null>(
    null,
  );
  const [cancelInviteTarget, setCancelInviteTarget] =
    useState<TeamInviteUi | null>(null);

  const createInv = useCreateTeamInviteMutation();
  const updateRole = useUpdateTeamMemberRoleMutation();
  const disableMem = useDisableTeamMemberMutation();
  const resendInv = useResendTeamInviteMutation();
  const deleteInv = useDeleteTeamInviteMutation();

  const sendInvite = () => {
    void (async () => {
      try {
        await createInv.mutateAsync({ email: inviteEmail.trim() });
        toast.success("Convite enviado.");
        setInviteEmail("");
      } catch (e) {
        toast.error(
          teamOperationMessage(e, "Não foi possível enviar o convite."),
        );
      }
    })();
  };

  const submitRoleChange = () => {
    if (!roleTarget) return;
    void (async () => {
      try {
        await updateRole.mutateAsync({
          idTeamMember: roleTarget.id,
          body: { role: roleToApiRole(newRole) },
        });
        toast.success("Nível de acesso atualizado.");
        setRoleTarget(null);
      } catch (e) {
        toast.error(
          teamOperationMessage(e, "Não foi possível alterar o nível."),
        );
      }
    })();
  };

  const submitDisable = () => {
    if (!disableTarget) return;
    void (async () => {
      try {
        await disableMem.mutateAsync(disableTarget.id);
        toast.success("Membro desativado.");
        setDisableTarget(null);
      } catch (e) {
        toast.error(
          teamOperationMessage(e, "Não foi possível desativar o membro."),
        );
      }
    })();
  };

  const doResend = (inv: TeamInviteUi) => {
    void (async () => {
      try {
        await resendInv.mutateAsync(inv.id);
        toast.success("Convite reenviado.");
      } catch (e) {
        toast.error(
          teamOperationMessage(e, "Não foi possível reenviar o convite."),
        );
      }
    })();
  };

  const submitCancelInvite = () => {
    if (!cancelInviteTarget) return;
    void (async () => {
      try {
        await deleteInv.mutateAsync(cancelInviteTarget.id);
        toast.success("Convite cancelado.");
        setCancelInviteTarget(null);
      } catch (e) {
        toast.error(
          teamOperationMessage(e, "Não foi possível cancelar o convite."),
        );
      }
    })();
  };

  const loadingList = canManage && (membersQ.isPending || invitesQ.isPending);

  if (rbacQ.isPending) {
    return (
      <div className="hk-page hk-page--narrow flex flex-col gap-6 py-8">
        <TeamPageHeader />
        <TeamOverviewBar
          activeCount={0}
          pendingInvites={0}
          adminCount={0}
          teamCount={0}
          disabledCount={0}
          loading
        />
      </div>
    );
  }

  if (rbacQ.isError || !rbac) {
    return (
      <div className="hk-page hk-page--narrow flex flex-col gap-6 py-8">
        <TeamPageHeader />
        <TeamErrorState
          error={rbacQ.error instanceof Error ? rbacQ.error : null}
          onRetry={() => void rbacQ.refetch()}
        />
      </div>
    );
  }

  if (!canAccess || !canManage) {
    return (
      <div className="hk-page hk-page--narrow flex flex-col gap-6 py-8">
        <TeamPageHeader />
        <TeamNoPermissionState />
      </div>
    );
  }

  if (membersQ.isError) {
    return (
      <div className="hk-page hk-page--narrow flex flex-col gap-6 py-8">
        <TeamPageHeader />
        <TeamErrorState
          error={membersQ.error instanceof Error ? membersQ.error : null}
          onRetry={() => void membersQ.refetch()}
        />
      </div>
    );
  }

  const soloAdminHint =
    overview.activeCount === 1 &&
    overview.adminCount === 1 &&
    overview.teamCount === 0;

  return (
    <div className="hk-page flex flex-col gap-8 py-8">
      <TeamPageHeader />

      <TeamOverviewBar
        activeCount={overview.activeCount}
        pendingInvites={overview.pendingInvites}
        adminCount={overview.adminCount}
        teamCount={overview.teamCount}
        disabledCount={overview.disabledCount}
        loading={loadingList}
      />

      <InviteMemberCard
        email={inviteEmail}
        onEmailChange={setInviteEmail}
        onSubmit={sendInvite}
        loading={createInv.isPending}
      />

      {members.length === 0 && !loadingList ? (
        <TeamEmptyState isAdmin={canManage} />
      ) : (
        <>
          {soloAdminHint ? (
            <p className="rounded-lg border border-hk-border-subtle bg-hk-canvas/60 px-4 py-3 text-sm text-hk-muted">
              Você é o único membro ativo com papel de admin. Convide a equipe
              para compartilhar a conta com segurança.
            </p>
          ) : null}
          <TeamMembersList
            members={sortedMembers}
            loading={loadingList}
            currentUserId={currentUserId}
            currentUserEmail={currentEmail}
            canManage={canManage}
            onChangeRole={(m) => {
              setNewRole(m.role);
              setRoleTarget(m);
            }}
            onDisable={(m) => setDisableTarget(m)}
          />
        </>
      )}

      {invitesQ.isError ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
          Não foi possível carregar os convites.{" "}
          <button
            type="button"
            className="font-medium underline underline-offset-2"
            onClick={() => void invitesQ.refetch()}
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <PendingInvitesList
          invites={invites}
          loading={loadingList}
          isAdmin={canManage}
          onResend={doResend}
          onCancel={(i) => setCancelInviteTarget(i)}
        />
      )}

      <Dialog
        open={Boolean(roleTarget)}
        onOpenChange={(o) => !o && setRoleTarget(null)}
      >
        <DialogContent className="border-hk-border">
          <DialogHeader>
            <DialogTitle>Alterar nível de acesso</DialogTitle>
            <DialogDescription>
              {roleTarget
                ? `Defina o novo papel para ${roleTarget.email}.`
                : null}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-2">
            <Label>Novo nível</Label>
            <Select
              value={newRole}
              onValueChange={(v) => setNewRole(v as TeamRoleUi)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="team">Equipe</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRoleTarget(null)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className="bg-hk-action text-white hover:bg-hk-strong"
              onClick={submitRoleChange}
              disabled={updateRole.isPending}
            >
              {updateRole.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                "Salvar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(disableTarget)}
        onOpenChange={(o) => !o && setDisableTarget(null)}
      >
        <DialogContent className="border-hk-border">
          <DialogHeader>
            <DialogTitle>Desativar membro?</DialogTitle>
            <DialogDescription>
              {disableTarget
                ? `${disableTarget.name} perderá acesso à conta até uma eventual reativação pelo backend.`
                : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDisableTarget(null)}
            >
              Voltar
            </Button>
            <Button
              type="button"
              className="bg-rose-600 text-white hover:bg-rose-700"
              onClick={submitDisable}
              disabled={disableMem.isPending}
            >
              {disableMem.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                "Desativar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(cancelInviteTarget)}
        onOpenChange={(o) => !o && setCancelInviteTarget(null)}
      >
        <DialogContent className="border-hk-border">
          <DialogHeader>
            <DialogTitle>Cancelar convite?</DialogTitle>
            <DialogDescription>
              {cancelInviteTarget
                ? `O convite para ${cancelInviteTarget.email} será invalidado.`
                : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCancelInviteTarget(null)}
            >
              Voltar
            </Button>
            <Button
              type="button"
              className="bg-rose-600 text-white hover:bg-rose-700"
              onClick={submitCancelInvite}
              disabled={deleteInv.isPending}
            >
              {deleteInv.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                "Cancelar convite"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
