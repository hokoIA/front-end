"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  ContentTypeValue,
  DocumentListFilters,
  GovernanceStatusValue,
} from "../types";
import { CONTENT_TYPE_OPTIONS, STATUS_OPTIONS } from "../utils/constants";

type Props = {
  filters: DocumentListFilters;
  onChange: (f: DocumentListFilters) => void;
};

export function ContextDocumentsToolbar({ filters, onChange }: Props) {
  const patch = (p: Partial<DocumentListFilters>) =>
    onChange({ ...filters, ...p });

  return (
    <div className="space-y-4 rounded-xl border border-hk-border bg-hk-surface p-4 shadow-hk-sm">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-hk-deep">
          Acervo e governança
        </h3>
        <p className="text-xs text-hk-muted">
          Listagem preparada para integração futura com o endpoint real. Os dados
          abaixo são ilustrativos por cliente.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5 lg:col-span-2">
          <Label htmlFor="ctx-search" className="text-xs">
            Busca
          </Label>
          <Input
            id="ctx-search"
            value={filters.search}
            onChange={(e) => patch({ search: e.target.value })}
            placeholder="Título, tags, resumo ou autor"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Tipo de conteúdo</Label>
          <Select
            value={filters.contentType}
            onValueChange={(contentType) =>
              patch({
                contentType: contentType as ContentTypeValue | "all",
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {CONTENT_TYPE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Status</Label>
          <Select
            value={filters.status}
            onValueChange={(status) =>
              patch({ status: status as GovernanceStatusValue | "all" })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Validade</Label>
          <Select
            value={filters.validity}
            onValueChange={(validity) =>
              patch({
                validity: validity as DocumentListFilters["validity"],
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="valid">Vigentes</SelectItem>
              <SelectItem value="expiring">Expirando (30 dias)</SelectItem>
              <SelectItem value="expired">Vencidas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ctx-fcat" className="text-xs">
            Categoria (contém)
          </Label>
          <Input
            id="ctx-fcat"
            value={filters.category}
            onChange={(e) => patch({ category: e.target.value })}
            placeholder="Filtrar por categoria"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ctx-dfrom" className="text-xs">
            Enviado de
          </Label>
          <Input
            id="ctx-dfrom"
            type="date"
            value={filters.submittedFrom}
            onChange={(e) => patch({ submittedFrom: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ctx-dto" className="text-xs">
            Enviado até
          </Label>
          <Input
            id="ctx-dto"
            type="date"
            value={filters.submittedTo}
            onChange={(e) => patch({ submittedTo: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
