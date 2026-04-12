"use client";

import { useCallback, useRef } from "react";

export type DashboardPrintContext = {
  /** Título curto na aba durante a impressão */
  documentTitle?: string;
  customerName?: string | null;
  period?: { start: string; end: string } | null;
};

/**
 * Impressão da visão atual (sem backend): ajusta temporariamente `document.title` e chama `print()`.
 */
export function useDashboardPrint(ctx: DashboardPrintContext) {
  const frozen = useRef<string | null>(null);

  return useCallback(() => {
    const parts = [
      ctx.documentTitle ?? "Dashboard ho.ko",
      ctx.customerName?.trim() || null,
      ctx.period?.start && ctx.period?.end
        ? `${ctx.period.start} — ${ctx.period.end}`
        : null,
    ].filter(Boolean) as string[];
    const nextTitle = parts.join(" · ").slice(0, 120);

    frozen.current = document.title;
    document.title = nextTitle;

    const restore = () => {
      if (frozen.current != null) {
        document.title = frozen.current;
        frozen.current = null;
      }
    };

    window.addEventListener("afterprint", restore, { once: true });
    window.setTimeout(restore, 2000);
    window.print();
  }, [ctx.documentTitle, ctx.customerName, ctx.period?.start, ctx.period?.end]);
}
