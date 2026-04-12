/**
 * Labels de eixo vindas do backend em:
 * - ISO `YYYY-MM-DD` (alcance / impressões)
 * - GA `YYYYMMDD` (tráfego / busca)
 */

export function parseChartDateLabel(label: string): Date | null {
  const s = String(label ?? "").trim();
  if (!s) return null;
  if (/^\d{8}$/.test(s)) {
    const y = Number(s.slice(0, 4));
    const m = Number(s.slice(4, 6)) - 1;
    const d = Number(s.slice(6, 8));
    const dt = new Date(Date.UTC(y, m, d));
    return Number.isNaN(dt.getTime()) ? null : dt;
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    const dt = new Date(s.slice(0, 10) + "T12:00:00");
    return Number.isNaN(dt.getTime()) ? null : dt;
  }
  const t = Date.parse(s);
  if (Number.isNaN(t)) return null;
  return new Date(t);
}

export function formatChartTooltipDate(label: string): string {
  const d = parseChartDateLabel(label);
  if (!d) return label;
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** Rótulo curto para eixo X (evita texto longo colado). */
export function formatChartAxisTick(label: string): string {
  const d = parseChartDateLabel(label);
  if (!d) return label.length > 8 ? label.slice(0, 8) + "…" : label;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(d);
}

/**
 * Índices de ticks visíveis (~5–8) para períodos longos.
 * Sempre inclui primeiro e último índice.
 */
export function selectAxisTickIndices(length: number, maxTicks = 7): number[] {
  if (length <= 0) return [];
  if (length <= maxTicks) return Array.from({ length }, (_, i) => i);
  const inner = maxTicks - 2;
  const step = Math.max(1, Math.ceil((length - 2) / inner));
  const set = new Set<number>([0, length - 1]);
  for (let i = 0; i < length; i += step) set.add(i);
  set.add(length - 1);
  return Array.from(set).sort((a, b) => a - b);
}

export function shouldShowTickAtIndex(
  index: number,
  length: number,
  maxTicks = 7,
): boolean {
  const picks = selectAxisTickIndices(length, maxTicks);
  return picks.includes(index);
}
