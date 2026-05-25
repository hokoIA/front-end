"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/brand/logo";
import { listExternalKanbanCards } from "@/lib/api/kanban";
import { useQuery } from "@tanstack/react-query";
import { Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function formatDate(raw?: string | null) {
  if (!raw) return null;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

function ClientApprovalsContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const cardsQ = useQuery({
    queryKey: ["kanban", "external", token],
    queryFn: () => listExternalKanbanCards(token),
    enabled: Boolean(token),
    retry: false,
  });

  const cards = cardsQ.data?.cards ?? [];
  const clientName = cardsQ.data?.profile?.client_name ?? "Cliente";

  return (
    <main className="min-h-svh bg-hk-canvas">
      <header className="border-b border-hk-border bg-hk-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Logo />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => void cardsQ.refetch()}
            disabled={!token || cardsQ.isFetching}
          >
            {cardsQ.isFetching ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <RefreshCw className="h-4 w-4" aria-hidden />
            )}
            Atualizar
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <p className="text-sm font-medium text-hk-muted">Aprovacoes</p>
          <h1 className="mt-1 text-2xl font-semibold text-hk-deep">
            {clientName}
          </h1>
        </div>

        {!token ? (
          <Card className="border-hk-border">
            <CardContent className="space-y-4 py-8 text-sm text-hk-muted">
              <p>Link invalido.</p>
              <Button asChild variant="outline">
                <Link href="/login">Ir para login</Link>
              </Button>
            </CardContent>
          </Card>
        ) : cardsQ.isPending ? (
          <div className="flex items-center gap-2 text-sm text-hk-muted">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Carregando entregas...
          </div>
        ) : cardsQ.isError ? (
          <Card className="border-hk-border">
            <CardContent className="py-8 text-sm text-hk-muted">
              Nao foi possivel carregar este portal.
            </CardContent>
          </Card>
        ) : cards.length === 0 ? (
          <Card className="border-hk-border">
            <CardContent className="py-8 text-sm text-hk-muted">
              Nenhuma entrega disponivel no momento.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {cards.map((card) => {
              const due = formatDate(card.due_date);
              return (
                <Card key={String(card.id)} className="border-hk-border">
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <CardTitle className="text-base text-hk-deep">
                        {card.title || "Entrega sem titulo"}
                      </CardTitle>
                      {card.column_name ? (
                        <Badge variant="secondary">{card.column_name}</Badge>
                      ) : null}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-hk-muted">
                    {card.copy_text ? (
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {card.copy_text}
                      </p>
                    ) : null}
                    <div className="flex flex-wrap gap-2 text-xs">
                      {card.week ? (
                        <span className="rounded-md border border-hk-border px-2 py-1">
                          {card.week}
                        </span>
                      ) : null}
                      {due ? (
                        <span className="rounded-md border border-hk-border px-2 py-1">
                          Prazo: {due}
                        </span>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default function ClientApprovalsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-svh bg-hk-canvas">
          <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-8 text-sm text-hk-muted sm:px-6">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Carregando...
          </div>
        </main>
      }
    >
      <ClientApprovalsContent />
    </Suspense>
  );
}
