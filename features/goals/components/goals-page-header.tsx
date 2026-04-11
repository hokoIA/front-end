"use client";

import { BrainCircuit } from "lucide-react";

export function GoalsPageHeader() {
  return (
    <header className="relative overflow-hidden rounded-xl border border-hk-border bg-gradient-to-br from-hk-surface via-hk-surface to-hk-lime/15 px-6 py-8 shadow-hk-sm">
      <div
        className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-hk-action/8 blur-3xl"
        aria-hidden
      />
      <div className="relative flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-hk-action">
            Metas & planejamentos
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-hk-deep md:text-3xl">
            Planejamento Estratégico
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-hk-muted">
            Organize metas por cliente, alinhe execução às plataformas e
            transforme acompanhamento em análises parciais e finais — prova de
            resultado para reuniões e relatórios.
          </p>
        </div>
        <div className="flex items-start gap-3 rounded-lg border border-hk-border-subtle bg-hk-surface/90 px-4 py-3 text-xs text-hk-muted lg:max-w-sm">
          <BrainCircuit
            className="mt-0.5 h-5 w-5 shrink-0 text-hk-action"
            aria-hidden
          />
          <p>
            <span className="font-medium text-hk-ink">Meta é o plano.</span>{" "}
            Análise é a leitura crítica da execução — descritiva, preditiva e
            prescritiva.
          </p>
        </div>
      </div>
    </header>
  );
}
