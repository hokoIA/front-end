"use client";

import type { ContentPostRow } from "@/features/dashboard/types";
import {
  formatCompactNumber,
  formatDisplayDate,
} from "@/features/dashboard/utils/format";
import { PlatformIconFromLabel } from "@/components/platforms/platform-icon";
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
          Top 3 por engajamento (curtidas, comentários e compartilhamentos)
          combinados na resposta atual.
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
              className="flex flex-col overflow-hidden rounded-lg border border-hk-border-subtle bg-hk-canvas/30"
            >
              {p.coverImage ? (
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-hk-canvas">
                  <img
                    src={p.coverImage}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}
              <div className="flex flex-col p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-2">
                    <PlatformIconFromLabel
                      label={p.platform}
                      plain
                      size="sm"
                    />
                    <span className="truncate text-xs font-medium text-hk-deep">
                      {p.platform}
                    </span>
                  </span>
                  <span className="text-[10px] font-medium text-hk-lime">
                    #{idx + 1}
                  </span>
                </div>
                <p className="line-clamp-3 text-sm font-medium leading-snug text-hk-deep">
                  {p.title}
                </p>
                <p className="mt-2 text-[11px] text-hk-muted">
                  {p.date ? formatDisplayDate(p.date) : "—"} · {p.type}
                </p>
                <dl className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-hk-muted">
                  <div>
                    <dt className="text-hk-muted">Engajamento</dt>
                    <dd className="font-medium text-hk-ink">
                      {formatCompactNumber(p.engagement ?? 0)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-hk-muted">Alcance</dt>
                    <dd className="font-medium text-hk-ink">
                      {p.reach > 0 ? formatCompactNumber(p.reach) : "—"}
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
                </dl>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
