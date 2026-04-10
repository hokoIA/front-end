"use client";

import Link from "next/link";

export function AnalysisPageHeader() {
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
          <li className="font-medium text-hk-ink">Análises</li>
        </ol>
      </nav>
      <h1 className="text-2xl font-semibold tracking-tight text-hk-deep">
        Análises
      </h1>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-hk-muted">
        Gere leituras estratégicas do período — narrativa executiva para
        alinhamentos, resultados e relatórios. Esta camada sintetiza o que os
        dados significam para branding, comunicação e negócio, com apoio de IA
        disciplinada (não é chat).
      </p>
      <p className="mt-4 max-w-3xl rounded-lg border border-dashed border-hk-border-subtle bg-hk-canvas/40 px-3 py-2.5 text-xs leading-relaxed text-hk-muted">
        O <span className="font-medium text-hk-ink">Dashboard</span> organiza
        métricas e micro-leituras;{" "}
        <span className="font-medium text-hk-ink">Análises</span> consolida o
        período em narrativa interpretativa — para decisão, justificativa e
        conversa com o cliente.
      </p>
    </header>
  );
}
