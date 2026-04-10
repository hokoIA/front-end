"use client";

import type { ContentPostRow } from "@/features/dashboard/types";
import { formatCompactNumber } from "@/features/dashboard/utils/format";
import { formatDisplayDate } from "@/features/dashboard/utils/format";
import { Badge } from "@/components/ui/badge";
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
import { useMemo, useState } from "react";

type PostsPerformanceTableProps = {
  posts: ContentPostRow[];
  loading?: boolean;
  className?: string;
};

type SortKey = "date" | "reach" | "likes" | "comments" | "shares";

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
      switch (sort) {
        case "reach":
          return b.reach - a.reach;
        case "likes":
          return b.likes - a.likes;
        case "comments":
          return b.comments - a.comments;
        case "shares":
          return b.shares - a.shares;
        default:
          return b.date.localeCompare(a.date);
      }
    });
    return list;
  }, [posts, platform, sort]);

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
            Tabela completa com filtros locais. Ações dependem de rotas futuras.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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
          <Select
            value={sort}
            onValueChange={(v) => setSort(v as SortKey)}
          >
            <SelectTrigger className="h-9 w-[180px] text-xs">
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Data (recente)</SelectItem>
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Post / preview</TableHead>
                <TableHead>Plataforma</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Curtidas</TableHead>
                <TableHead className="text-right">Coment.</TableHead>
                <TableHead className="text-right">Compart.</TableHead>
                <TableHead className="text-right">Alcance</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="whitespace-nowrap text-xs text-hk-muted">
                    {formatDisplayDate(p.date)}
                  </TableCell>
                  <TableCell className="max-w-[220px]">
                    <span className="line-clamp-2 text-sm text-hk-ink">
                      {p.title}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">
                      {p.platform}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-hk-muted">
                    {p.type}
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
                    {formatCompactNumber(p.reach)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-hk-action"
                      disabled
                      title="Detalhe do post — endpoint a definir"
                    >
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
