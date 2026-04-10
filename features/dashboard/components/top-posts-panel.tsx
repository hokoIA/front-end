"use client";

import type { ContentPostRow } from "@/features/dashboard/types";
import {
  formatCompactNumber,
  formatDisplayDate,
} from "@/features/dashboard/utils/format";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

type TopPostsPanelProps = {
  posts: ContentPostRow[];
  loading?: boolean;
  className?: string;
};

export function TopPostsPanel({ posts, loading, className }: TopPostsPanelProps) {
  return (
    <section
      className={cn(
        "space-y-4 rounded-xl border border-hk-border bg-hk-surface p-4 shadow-hk-sm md:p-5",
        className,
      )}
    >
      <div>
        <h2 className="text-base font-semibold text-hk-deep">
          Destaques do período
        </h2>
        <p className="mt-1 text-sm text-hk-muted">
          Os três conteúdos com melhor sinal composto de engajamento e alcance
          (heurística local até o backend expor ranking oficial).
        </p>
      </div>
      {loading ? (
        <p className="text-sm text-hk-muted">Carregando publicações…</p>
      ) : posts.length === 0 ? (
        <p className="text-sm text-hk-muted">
          Nenhum conteúdo retornado para o período.
        </p>
      ) : (
        <ul className="grid gap-3 md:grid-cols-3">
          {posts.map((p, idx) => (
            <li
              key={p.id}
              className="flex flex-col rounded-lg border border-hk-border-subtle bg-hk-canvas/30 p-3"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <Badge variant="secondary" className="text-[10px] font-medium">
                  {p.platform}
                </Badge>
                <span className="text-[10px] font-medium text-hk-lime">
                  #{idx + 1}
                </span>
              </div>
              <p className="line-clamp-3 text-sm font-medium leading-snug text-hk-deep">
                {p.title}
              </p>
              <p className="mt-2 text-[11px] text-hk-muted">
                {formatDisplayDate(p.date)} · {p.type}
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-hk-muted">
                <div>
                  <dt className="text-hk-muted">Alcance</dt>
                  <dd className="font-medium text-hk-ink">
                    {formatCompactNumber(p.reach)}
                  </dd>
                </div>
                <div>
                  <dt className="text-hk-muted">Curtidas</dt>
                  <dd className="font-medium text-hk-ink">
                    {formatCompactNumber(p.likes)}
                  </dd>
                </div>
                <div>
                  <dt className="text-hk-muted">Comentários</dt>
                  <dd className="font-medium text-hk-ink">
                    {formatCompactNumber(p.comments)}
                  </dd>
                </div>
                <div>
                  <dt className="text-hk-muted">Compart.</dt>
                  <dd className="font-medium text-hk-ink">
                    {formatCompactNumber(p.shares)}
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
