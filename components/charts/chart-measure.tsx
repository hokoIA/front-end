"use client";

import { cn } from "@/lib/utils/cn";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type ChartDimensions = { width: number; height: number };

type ChartMeasureProps = {
  minHeight?: number;
  className?: string;
  children: (dim: ChartDimensions) => ReactNode;
  placeholder?: ReactNode;
};

/**
 * Mede o container com ResizeObserver e só então renderiza o Recharts com
 * width/height explícitos — evita `width(-1) height(-1)` do ResponsiveContainer.
 */
export function ChartMeasure({
  minHeight = 260,
  className,
  children,
  placeholder,
}: ChartMeasureProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [dim, setDim] = useState<ChartDimensions | null>(null);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const w = el.clientWidth;
    const h = Math.max(minHeight, el.clientHeight || minHeight);
    if (w > 0 && h > 0) {
      setDim({ width: w, height: h });
    } else {
      setDim(null);
    }
  }, [minHeight]);

  useLayoutEffect(() => {
    measure();
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      measure();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  return (
    <div
      ref={ref}
      className={cn("min-w-0 w-full", className)}
      style={{ minHeight }}
    >
      {dim && dim.width > 0 && dim.height > 0 ? (
        children(dim)
      ) : (
        placeholder ?? (
          <div
            className="flex items-center justify-center text-xs text-hk-muted"
            style={{ minHeight }}
          >
            Carregando gráfico…
          </div>
        )
      )}
    </div>
  );
}
