"use client";

import type { KanbanClientRowUi, KanbanTeamMemberUi } from "@/features/kanban/types/ui";
import { KanbanClientConfigPanel } from "./kanban-client-config-panel";
import { KanbanClientList } from "./kanban-client-list";

export function KanbanClientsPanel({
  clients,
  team,
  selectedId,
  onSelectClient,
  onSaveProfile,
  onRequestRemoveProfile,
  savePending,
  removePending,
  listLoading,
  configLoading,
  errorMessage,
}: {
  clients: KanbanClientRowUi[];
  team: KanbanTeamMemberUi[];
  selectedId: string | null;
  onSelectClient: (id: string) => void;
  onSaveProfile: (body: Record<string, unknown>) => void;
  onRequestRemoveProfile: () => void;
  savePending: boolean;
  removePending: boolean;
  listLoading?: boolean;
  configLoading?: boolean;
  errorMessage?: string | null;
}) {
  const selected = clients.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,280px)_1fr]">
      <aside
        className="rounded-xl border border-hk-border bg-hk-surface shadow-hk-sm"
        aria-label="Lista de clientes"
      >
        <div className="border-b border-hk-border px-3 py-3">
          <h2 className="text-sm font-semibold text-hk-deep">Clientes</h2>
          <p className="mt-0.5 text-xs text-hk-muted">
            Carteira da agência no módulo Kanban
          </p>
        </div>
        <KanbanClientList
          clients={clients}
          selectedId={selectedId}
          onSelect={onSelectClient}
          loading={listLoading}
        />
      </aside>

      <div className="min-w-0 rounded-xl border border-hk-border bg-hk-surface p-5 shadow-hk-sm md:p-6">
        {configLoading ? (
          <div className="space-y-4">
            <div className="h-8 w-2/3 animate-pulse rounded bg-hk-canvas" />
            <div className="h-32 animate-pulse rounded-lg bg-hk-canvas" />
            <div className="h-40 animate-pulse rounded-lg bg-hk-canvas" />
          </div>
        ) : (
          <KanbanClientConfigPanel
            client={selected}
            team={team}
            onSave={onSaveProfile}
            onRequestRemoveProfile={onRequestRemoveProfile}
            savePending={savePending}
            removePending={removePending}
            errorMessage={errorMessage}
          />
        )}
      </div>
    </div>
  );
}
