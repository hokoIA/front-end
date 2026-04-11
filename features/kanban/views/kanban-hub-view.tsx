"use client";

import { KanbanBoard, KanbanBoardSkeleton } from "@/features/kanban/board/kanban-board";
import { KanbanCardDetailsDrawer } from "@/features/kanban/components/kanban-card-details-drawer";
import { KanbanColumnEditor } from "@/features/kanban/components/kanban-column-editor";
import { KanbanConfirmDialog } from "@/features/kanban/components/kanban-confirm-dialog";
import { KanbanCreateCardFlow } from "@/features/kanban/components/kanban-create-card-flow";
import { KanbanEditCardFlow } from "@/features/kanban/components/kanban-edit-card-flow";
import { KanbanEmptyBoardState } from "@/features/kanban/components/kanban-empty-board-state";
import { KanbanErrorState } from "@/features/kanban/components/kanban-error-state";
import { KanbanFiltersToolbar } from "@/features/kanban/components/kanban-filters-toolbar";
import { KanbanPageHeader } from "@/features/kanban/components/kanban-page-header";
import type { KanbanHubTab } from "@/features/kanban/components/kanban-tabs";
import { KanbanTabs } from "@/features/kanban/components/kanban-tabs";
import { KanbanClientsPanel } from "@/features/kanban/clients/kanban-clients-panel";
import { KanbanLabelForm } from "@/features/kanban/labels/kanban-label-form";
import { KanbanLabelsPanel } from "@/features/kanban/labels/kanban-labels-panel";
import type {
  KanbanCardUi,
  KanbanColumnUi,
  KanbanLabelUi,
} from "@/features/kanban/types/ui";
import {
  defaultKanbanBoardFilters,
  filterKanbanCards,
  weekOptionsFromCards,
} from "@/features/kanban/utils/filters";
import {
  normalizeKanbanCard,
  normalizeKanbanColumn,
  normalizeKanbanLabel,
  parseKanbanClients,
  parseKanbanTeam,
} from "@/features/kanban/utils/normalize";
import { HttpError } from "@/lib/api/http-client";
import { useAuthStatusQuery } from "@/hooks/api/use-auth-queries";
import {
  useKanbanCardMutations,
  useKanbanClientProfileMutations,
  useKanbanClientsQuery,
  useKanbanColumnMutations,
  useKanbanColumnsQuery,
  useKanbanCardsQuery,
  useKanbanLabelMutations,
  useKanbanLabelsQuery,
  useKanbanTeamQuery,
} from "@/hooks/api/use-kanban-queries";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const UNASSIGNED = "unassigned";

type ConfirmState =
  | { kind: "column"; column: KanbanColumnUi }
  | { kind: "card"; card: KanbanCardUi }
  | { kind: "label"; label: KanbanLabelUi }
  | { kind: "profile"; clientId: string; clientName: string };

export function KanbanHubView() {
  const { data: auth } = useAuthStatusQuery();
  const authed = auth?.authenticated === true;

  const colsQ = useKanbanColumnsQuery(authed);
  const cardsQ = useKanbanCardsQuery(authed);
  const labelsQ = useKanbanLabelsQuery(authed);
  const teamQ = useKanbanTeamQuery(authed);
  const clientsQ = useKanbanClientsQuery(authed);

  const columnsUi = useMemo(
    () => (colsQ.data ?? []).map((c, i) => normalizeKanbanColumn(c, i)),
    [colsQ.data],
  );
  const allCardsUi = useMemo(
    () => (cardsQ.data ?? []).map((c, i) => normalizeKanbanCard(c, i)),
    [cardsQ.data],
  );
  const labelsUi = useMemo(
    () => (labelsQ.data ?? []).map((l, i) => normalizeKanbanLabel(l, i)),
    [labelsQ.data],
  );
  const team = useMemo(() => parseKanbanTeam(teamQ.data), [teamQ.data]);
  const clients = useMemo(
    () => parseKanbanClients(clientsQ.data),
    [clientsQ.data],
  );

  const sortedReal = useMemo(() => {
    return [...columnsUi]
      .filter((c) => c.id !== UNASSIGNED)
      .sort((a, b) => a.order - b.order);
  }, [columnsUi]);

  const columnIdSet = useMemo(
    () => new Set(sortedReal.map((c) => c.id)),
    [sortedReal],
  );
  const hasOrphans = useMemo(
    () => allCardsUi.some((c) => !columnIdSet.has(c.columnId)),
    [allCardsUi, columnIdSet],
  );

  const displayColumns = useMemo((): KanbanColumnUi[] => {
    if (hasOrphans) {
      return [
        {
          id: UNASSIGNED,
          name: "Sem coluna",
          color: "#64748b",
          order: -1,
          raw: {},
        },
        ...sortedReal,
      ];
    }
    return sortedReal;
  }, [hasOrphans, sortedReal]);

  const [filters, setFilters] = useState(defaultKanbanBoardFilters);
  const filteredCards = useMemo(
    () => filterKanbanCards(allCardsUi, labelsUi, filters),
    [allCardsUi, labelsUi, filters],
  );
  const weekOpts = useMemo(
    () => weekOptionsFromCards(allCardsUi),
    [allCardsUi],
  );

  const [tab, setTab] = useState<KanbanHubTab>("board");

  const [columnEditorOpen, setColumnEditorOpen] = useState(false);
  const [columnEditorMode, setColumnEditorMode] = useState<"create" | "edit">(
    "create",
  );
  const [columnEditing, setColumnEditing] = useState<KanbanColumnUi | null>(
    null,
  );
  const [columnEditorError, setColumnEditorError] = useState<string | null>(
    null,
  );

  const [createCardOpen, setCreateCardOpen] = useState(false);
  const [createDefaultColumnId, setCreateDefaultColumnId] = useState<
    string | undefined
  >(undefined);
  const [editCardOpen, setEditCardOpen] = useState(false);
  const [editCard, setEditCard] = useState<KanbanCardUi | null>(null);
  const [cardFormError, setCardFormError] = useState<string | null>(null);

  const [detailCard, setDetailCard] = useState<KanbanCardUi | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [clientProfileError, setClientProfileError] = useState<string | null>(
    null,
  );

  const [labelFormOpen, setLabelFormOpen] = useState(false);
  const [labelFormMode, setLabelFormMode] = useState<"create" | "edit">(
    "create",
  );
  const [labelEditing, setLabelEditing] = useState<KanbanLabelUi | null>(null);

  useEffect(() => {
    if (!selectedClientId && clients.length > 0) {
      setSelectedClientId(clients[0].id);
    }
  }, [clients, selectedClientId]);

  const {
    create: createCol,
    update: updateCol,
    remove: removeCol,
    reorder,
  } = useKanbanColumnMutations();
  const {
    create: createCard,
    update: updateCard,
    remove: removeCard,
    move,
  } = useKanbanCardMutations();
  const { put: putProfile, remove: removeProfile } =
    useKanbanClientProfileMutations();
  const labelMut = useKanbanLabelMutations();

  const maxColumnOrder = sortedReal.reduce((m, c) => Math.max(m, c.order), -1);

  const openCreateColumn = () => {
    setColumnEditorMode("create");
    setColumnEditing(null);
    setColumnEditorError(null);
    setColumnEditorOpen(true);
  };

  const submitColumn = (payload: { name: string; color: string }) => {
    setColumnEditorError(null);
    if (columnEditorMode === "create") {
      createCol.mutate(
        {
          name: payload.name,
          color: payload.color,
          order: maxColumnOrder + 1,
          position: maxColumnOrder + 1,
        },
        {
          onSuccess: () => {
            toast.success("Coluna criada.");
            setColumnEditorOpen(false);
          },
          onError: (e) => {
            const msg =
              e instanceof HttpError
                ? e.message
                : "Não foi possível criar a coluna.";
            setColumnEditorError(msg);
            toast.error(msg);
          },
        },
      );
    } else if (columnEditing) {
      updateCol.mutate(
        {
          id: columnEditing.id,
          body: {
            name: payload.name,
            color: payload.color,
          },
        },
        {
          onSuccess: () => {
            toast.success("Coluna atualizada.");
            setColumnEditorOpen(false);
          },
          onError: (e) => {
            const msg =
              e instanceof HttpError
                ? e.message
                : "Não foi possível salvar a coluna.";
            setColumnEditorError(msg);
            toast.error(msg);
          },
        },
      );
    }
  };

  const handleReorderColumn = (columnId: string, direction: -1 | 1) => {
    if (columnId === UNASSIGNED) return;
    const real = sortedReal;
    const idx = real.findIndex((c) => c.id === columnId);
    const j = idx + direction;
    if (idx < 0 || j < 0 || j >= real.length) return;
    const next = [...real];
    [next[idx], next[j]] = [next[j], next[idx]];
    reorder.mutate(
      {
        column_ids: next.map((c) => c.id),
        order: next.map((c) => c.id),
        ids: next.map((c) => c.id),
      },
      {
        onSuccess: () => toast.success("Ordem das colunas atualizada."),
        onError: (e) => {
          toast.error(
            e instanceof HttpError
              ? e.message
              : "Não foi possível reordenar colunas.",
          );
        },
      },
    );
  };

  const handleMoveCard = useCallback(
    ({
      cardId,
      targetColumnId,
      orderIndex,
    }: {
      cardId: string;
      targetColumnId: string;
      orderIndex: number;
    }) => {
      move.mutate(
        {
          id: cardId,
          body: {
            id_column: targetColumnId,
            column_id: targetColumnId,
            target_column_id: targetColumnId,
            order_index: orderIndex,
            position: orderIndex,
            index: orderIndex,
          },
        },
        {
          onError: (e) => {
            toast.error(
              e instanceof HttpError
                ? e.message
                : "Não foi possível mover o card.",
            );
          },
        },
      );
    },
    [move],
  );

  const openCardDetail = (card: KanbanCardUi) => {
    setDetailCard(card);
    setDetailOpen(true);
  };

  const boardLoading = colsQ.isPending || cardsQ.isPending;
  const boardError = colsQ.isError || cardsQ.isError;
  const boardErr =
    (colsQ.error instanceof Error ? colsQ.error : null) ??
    (cardsQ.error instanceof Error ? cardsQ.error : null);

  const submitLabelForm = (payload: { name: string; color: string }) => {
    if (labelFormMode === "create") {
      labelMut.create.mutate(
        { name: payload.name, color: payload.color },
        {
          onSuccess: () => {
            toast.success("Etiqueta criada.");
            setLabelFormOpen(false);
          },
          onError: (e) => {
            toast.error(
              e instanceof HttpError
                ? e.message
                : "Não foi possível criar a etiqueta.",
            );
          },
        },
      );
    } else if (labelEditing) {
      labelMut.update.mutate(
        {
          id: labelEditing.id,
          body: { name: payload.name, color: payload.color },
        },
        {
          onSuccess: () => {
            toast.success("Etiqueta atualizada.");
            setLabelFormOpen(false);
          },
          onError: (e) => {
            toast.error(
              e instanceof HttpError
                ? e.message
                : "Não foi possível salvar a etiqueta.",
            );
          },
        },
      );
    }
  };

  const confirmAction = () => {
    if (!confirm) return;
    if (confirm.kind === "column") {
      removeCol.mutate(confirm.column.id, {
        onSuccess: () => {
          toast.success("Coluna removida.");
          setConfirm(null);
        },
        onError: (e) => {
          toast.error(
            e instanceof HttpError
              ? e.message
              : "Não foi possível excluir a coluna.",
          );
        },
      });
    } else if (confirm.kind === "card") {
      removeCard.mutate(confirm.card.id, {
        onSuccess: () => {
          toast.success("Card excluído.");
          setConfirm(null);
        },
        onError: (e) => {
          toast.error(
            e instanceof HttpError
              ? e.message
              : "Não foi possível excluir o card.",
          );
        },
      });
    } else if (confirm.kind === "label") {
      labelMut.remove.mutate(confirm.label.id, {
        onSuccess: () => {
          toast.success("Etiqueta excluída.");
          setConfirm(null);
        },
        onError: (e) => {
          toast.error(
            e instanceof HttpError
              ? e.message
              : "Não foi possível excluir a etiqueta.",
          );
        },
      });
    } else if (confirm.kind === "profile") {
      removeProfile.mutate(confirm.clientId, {
        onSuccess: () => {
          toast.success("Configuração do Kanban removida para o cliente.");
          setConfirm(null);
          void clientsQ.refetch();
        },
        onError: (e) => {
          const msg =
            e instanceof HttpError
              ? e.message
              : "Não foi possível remover a configuração.";
          setClientProfileError(msg);
          toast.error(msg);
        },
      });
    }
  };

  if (boardError) {
    return (
      <div className="hk-page flex flex-col gap-6 py-8">
        <KanbanPageHeader />
        <KanbanErrorState
          error={boardErr}
          onRetry={() => {
            void colsQ.refetch();
            void cardsQ.refetch();
          }}
        />
      </div>
    );
  }

  const detailColumn = detailCard
    ? displayColumns.find((c) => c.id === detailCard.columnId)
    : undefined;

  const boardTab = (
    <div className="space-y-6">
      <KanbanFiltersToolbar
        value={filters}
        onChange={setFilters}
        weekOptions={weekOpts}
        clients={clients}
        team={team}
        onNewColumn={openCreateColumn}
        onNewCard={() => {
          setCreateDefaultColumnId(sortedReal[0]?.id);
          setCardFormError(null);
          setCreateCardOpen(true);
        }}
        newCardDisabled={sortedReal.length === 0}
      />

      {sortedReal.length === 0 ? (
        <KanbanEmptyBoardState onCreateColumn={openCreateColumn} />
      ) : boardLoading ? (
        <KanbanBoardSkeleton />
      ) : (
        <>
          <KanbanBoard
            columns={displayColumns}
            cards={filteredCards}
            labels={labelsUi}
            onOpenCard={openCardDetail}
            onAddCard={(columnId) => {
              setCreateDefaultColumnId(
                columnId === UNASSIGNED ? sortedReal[0]?.id : columnId,
              );
              setCardFormError(null);
              setCreateCardOpen(true);
            }}
            onEditColumn={(col) => {
              if (col.id === UNASSIGNED) return;
              setColumnEditorMode("edit");
              setColumnEditing(col);
              setColumnEditorError(null);
              setColumnEditorOpen(true);
            }}
            onDeleteColumn={(col) => {
              if (col.id === UNASSIGNED) return;
              setConfirm({ kind: "column", column: col });
            }}
            onReorderColumn={handleReorderColumn}
            moveCard={handleMoveCard}
            movePending={move.isPending}
          />
          {allCardsUi.length > 0 && filteredCards.length === 0 ? (
            <p className="text-center text-sm text-hk-muted">
              Nenhum card corresponde aos filtros. Limpe a busca ou amplie
              critérios.
            </p>
          ) : null}
          {allCardsUi.length === 0 && sortedReal.length > 0 ? (
            <p className="text-center text-sm text-hk-muted">
              Nenhum card ainda. Use &quot;Novo card&quot; para começar.
            </p>
          ) : null}
        </>
      )}
    </div>
  );

  const clientsTab =
    clientsQ.isError ? (
      <KanbanErrorState
        error={
          clientsQ.error instanceof Error ? clientsQ.error : new Error("Erro")
        }
        onRetry={() => void clientsQ.refetch()}
      />
    ) : (
      <KanbanClientsPanel
        clients={clients}
        team={team}
        selectedId={selectedClientId}
        onSelectClient={setSelectedClientId}
        onSaveProfile={(body) => {
          if (!selectedClientId) return;
          setClientProfileError(null);
          putProfile.mutate(
            { idCustomer: selectedClientId, body },
            {
              onSuccess: () => {
                toast.success("Configuração salva.");
                void clientsQ.refetch();
              },
              onError: (e) => {
                const msg =
                  e instanceof HttpError
                    ? e.message
                    : "Não foi possível salvar a configuração.";
                setClientProfileError(msg);
                toast.error(msg);
              },
            },
          );
        }}
        onRequestRemoveProfile={() => {
          const c = clients.find((x) => x.id === selectedClientId);
          if (!c) return;
          setConfirm({
            kind: "profile",
            clientId: c.id,
            clientName: c.name,
          });
        }}
        savePending={putProfile.isPending}
        removePending={removeProfile.isPending}
        listLoading={clientsQ.isPending}
        configLoading={false}
        errorMessage={clientProfileError}
      />
    );

  const labelsTab = (
    <>
      <KanbanLabelsPanel
        labels={labelsUi}
        loading={labelsQ.isPending}
        error={
          labelsQ.isError
            ? labelsQ.error instanceof Error
              ? labelsQ.error
              : new Error("Erro")
            : null
        }
        onRetry={() => void labelsQ.refetch()}
        onOpenCreate={() => {
          setLabelFormMode("create");
          setLabelEditing(null);
          setLabelFormOpen(true);
        }}
        onOpenEdit={(l) => {
          setLabelFormMode("edit");
          setLabelEditing(l);
          setLabelFormOpen(true);
        }}
        onRequestDelete={(l) => setConfirm({ kind: "label", label: l })}
        emptyHint
      />
      <KanbanLabelForm
        open={labelFormOpen}
        onOpenChange={setLabelFormOpen}
        mode={labelFormMode}
        label={labelEditing}
        onSubmit={submitLabelForm}
        isPending={labelMut.create.isPending || labelMut.update.isPending}
      />
    </>
  );

  return (
    <div className="hk-page flex flex-col gap-8 py-8">
      <KanbanPageHeader />

      <KanbanTabs
        value={tab}
        onValueChange={setTab}
        board={boardTab}
        clients={clientsTab}
        labels={labelsTab}
      />

      <KanbanColumnEditor
        open={columnEditorOpen}
        onOpenChange={setColumnEditorOpen}
        mode={columnEditorMode}
        column={columnEditing}
        onSubmit={submitColumn}
        isPending={createCol.isPending || updateCol.isPending}
        errorMessage={columnEditorError}
      />

      <KanbanCreateCardFlow
        open={createCardOpen}
        onOpenChange={(o) => {
          setCreateCardOpen(o);
          if (!o) setCardFormError(null);
        }}
        defaultColumnId={createDefaultColumnId}
        columns={displayColumns}
        labels={labelsUi}
        clients={clients}
        team={team}
        onCreate={(body) => {
          setCardFormError(null);
          createCard.mutate(body, {
            onSuccess: () => {
              toast.success("Card criado.");
              setCreateCardOpen(false);
            },
            onError: (e) => {
              const msg =
                e instanceof HttpError
                  ? e.message
                  : "Não foi possível criar o card.";
              setCardFormError(msg);
              toast.error(msg);
            },
          });
        }}
        isPending={createCard.isPending}
        errorMessage={cardFormError}
      />

      <KanbanEditCardFlow
        open={editCardOpen && !!editCard}
        onOpenChange={(o) => {
          setEditCardOpen(o);
          if (!o) {
            setEditCard(null);
            setCardFormError(null);
          }
        }}
        card={editCard}
        columns={displayColumns}
        labels={labelsUi}
        clients={clients}
        team={team}
        onUpdate={(id, body) => {
          setCardFormError(null);
          updateCard.mutate(
            { id, body },
            {
              onSuccess: () => {
                toast.success("Card atualizado.");
                setEditCardOpen(false);
                setEditCard(null);
              },
              onError: (e) => {
                const msg =
                  e instanceof HttpError
                    ? e.message
                    : "Não foi possível salvar o card.";
                setCardFormError(msg);
                toast.error(msg);
              },
            },
          );
        }}
        isPending={updateCard.isPending}
        errorMessage={cardFormError}
      />

      <KanbanCardDetailsDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        card={detailCard}
        column={detailColumn}
        labels={labelsUi}
        onEdit={() => {
          if (detailCard) {
            setEditCard(detailCard);
            setEditCardOpen(true);
            setCardFormError(null);
          }
        }}
        onDelete={() => {
          if (detailCard) setConfirm({ kind: "card", card: detailCard });
        }}
        onMoveRequest={() =>
          toast.message("Arraste o card entre colunas no quadro.", {
            duration: 4000,
          })
        }
      />

      <KanbanConfirmDialog
        open={confirm !== null}
        onOpenChange={(o) => {
          if (!o) setConfirm(null);
        }}
        title={
          confirm?.kind === "column"
            ? "Excluir coluna?"
            : confirm?.kind === "card"
              ? "Excluir card?"
              : confirm?.kind === "label"
                ? "Excluir etiqueta?"
                : confirm?.kind === "profile"
                  ? "Remover configuração do Kanban?"
                  : "Confirmar"
        }
        description={
          confirm?.kind === "column"
            ? `A coluna "${confirm.column.name}" será removida. Verifique na API o efeito sobre os cards.`
            : confirm?.kind === "card"
              ? `O card "${confirm.card.title}" será excluído.`
              : confirm?.kind === "label"
                ? `A etiqueta "${confirm.label.name}" será removida.`
                : confirm?.kind === "profile"
                  ? `Remover papéis operacionais definidos para ${confirm.clientName} neste módulo.`
                  : ""
        }
        confirmLabel="Confirmar"
        onConfirm={confirmAction}
        isPending={
          removeCol.isPending ||
          removeCard.isPending ||
          labelMut.remove.isPending ||
          removeProfile.isPending
        }
        destructive
      />
    </div>
  );
}
