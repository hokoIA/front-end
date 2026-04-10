"use client";

import Link from "next/link";

export function ContextBasePageHeader() {
  return (
    <header className="border-b border-hk-border-subtle pb-6">
      <nav aria-label="Breadcrumb" className="mb-3 text-xs text-hk-muted">
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
          <li className="font-medium text-hk-ink">Base de Contexto</li>
        </ol>
      </nav>
      <h1 className="text-2xl font-semibold tracking-tight text-hk-deep">
        Base de Contexto
      </h1>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-hk-muted">
        Organize, classifique e envie documentos que viram memória estratégica do
        cliente. Quanto mais clara e atualizada a base, melhores serão as
        análises e leituras da IA — métricas sozinhas não contam a história do
        negócio.
      </p>
    </header>
  );
}
