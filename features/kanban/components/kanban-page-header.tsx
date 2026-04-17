"use client";

import Link from "next/link";

export function KanbanPageHeader() {
  return (
    <header className="border-b border-hk-border-subtle pb-6">
      <nav
        aria-label="Breadcrumb"
        className="mb-3 text-xs text-hk-muted"
      >
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link
              href="/dashboard"
              className="transition-colors hover:text-hk-action"
            >
              Início
            </Link>
          </li>
          <li className="text-hk-border" aria-hidden>
            /
          </li>
          <li className="font-medium text-hk-ink">Kanban</li>
        </ol>
      </nav>
      <h1 className="text-2xl font-semibold tracking-tight text-hk-deep md:text-3xl">
        Kanban
      </h1>
      <p className="max-w-3xl text-sm leading-relaxed text-hk-muted md:text-base">
        Central operacional da agência: organize o fluxo de trabalho, vincule
        clientes e etiquetas, e mantenha contexto e execução no mesmo ambiente
        — sem depender de ferramentas externas dispersas.
      </p>
    </header>
  );
}
