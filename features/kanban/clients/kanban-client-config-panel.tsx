"use client";

import type { KanbanClientRowUi, KanbanTeamMemberUi } from "@/features/kanban/types/ui";
import { KANBAN_CLIENT_ROLE_KEYS } from "@/features/kanban/types/ui";
import {
  buildKanbanClientProfileBody,
  readKanbanClientRoleAssignments,
} from "@/features/kanban/utils/client-profile";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { KanbanExternalLinkCard } from "./kanban-external-link-card";
import { KanbanRoleAssignmentField } from "./kanban-role-assignment-field";
import { Loader2, Save, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";

export function KanbanClientConfigPanel({
  client,
  team,
  onSave,
  onRequestRemoveProfile,
  savePending,
  removePending,
  errorMessage,
}: {
  client: KanbanClientRowUi | null;
  team: KanbanTeamMemberUi[];
  onSave: (body: Record<string, unknown>) => void;
  onRequestRemoveProfile: () => void;
  savePending: boolean;
  removePending: boolean;
  errorMessage?: string | null;
}) {
  const [roles, setRoles] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!client) {
      setRoles({});
      return;
    }
    setRoles(readKanbanClientRoleAssignments(client));
  }, [client]);

  if (!client) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-hk-border bg-hk-canvas/30 p-8 text-center">
        <Users className="h-10 w-10 text-hk-muted" aria-hidden />
        <p className="mt-3 text-sm font-medium text-hk-deep">
          Selecione um cliente
        </p>
        <p className="mt-1 max-w-sm text-xs text-hk-muted">
          Configure papéis operacionais por cliente. A equipe é global; aqui você
          define quem responde por briefing, design, texto, revisão e
          agendamento nesta conta.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-hk-deep">{client.name}</h3>
        <p className="mt-1 text-sm text-hk-muted">
          Papéis no fluxo Kanban deste cliente. Membros listados vêm da equipe da
          conta.
        </p>
      </div>

      <KanbanExternalLinkCard
        customerId={client.id}
        customerName={client.name}
      />

      <Separator />

      <section aria-label="Equipe por função">
        <h4 className="text-sm font-semibold text-hk-deep">
          Responsáveis por função
        </h4>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {KANBAN_CLIENT_ROLE_KEYS.map((role) => (
            <KanbanRoleAssignmentField
              key={role.key}
              id={`role-${client.id}-${role.key}`}
              label={role.label}
              value={roles[role.key] ?? ""}
              team={team}
              onChange={(memberId) =>
                setRoles((prev) => ({ ...prev, [role.key]: memberId }))
              }
              disabled={savePending || removePending}
            />
          ))}
        </div>
      </section>

      {team.length === 0 ? (
        <p className="text-xs text-amber-800">
          Nenhum membro disponível em{" "}
          <code className="rounded bg-hk-canvas px-1">GET /api/kanban/team</code>
          . Ajuste a API ou cadastre usuários na equipe.
        </p>
      ) : null}

      {errorMessage ? (
        <p className="text-sm text-rose-600" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          className="gap-2 bg-hk-deep text-white hover:bg-hk-strong"
          disabled={savePending || removePending}
          onClick={() => onSave(buildKanbanClientProfileBody(roles))}
        >
          {savePending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Save className="h-4 w-4" aria-hidden />
          )}
          Salvar configuração
        </Button>
        <Button
          type="button"
          variant="outline"
          className="gap-2 text-rose-700 hover:bg-rose-50"
          disabled={savePending || removePending}
          onClick={onRequestRemoveProfile}
        >
          {removePending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Trash2 className="h-4 w-4" aria-hidden />
          )}
          Remover configuração do Kanban
        </Button>
      </div>
    </div>
  );
}
