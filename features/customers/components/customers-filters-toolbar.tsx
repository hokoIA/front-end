"use client";

import type { CustomerHubFilterState } from "@/features/customers/types/filters";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

const SURFACE_OPTIONS: {
  value: CustomerHubFilterState["platformConnected"];
  label: string;
}[] = [
  { value: "all", label: "Todas as plataformas" },
  { value: "facebook", label: "Meta / Facebook" },
  { value: "instagram", label: "Meta / Instagram" },
  { value: "google_analytics", label: "Google Analytics" },
  { value: "youtube", label: "YouTube" },
  { value: "linkedin", label: "LinkedIn" },
];

export function CustomersFiltersToolbar({
  value,
  onChange,
}: {
  value: CustomerHubFilterState;
  onChange: (next: CustomerHubFilterState) => void;
}) {
  return (
    <div className="rounded-xl border border-hk-border bg-hk-surface p-4 shadow-hk-sm">
      <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-4">
          <Label htmlFor="hk-customers-search" className="text-xs text-hk-muted">
            Buscar
          </Label>
          <div className="relative mt-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-hk-muted"
              aria-hidden
            />
            <Input
              id="hk-customers-search"
              placeholder="Nome, empresa ou e-mail"
              className="pl-9"
              value={value.search}
              onChange={(e) =>
                onChange({ ...value, search: e.target.value })
              }
            />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
          <div>
            <Label className="text-xs text-hk-muted">Status do cliente</Label>
            <Select
              value={value.lifecycle}
              onValueChange={(v) =>
                onChange({
                  ...value,
                  lifecycle: v as CustomerHubFilterState["lifecycle"],
                })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="archived">Arquivado</SelectItem>
                <SelectItem value="unknown">Não informado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-hk-muted">Integrações</Label>
            <Select
              value={value.integrationScope}
              onValueChange={(v) =>
                onChange({
                  ...value,
                  integrationScope:
                    v as CustomerHubFilterState["integrationScope"],
                })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Qualquer</SelectItem>
                <SelectItem value="with_active">Com integrações ativas</SelectItem>
                <SelectItem value="without">Sem integração</SelectItem>
                <SelectItem value="with_alert">Com alerta / renovação</SelectItem>
                <SelectItem value="with_pending">Com pendências</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-hk-muted">Plataforma conectada</Label>
            <Select
              value={value.platformConnected}
              onValueChange={(v) =>
                onChange({
                  ...value,
                  platformConnected:
                    v as CustomerHubFilterState["platformConnected"],
                })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SURFACE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-hk-muted">Ordenação</Label>
            <Select
              value={`${value.sort}-${value.sortDir}`}
              onValueChange={(v) => {
                const [sort, sortDir] = v.split("-") as [
                  CustomerHubFilterState["sort"],
                  CustomerHubFilterState["sortDir"],
                ];
                onChange({ ...value, sort, sortDir });
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Nome (A–Z)</SelectItem>
                <SelectItem value="name-desc">Nome (Z–A)</SelectItem>
                <SelectItem value="created-desc">Criação (recentes)</SelectItem>
                <SelectItem value="created-asc">Criação (antigos)</SelectItem>
                <SelectItem value="updated-desc">Atualização (recentes)</SelectItem>
                <SelectItem value="updated-asc">Atualização (antigas)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
