"use client";

import { Brain, FolderKanban, Scale, Sparkles } from "lucide-react";

const ITEMS = [
  {
    icon: Brain,
    title: "Contexto de negócio",
    text: "A IA precisa saber posicionamento, restrições e prioridades — não só números.",
  },
  {
    icon: FolderKanban,
    title: "Governança do acervo",
    text: "Versionamento, validade e status evitam que material velho contamine análises.",
  },
  {
    icon: Scale,
    title: "Oficialidade e confiança",
    text: "Metadados de confiabilidade e visibilidade orientam o que pode sustentar decisão.",
  },
  {
    icon: Sparkles,
    title: "Recuperação no momento certo",
    text: "Classificação, temporalidade e tags ajudam a trazer o documento certo na hora certa.",
  },
];

export function ContextBaseIntroPanel() {
  return (
    <section className="rounded-xl border border-hk-border bg-gradient-to-br from-hk-canvas/90 to-hk-surface p-5 shadow-hk-sm md:p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-hk-action">
        Por que esta página importa
      </p>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-hk-ink">
        Você está ensinando a plataforma o que é relevante sobre cada cliente:
        o que é oficial, o que é histórico, o que está em revisão e o que já
        não deve influenciar relatórios. Pense nesta área como{" "}
        <span className="font-medium text-hk-deep">
          curadoria da memória organizacional
        </span>
        — não como um simples upload.
      </p>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2">
        {ITEMS.map(({ icon: Icon, title, text }) => (
          <li
            key={title}
            className="flex gap-3 rounded-lg border border-hk-border-subtle bg-hk-surface/80 p-3"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-hk-canvas text-hk-action">
              <Icon className="size-4" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-hk-deep">{title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-hk-muted">
                {text}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
