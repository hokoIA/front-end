"use client";

import type { ContentPostRow } from "@/features/dashboard/types";
import { formatCompactNumber } from "@/features/dashboard/utils/format";
import { formatDisplayDate } from "@/features/dashboard/utils/format";
import { PlatformIconFromLabel } from "@/components/platforms/platform-icon";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils/cn";
import {
  CLIENT_PAGE_SIZE_DEFAULT,
  useClientPagination,
} from "@/hooks/use-pagination";
import { ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";

type PostsPerformanceTableProps = {
  posts: ContentPostRow[];
  loading?: boolean;
  className?: string;
};

type SortKey =
  | "date"
  | "engagement"
  | "reach"
  | "likes"
  | "comments"
  | "shares";

export function PostsPerformanceTable({
  posts,
  loading,
  className,
}: PostsPerformanceTableProps) {
  const [platform, setPlatform] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("date");

  const platforms = useMemo(() => {
    const s = new Set(posts.map((p) => p.platform).filter(Boolean));
    return ["all", ...Array.from(s).sort()];
  }, [posts]);

  const rows = useMemo(() => {
    let list =
      platform === "all"
        ? posts
        : posts.filter((p) => p.platform === platform);
    list = [...list];
    list.sort((a, b) => {
      const eng = (p: ContentPostRow) =>
        p.engagement ??
        p.likes + p.comments * 2 + p.shares * 3 + p.reach * 0.001;
      switch (sort) {
        case "reach":
          return b.reach - a.reach;
        case "likes":
          return b.likes - a.likes;
        case "comments":
          return b.comments - a.comments;
        case "shares":
          return b.shares - a.shares;
        case "engagement":
          return eng(b) - eng(a);
        default:
          return b.date.localeCompare(a.date);
      }
    });
    return list;
  }, [posts, platform, sort]);

  const paginationResetKey = `${platform}|${sort}|${posts.length}`;
  const {
    slice: pageRows,
    page,
    pageCount,
    total,
    from,
    to,
    goPrev,
    goNext,
    setPage,
  } = useClientPagination(rows, CLIENT_PAGE_SIZE_DEFAULT, paginationResetKey);

  return (
    <section
      className={cn(
        "space-y-4 rounded-xl border border-hk-border bg-hk-surface p-4 shadow-hk-sm md:p-5",
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-hk-deep">
            Conteúdos do período
          </h2>
          <p className="text-sm text-hk-muted">
            Lista unificada (Facebook + Instagram) com filtros e ordenação
            locais.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="h-9 w-[160px] text-xs">
              <SelectValue placeholder="Plataforma" />
            </SelectTrigger>
            <SelectContent>
              {platforms.map((p) => (
                <SelectItem key={p} value={p}>
                  {p === "all" ? "Todas" : p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="h-9 w-[200px] text-xs">
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Data (recente)</SelectItem>
              <SelectItem value="engagement">Engajamento</SelectItem>
              <SelectItem value="reach">Alcance</SelectItem>
              <SelectItem value="likes">Curtidas</SelectItem>
              <SelectItem value="comments">Comentários</SelectItem>
              <SelectItem value="shares">Compartilhamentos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-hk-muted">Carregando tabela…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-hk-muted">Nenhuma linha para os filtros.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Post</TableHead>
                  <TableHead>Plataforma</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Engaj.</TableHead>
                  <TableHead className="text-right">Curtidas</TableHead>
                  <TableHead className="text-right">Coment.</TableHead>
                  <TableHead className="text-right">Compart.</TableHead>
                  <TableHead className="text-right">Alcance</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.map((p) => {
                  const eng =
                    p.engagement ??
                    p.likes +
                      p.comments * 2 +
                      p.shares * 3 +
                      p.reach * 0.001;
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="whitespace-nowrap text-xs text-hk-muted">
                        {p.date ? formatDisplayDate(p.date) : "—"}
                      </TableCell>
                      <TableCell className="max-w-[220px]">
                        <span className="line-clamp-2 text-sm text-hk-ink">
                          {p.title}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-2">
                          <PlatformIconFromLabel
                            label={p.platform}
                            plain
                            size="sm"
                          />
                          <span className="text-xs font-medium text-hk-deep">
                            {p.platform}
                          </span>
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-hk-muted">
                        {p.type}
                      </TableCell>
                      <TableCell className="text-right text-xs tabular-nums">
                        {formatCompactNumber(eng)}
                      </TableCell>
                      <TableCell className="text-right text-xs tabular-nums">
                        {formatCompactNumber(p.likes)}
                      </TableCell>
                      <TableCell className="text-right text-xs tabular-nums">
                        {formatCompactNumber(p.comments)}
                      </TableCell>
                      <TableCell className="text-right text-xs tabular-nums">
                        {formatCompactNumber(p.shares)}
                      </TableCell>
                      <TableCell className="text-right text-xs tabular-nums">
                        {p.reach > 0 ? formatCompactNumber(p.reach) : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        {p.permalink ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 gap-1 px-2 text-xs text-hk-action"
                            asChild
                          >
                            <a
                              href={p.permalink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Abrir
                              <ExternalLink className="size-3.5" />
                            </a>
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-hk-muted"
                            disabled
                          >
                            —
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <footer className="flex flex-col gap-3 border-t border-hk-border-subtle pt-4 text-xs text-hk-muted sm:flex-row sm:items-center sm:justify-between">
            <p className="tabular-nums">
              {total === 0
                ? "Nenhum item"
                : `Mostrando ${from}–${to} de ${total}`}
            </p>
            <div className="flex flex-wrap items-center gap-2 print:hidden">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                disabled={page <= 1}
                onClick={goPrev}
              >
                Anterior
              </Button>
              {pageCount <= 7 ? (
                <div className="flex items-center gap-1">
                  {Array.from({ length: pageCount }, (_, i) => i + 1).map(
                    (n) => (
                      <Button
                        key={n}
                        type="button"
                        variant={n === page ? "secondary" : "ghost"}
                        size="sm"
                        className="h-8 min-w-8 px-0 text-xs"
                        onClick={() => setPage(n)}
                      >
                        {n}
                      </Button>
                    ),
                  )}
                </div>
              ) : (
                <span className="px-1 tabular-nums text-hk-deep">
                  Página {page} de {pageCount}
                </span>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                disabled={page >= pageCount}
                onClick={goNext}
              >
                Próxima
              </Button>
            </div>
          </footer>
        </>
      )}
    </section>
  );
}
