"use client";

import { cn } from "@/lib/utils/cn";
import { useEffect, useState } from "react";

const STEPS = [
  "Consolidando parâmetros do período",
  "Estruturando leitura executiva",
  "Cruzando dados com o enquadramento estratégico",
  "Interpretando impacto em branding e negócio",
  "Finalizando narrativa para uso em reunião",
];

type Props = {
  active: boolean;
};

export function AnalysisGenerationProgress({ active }: Props) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!active) {
      setIdx(0);
      return;
    }
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % STEPS.length);
    }, 2800);
    return () => clearInterval(t);
  }, [active]);

  if (!active) return null;

  return (
    <div
      className="rounded-xl border border-hk-border bg-hk-surface px-5 py-6 shadow-hk-sm"
      role="status"
      aria-live="polite"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-hk-action">
        Geração em andamento
      </p>
      <p className="mt-2 text-sm font-medium text-hk-deep transition-opacity duration-500">
        {STEPS[idx]}
      </p>
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-hk-border-subtle">
        <div
          className={cn(
            "h-full rounded-full bg-hk-action transition-all duration-700 ease-out",
          )}
          style={{ width: `${((idx + 1) / STEPS.length) * 100}%` }}
        />
      </div>
      <p className="mt-3 text-xs text-hk-muted">
        A ho.ko está montando uma leitura interpretativa — não um bate-papo.
        Isso pode levar alguns instantes.
      </p>
    </div>
  );
}
