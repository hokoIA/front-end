"use client";

import type { IntegrationSurface } from "@/features/dashboard/types";
import type { IntegrationOperationalState } from "@/features/dashboard/types";
import type { IntegrationPlatformAdapter } from "@/features/integrations/adapters/types";
import { PlatformIntegrationStatusBadge } from "@/features/integrations/components/platform-integration-status-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, RefreshCw, Unplug } from "lucide-react";
import { toast } from "sonner";

export function PlatformIntegrationCard({
  surface,
  label,
  operational,
  periodCoverage,
  resourceLabel,
  validityLabel,
  lastKnownLabel,
  adapter,
  onConnect,
  onOpenSwap,
  onRemoveRequest,
}: {
  surface: IntegrationSurface;
  label: string;
  operational: IntegrationOperationalState;
  periodCoverage?: "unknown" | "has_data" | "no_data";
  resourceLabel?: string;
  validityLabel?: string;
  lastKnownLabel?: string;
  adapter?: IntegrationPlatformAdapter;
  onConnect: () => void;
  onOpenSwap: () => void;
  onRemoveRequest?: () => void;
}) {
  const needsRenewal = operational === "needs_renewal";
  const showConnect =
    operational === "disconnected" || operational === "unknown";
  const showRenew = needsRenewal;

  const disconnect = () => {
    onRemoveRequest?.();
  };

  const swap = () => {
    if (!adapter?.supportsSwapResource) {
      toast.message(
        "Troca de recurso: use “Conectar” para reautorizar e selecionar outro ativo, ou aguarde o endpoint dedicado de swap.",
      );
      onOpenSwap();
      return;
    }
    onOpenSwap();
  };

  return (
    <article
      className="flex flex-col rounded-xl border border-hk-border bg-hk-surface p-4 shadow-hk-sm transition-shadow hover:shadow-hk-md"
      data-surface={surface}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-hk-deep">{label}</h3>
          <p className="mt-1 text-xs text-hk-muted">
            Recurso: {resourceLabel ?? "—"}
          </p>
        </div>
        <PlatformIntegrationStatusBadge
          operational={operational}
          periodCoverage={periodCoverage}
        />
      </div>

      <dl className="mt-3 grid gap-1 text-xs text-hk-muted">
        <div className="flex justify-between gap-2">
          <dt className="text-hk-muted">Tipo</dt>
          <dd className="text-right text-hk-ink">Conta / ativo conectado</dd>
        </div>
        {validityLabel ? (
          <div className="flex justify-between gap-2">
            <dt>Validade</dt>
            <dd className="text-right text-hk-ink">{validityLabel}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-2">
          <dt>Último estado</dt>
          <dd className="text-right text-hk-ink">
            {lastKnownLabel ?? "Sincronizado com a API"}
          </dd>
        </div>
      </dl>

      {needsRenewal ? (
        <p className="mt-3 rounded-md border border-rose-200/80 bg-rose-50/80 px-2 py-1.5 text-xs text-rose-900">
          Token ou autorização próximos do vencimento. Renove para evitar
          lacunas nos dados.
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {showConnect ? (
          <Button
            type="button"
            size="sm"
            className="bg-hk-action text-white hover:bg-hk-strong"
            onClick={onConnect}
          >
            Autorizar / conectar
          </Button>
        ) : null}
        {showRenew ? (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="gap-1"
            onClick={onConnect}
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden />
            Renovar autenticação
          </Button>
        ) : null}
        {operational === "connected" ? (
          <>
            <Button type="button" size="sm" variant="outline" onClick={swap}>
              Trocar recurso
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="text-hk-muted"
              onClick={() =>
                toast.message(
                  "Reprocessamento em massa: preparado para quando o backend expuser a ação.",
                )
              }
            >
              Sincronizar
            </Button>
          </>
        ) : null}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="ml-auto h-8 w-8"
              aria-label="Mais ações"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                toast.message(
                  "Detalhes técnicos da conexão: painel em evolução.",
                )
              }
            >
              Ver detalhes da conexão
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-rose-700 focus:text-rose-800"
              onClick={disconnect}
            >
              <Unplug className="mr-2 h-4 w-4" aria-hidden />
              Remover conexão
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </article>
  );
}
