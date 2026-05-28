"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSelectedCustomer } from "@/components/providers/selected-customer-provider";
import { PlatformBadge } from "@/components/platforms/platform-badge";
import { useGoalsQuery } from "@/hooks/api/use-goals-queries";
import { useKanbanBoardDataQuery } from "@/hooks/api/use-kanban-queries";
import { useTeamMembersQuery } from "@/hooks/api/use-team-queries";
import { useCustomersIntegrationSummaries } from "@/features/integrations/hooks/use-customers-integration-summaries";
import type { CustomerIntegrationSummary } from "@/features/integrations/types/customer-summary";
import { normalizeGoal } from "@/features/goals/utils/normalize-goal";
import {
  normalizeKanbanCard,
  normalizeKanbanColumn,
} from "@/features/kanban/utils/normalize";
import type {
  IntegrationOperationalState,
  IntegrationSurface,
} from "@/features/dashboard/types";
import type { GoalUiModel } from "@/features/goals/types/ui";
import type { KanbanCardUi, KanbanColumnUi } from "@/features/kanban/types/ui";
import { cn } from "@/lib/utils/cn";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  CircleDot,
  Clock3,
  Columns3,
  Home,
  LineChart,
  PlugZap,
  Target,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

const SURFACES: IntegrationSurface[] = [
  "facebook",
  "instagram",
  "meta_ads",
  "google_analytics",
  "linkedin",
  "youtube",
];

const SURFACE_LABEL: Record<IntegrationSurface, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  meta_ads: "Meta Ads",
  google_analytics: "Google Analytics",
  linkedin: "LinkedIn",
  youtube: "YouTube",
};

type PriorityTone = "danger" | "warning" | "info" | "success";

type PriorityItem = {
  id: string;
  title: string;
  eyebrow: string;
  detail: string;
  href: string;
  tone: PriorityTone;
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function addDaysKey(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function dateKey(value?: string | null) {
  if (!value) return null;
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return null;
  return new Date(parsed).toISOString().slice(0, 10);
}

function daysBetween(startKey: string, endKey: string) {
  const start = Date.parse(`${startKey}T00:00:00.000Z`);
  const end = Date.parse(`${endKey}T00:00:00.000Z`);
  return Math.round((end - start) / 86_400_000);
}

function formatDate(value?: string | null) {
  const key = dateKey(value);
  if (!key) return "Sem prazo";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(`${key}T00:00:00.000Z`));
}

function statusLabel(state: IntegrationOperationalState) {
  if (state === "connected") return "conectadas";
  if (state === "authorized") return "autorizadas";
  if (state === "needs_renewal") return "renovar";
  if (state === "disconnected") return "desconectadas";
  return "sem leitura";
}

function goalCustomerName(goal: GoalUiModel, customers: { id_customer: string; name: string }[]) {
  return (
    goal.customerName ??
    customers.find((customer) => customer.id_customer === goal.customerId)?.name ??
    "Todos os clientes"
  );
}

function isTerminalColumn(column?: KanbanColumnUi) {
  const name = (column?.name ?? "").toLowerCase();
  return [
    "conclu",
    "aprov",
    "public",
    "finaliz",
    "done",
    "entreg",
  ].some((fragment) => name.includes(fragment));
}

function unwrapRows(data: unknown, keys: string[]) {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];
  const record = data as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) return value;
  }
  return [];
}

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
  tone = "info",
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  detail: string;
  tone?: PriorityTone;
}) {
  return (
    <div className="rounded-lg border border-hk-border bg-hk-surface px-4 py-3 shadow-hk-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="hk-overline truncate">{label}</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-hk-deep">
            {value}
          </p>
        </div>
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg",
            tone === "danger" && "bg-hk-danger-soft text-hk-danger",
            tone === "warning" && "bg-hk-warning-soft text-hk-warning",
            tone === "success" && "bg-hk-success-soft text-hk-success",
            tone === "info" && "bg-hk-info-soft text-hk-info",
          )}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 min-h-9 text-sm leading-5 text-hk-muted">{detail}</p>
    </div>
  );
}

function PriorityRow({ item }: { item: PriorityItem }) {
  return (
    <Link
      href={item.href}
      className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-hk-border-subtle bg-hk-surface px-3 py-3 transition-colors hover:border-hk-border hover:bg-hk-surface-muted/70"
    >
      <span
        className={cn(
          "size-2.5 rounded-full",
          item.tone === "danger" && "bg-hk-danger",
          item.tone === "warning" && "bg-hk-warning",
          item.tone === "info" && "bg-hk-info",
          item.tone === "success" && "bg-hk-success",
        )}
      />
      <span className="min-w-0">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.09em] text-hk-muted">
          {item.eyebrow}
        </span>
        <span className="mt-0.5 block truncate text-sm font-semibold text-hk-deep">
          {item.title}
        </span>
        <span className="mt-0.5 block truncate text-xs text-hk-muted">
          {item.detail}
        </span>
      </span>
      <ArrowRight className="size-4 text-hk-muted transition-colors group-hover:text-hk-action" />
    </Link>
  );
}

function EmptyLine({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-hk-border-subtle bg-hk-surface-muted/60 px-3 py-4 text-sm text-hk-muted">
      {children}
    </div>
  );
}

export function HomeOverviewView() {
  const {
    customers,
    isReady,
    isLoadingCustomers,
  } = useSelectedCustomer();

  const customerIds = useMemo(
    () => customers.map((customer) => customer.id_customer).filter(Boolean),
    [customers],
  );
  const integrationSummaries = useCustomersIntegrationSummaries(customerIds);
  const goalsQ = useGoalsQuery(isReady);
  const kanbanQ = useKanbanBoardDataQuery(isReady);
  const teamQ = useTeamMembersQuery(isReady);

  const rawGoals = goalsQ.data;
  const goals = useMemo(
    () => (rawGoals ?? []).map((goal, index) => normalizeGoal(goal, index)),
    [rawGoals],
  );

  const boardData = kanbanQ.data;
  const rawKanbanCards = useMemo(
    () => unwrapRows(boardData, ["cards"]),
    [boardData],
  );
  const rawKanbanColumns = useMemo(
    () => unwrapRows(boardData, ["columns"]),
    [boardData],
  );

  const kanbanCards = useMemo(
    () => rawKanbanCards.map((card, index) => normalizeKanbanCard(card, index)),
    [rawKanbanCards],
  );
  const kanbanColumns = useMemo(
    () =>
      rawKanbanColumns.map((column, index) =>
        normalizeKanbanColumn(column, index),
      ),
    [rawKanbanColumns],
  );

  const teamCount = useMemo(
    () => unwrapRows(teamQ.data, ["members", "team", "users", "data"]).length,
    [teamQ.data],
  );

  const customersById = useMemo(() => {
    const map = new Map<string, string>();
    customers.forEach((customer) => map.set(customer.id_customer, customer.name));
    return map;
  }, [customers]);

  const summaries = useMemo(
    () =>
      customerIds
        .map((id) => integrationSummaries.byId.get(id))
        .filter(
          (summary): summary is CustomerIntegrationSummary =>
            summary !== undefined,
        ),
    [customerIds, integrationSummaries.byId],
  );

  const integrationStats = useMemo(() => {
    const perSurface = SURFACES.map((surface) => {
      let connected = 0;
      let authorized = 0;
      let renewal = 0;
      let disconnected = 0;
      let unknown = 0;

      for (const summary of summaries) {
        const state = summary.surfaces[surface];
        if (state === "connected") connected += 1;
        else if (state === "authorized") authorized += 1;
        else if (state === "needs_renewal") renewal += 1;
        else if (state === "disconnected") disconnected += 1;
        else unknown += 1;
      }

      return { surface, connected, authorized, renewal, disconnected, unknown };
    });

    const connectedSurfaces = summaries.reduce(
      (total, summary) => total + summary.connectedCount,
      0,
    );
    const trackedSurfaces = summaries.length * SURFACES.length;
    const renewalCustomers = summaries.filter(
      (summary) => summary.renewalCount > 0,
    );
    const incompleteCustomers = summaries.filter(
      (summary) => summary.connectedCount === 0,
    ).length;

    return {
      perSurface,
      connectedSurfaces,
      trackedSurfaces,
      health:
        trackedSurfaces > 0
          ? Math.round((connectedSurfaces / trackedSurfaces) * 100)
          : 0,
      renewalCustomers,
      incompleteCustomers,
    };
  }, [summaries]);

  const today = todayKey();
  const nextWeek = addDaysKey(7);
  const nextFortnight = addDaysKey(14);

  const activeGoals = useMemo(
    () => goals.filter((goal) => goal.status === "active"),
    [goals],
  );

  const goalTiming = useMemo(() => {
    const overdue: GoalUiModel[] = [];
    const dueSoon: GoalUiModel[] = [];
    const readyForFinal: GoalUiModel[] = [];

    for (const goal of activeGoals) {
      const end = dateKey(goal.endDate);
      if (!end) continue;
      if (end < today) overdue.push(goal);
      if (end >= today && end <= nextFortnight) dueSoon.push(goal);
      if (end <= today && goal.analyses.length === 0) readyForFinal.push(goal);
    }

    const byEndDate = (a: GoalUiModel, b: GoalUiModel) =>
      String(a.endDate ?? "").localeCompare(String(b.endDate ?? ""));

    return {
      overdue: overdue.sort(byEndDate),
      dueSoon: dueSoon.sort(byEndDate),
      readyForFinal: readyForFinal.sort(byEndDate),
    };
  }, [activeGoals, nextFortnight, today]);

  const kanbanTiming = useMemo(() => {
    const columnsById = new Map(
      kanbanColumns.map((column) => [column.id, column]),
    );
    const openCards = kanbanCards.filter(
      (card) => !isTerminalColumn(columnsById.get(card.columnId)),
    );
    const overdue = openCards.filter((card) => {
      const due = dateKey(card.dueDate);
      return due ? due < today : false;
    });
    const dueSoon = openCards.filter((card) => {
      const due = dateKey(card.dueDate);
      return due ? due >= today && due <= nextWeek : false;
    });

    const byDue = (a: KanbanCardUi, b: KanbanCardUi) =>
      String(a.dueDate ?? "9999-99-99").localeCompare(
        String(b.dueDate ?? "9999-99-99"),
      );

    return {
      openCards,
      overdue: overdue.sort(byDue),
      dueSoon: dueSoon.sort(byDue),
      columnsById,
    };
  }, [kanbanCards, kanbanColumns, nextWeek, today]);

  const priorityItems = useMemo<PriorityItem[]>(() => {
    const renewalItems = integrationStats.renewalCustomers
      .slice(0, 3)
      .map((summary) => ({
        id: `renewal-${summary.customerId}`,
        title: customersById.get(summary.customerId) ?? "Cliente",
        eyebrow: "Conexão para renovar",
        detail: `${summary.renewalCount} plataforma${summary.renewalCount === 1 ? "" : "s"} com atenção`,
        href: "/clientes",
        tone: "danger" as const,
      }));

    const overdueGoals = goalTiming.readyForFinal.slice(0, 3).map((goal) => ({
      id: `goal-${goal.id}`,
      title: goal.title,
      eyebrow: "Meta vencida",
      detail: `${goalCustomerName(goal, customers)} · fim em ${formatDate(goal.endDate)}`,
      href: "/metas",
      tone: "warning" as const,
    }));

    const dueCards = [...kanbanTiming.overdue, ...kanbanTiming.dueSoon]
      .slice(0, 4)
      .map((card) => {
        const due = dateKey(card.dueDate);
        const late = due ? due < today : false;
        return {
          id: `card-${card.id}`,
          title: card.title,
          eyebrow: late ? "Card atrasado" : "Card próximo",
          detail: `${card.customerName ?? "Sem cliente"} · ${formatDate(card.dueDate)}`,
          href: "/kanban",
          tone: late ? ("danger" as const) : ("info" as const),
        };
      });

    return [...renewalItems, ...overdueGoals, ...dueCards].slice(0, 8);
  }, [
    customers,
    customersById,
    goalTiming.readyForFinal,
    integrationStats.renewalCustomers,
    kanbanTiming.dueSoon,
    kanbanTiming.overdue,
    today,
  ]);

  const loading =
    !isReady ||
    isLoadingCustomers ||
    integrationSummaries.isLoading ||
    goalsQ.isPending ||
    kanbanQ.isPending ||
    teamQ.isPending;

  const platformHealthDetail =
    integrationStats.trackedSurfaces > 0
      ? `${integrationStats.connectedSurfaces} de ${integrationStats.trackedSurfaces} conexões ativas`
      : "Aguardando clientes com integrações";

  return (
    <main className="hk-page space-y-6 pb-16 pt-4 lg:space-y-7 lg:pt-5">
      <section className="flex flex-col gap-4 border-b border-hk-border pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="info" className="gap-1.5">
              <Home className="size-3.5" />
              Início
            </Badge>
            <span className="text-xs font-medium text-hk-muted">
              {new Intl.DateTimeFormat("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
              }).format(new Date())}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="secondary">
            <Link href="/clientes">
              <UsersRound className="size-4" />
              Clientes
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">
              <LineChart className="size-4" />
              Dashboard
            </Link>
          </Button>
        </div>
      </section>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="hk-skeleton h-32 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={UsersRound}
            label="Clientes"
            value={customers.length}
            detail={`${integrationStats.incompleteCustomers} sem conexão ativa detectada`}
            tone={customers.length > 0 ? "success" : "warning"}
          />
          <StatCard
            icon={PlugZap}
            label="Saúde das plataformas"
            value={`${integrationStats.health}%`}
            detail={platformHealthDetail}
            tone={
              integrationStats.renewalCustomers.length > 0 ? "warning" : "info"
            }
          />
          <StatCard
            icon={Target}
            label="Metas em atenção"
            value={goalTiming.overdue.length + goalTiming.dueSoon.length}
            detail={`${activeGoals.length} metas ativas no planejamento`}
            tone={goalTiming.overdue.length > 0 ? "danger" : "warning"}
          />
          <StatCard
            icon={Columns3}
            label="Cards abertos"
            value={kanbanTiming.openCards.length}
            detail={`${kanbanTiming.overdue.length} atrasados · ${kanbanTiming.dueSoon.length} vencem em 7 dias`}
            tone={kanbanTiming.overdue.length > 0 ? "danger" : "info"}
          />
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(22rem,0.75fr)]">
        <section className="space-y-3 rounded-lg border border-hk-border bg-hk-surface p-4 shadow-hk-sm md:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-hk-deep">
                Painel de atenção
              </h2>
              <p className="text-sm text-hk-muted">
                Prioridade operacional calculada a partir dos dados já carregados.
              </p>
            </div>
            <AlertTriangle className="size-5 text-hk-warning" />
          </div>

          <div className="grid gap-2">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="hk-skeleton h-[76px] rounded-lg" />
              ))
            ) : priorityItems.length > 0 ? (
              priorityItems.map((item) => (
                <PriorityRow key={item.id} item={item} />
              ))
            ) : (
              <EmptyLine>
                Nenhuma prioridade crítica encontrada nas conexões, metas ou
                cards abertos.
              </EmptyLine>
            )}
          </div>
        </section>

        <section className="space-y-3 rounded-lg border border-hk-border bg-hk-surface p-4 shadow-hk-sm md:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-hk-deep">
                Saúde das plataformas
              </h2>
              <p className="text-sm text-hk-muted">
                Leitura por plataforma nos clientes monitorados.
              </p>
            </div>
            <CheckCircle2 className="size-5 text-hk-success" />
          </div>

          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="hk-skeleton h-12 rounded-lg" />
              ))
            ) : summaries.length === 0 ? (
              <EmptyLine>Sem status de plataformas disponível agora.</EmptyLine>
            ) : (
              integrationStats.perSurface.map((row) => {
                const total = summaries.length || 1;
                const width = Math.max(
                  5,
                  Math.round(((row.connected + row.authorized) / total) * 100),
                );
                const alertCount = row.renewal + row.unknown;
                return (
                  <div key={row.surface} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <PlatformBadge
                        platform={row.surface}
                        label={SURFACE_LABEL[row.surface]}
                      />
                      <span className="text-xs font-medium text-hk-muted">
                        {row.connected + row.authorized} {statusLabel("connected")}
                        {alertCount > 0 ? ` · ${alertCount} em atenção` : ""}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-hk-surface-strong">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          alertCount > 0 ? "bg-hk-warning" : "bg-hk-success",
                        )}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <section className="space-y-3 rounded-lg border border-hk-border bg-hk-surface p-4 shadow-hk-sm md:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-hk-deep">
                Metas chegando ao fim
              </h2>
              <p className="text-sm text-hk-muted">
                Próximos encerramentos e análises pendentes.
              </p>
            </div>
            <CalendarClock className="size-5 text-hk-action" />
          </div>

          <div className="space-y-2">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="hk-skeleton h-16 rounded-lg" />
              ))
            ) : [...goalTiming.overdue, ...goalTiming.dueSoon].length > 0 ? (
              [...goalTiming.overdue, ...goalTiming.dueSoon]
                .slice(0, 5)
                .map((goal) => {
                  const end = dateKey(goal.endDate);
                  const days = end ? daysBetween(today, end) : null;
                  return (
                    <Link
                      key={goal.id}
                      href="/metas"
                      className="block rounded-lg border border-hk-border-subtle px-3 py-3 transition-colors hover:border-hk-border hover:bg-hk-surface-muted/70"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-hk-deep">
                            {goal.title}
                          </p>
                          <p className="mt-1 truncate text-xs text-hk-muted">
                            {goalCustomerName(goal, customers)}
                          </p>
                        </div>
                        <Badge
                          variant={days !== null && days < 0 ? "secondary" : "info"}
                          className="shrink-0"
                        >
                          {formatDate(goal.endDate)}
                        </Badge>
                      </div>
                    </Link>
                  );
                })
            ) : (
              <EmptyLine>Nenhuma meta ativa vencendo nos próximos 14 dias.</EmptyLine>
            )}
          </div>
        </section>

        <section className="space-y-3 rounded-lg border border-hk-border bg-hk-surface p-4 shadow-hk-sm md:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-hk-deep">
                Kanban em movimento
              </h2>
              <p className="text-sm text-hk-muted">
                Cards com prazo próximo ou vencido.
              </p>
            </div>
            <Clock3 className="size-5 text-hk-info" />
          </div>

          <div className="space-y-2">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="hk-skeleton h-16 rounded-lg" />
              ))
            ) : [...kanbanTiming.overdue, ...kanbanTiming.dueSoon].length > 0 ? (
              [...kanbanTiming.overdue, ...kanbanTiming.dueSoon]
                .slice(0, 5)
                .map((card) => (
                  <Link
                    key={card.id}
                    href="/kanban"
                    className="block rounded-lg border border-hk-border-subtle px-3 py-3 transition-colors hover:border-hk-border hover:bg-hk-surface-muted/70"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-hk-deep">
                          {card.title}
                        </p>
                        <p className="mt-1 truncate text-xs text-hk-muted">
                          {card.customerName ?? "Sem cliente"} ·{" "}
                          {kanbanTiming.columnsById.get(card.columnId)?.name ??
                            "Sem coluna"}
                        </p>
                      </div>
                      <Badge variant="outline" className="shrink-0">
                        {formatDate(card.dueDate)}
                      </Badge>
                    </div>
                  </Link>
                ))
            ) : (
              <EmptyLine>Nenhum card aberto vencendo nos próximos 7 dias.</EmptyLine>
            )}
          </div>
        </section>

        <section className="space-y-3 rounded-lg border border-hk-border bg-hk-surface p-4 shadow-hk-sm md:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-hk-deep">
                Base operacional
              </h2>
              <p className="text-sm text-hk-muted">
                Cobertura geral do workspace.
              </p>
            </div>
            <CircleDot className="size-5 text-hk-lime" />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between rounded-lg border border-hk-border-subtle px-3 py-3">
              <span className="text-sm font-medium text-hk-muted">Equipe</span>
              <span className="text-lg font-semibold tabular-nums text-hk-deep">
                {loading ? "…" : teamCount}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-hk-border-subtle px-3 py-3">
              <span className="text-sm font-medium text-hk-muted">
                Metas ativas
              </span>
              <span className="text-lg font-semibold tabular-nums text-hk-deep">
                {loading ? "…" : activeGoals.length}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-hk-border-subtle px-3 py-3">
              <span className="text-sm font-medium text-hk-muted">
                Cards no quadro
              </span>
              <span className="text-lg font-semibold tabular-nums text-hk-deep">
                {loading ? "…" : kanbanCards.length}
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
