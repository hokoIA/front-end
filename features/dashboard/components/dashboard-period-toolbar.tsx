"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCustomerCacheMutation } from "@/hooks/api/use-customers-queries";
import { cn } from "@/lib/utils/cn";
import { ChevronDown, ChevronUp, Loader2, RefreshCw } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

type DashboardPeriodToolbarProps = {
  customerId: string | null;
  dateStart: string;
  dateEnd: string;
  onDateStartChange: (v: string) => void;
  onDateEndChange: (v: string) => void;
  onApply: () => void;
  isLoading: boolean;
  disabled?: boolean;
};

export function DashboardPeriodToolbar({
  customerId,
  dateStart,
  dateEnd,
  onDateStartChange,
  onDateEndChange,
  onApply,
  isLoading,
  disabled,
}: DashboardPeriodToolbarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const cacheMutation = useCustomerCacheMutation();

  const refreshCache = useCallback(() => {
    if (!customerId) return;
    cacheMutation.mutate(
      { id_customer: customerId },
      {
        onSuccess: () => toast.success("Cache do cliente atualizado."),
        onError: () =>
          toast.error("Não foi possível atualizar o cache deste cliente."),
      },
    );
  }, [cacheMutation, customerId]);

  return (
    <section className="hk-print-hide rounded-xl border border-hk-border bg-hk-surface shadow-hk-sm">
      <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-5">
        <div className="min-w-0">
          <p className="hk-overline">
            Centro de leitura
          </p>
          <p className="truncate text-sm font-semibold text-hk-deep">
            Período analítico
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-hk-muted"
            onClick={() => refreshCache()}
            disabled={!customerId || cacheMutation.isPending}
            title="Sincronizar cache do cliente (POST /customer/cache)"
          >
            {cacheMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1 text-hk-muted"
            onClick={() => setCollapsed((c) => !c)}
            aria-expanded={!collapsed}
          >
            {collapsed ? (
              <>
                Expandir <ChevronDown className="size-4" />
              </>
            ) : (
              <>
                Recolher <ChevronUp className="size-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {!collapsed && (
        <div className="border-t border-hk-border-subtle px-4 py-5 md:px-5">
          <div className="grid gap-5 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <div className="space-y-2">
              <Label htmlFor="dash-start" className="text-hk-muted">
                Data inicial
              </Label>
              <input
                id="dash-start"
                type="date"
                value={dateStart}
                onChange={(e) => onDateStartChange(e.target.value)}
                disabled={disabled}
                className={cn(
                  "flex h-10 w-full rounded-lg border border-hk-border-subtle bg-hk-surface px-3 text-sm text-hk-ink transition-[border-color,box-shadow]",
                  "hover:border-hk-border",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hk-action/25",
                  "disabled:opacity-50",
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dash-end" className="text-hk-muted">
                Data final
              </Label>
              <input
                id="dash-end"
                type="date"
                value={dateEnd}
                onChange={(e) => onDateEndChange(e.target.value)}
                disabled={disabled}
                className={cn(
                  "flex h-10 w-full rounded-lg border border-hk-border-subtle bg-hk-surface px-3 text-sm text-hk-ink transition-[border-color,box-shadow]",
                  "hover:border-hk-border",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hk-action/25",
                  "disabled:opacity-50",
                )}
              />
            </div>
            <Button
              type="button"
              className="h-10 w-full md:w-auto md:min-w-[160px]"
              disabled={disabled || isLoading || !customerId}
              onClick={onApply}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Carregando…
                </>
              ) : (
                "Carregar período"
              )}
            </Button>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-hk-muted">
            Os dados são consolidados a partir das integrações ativas do cliente.
            Use &quot;Carregar período&quot; após ajustar as datas para atualizar
            todos os blocos.
          </p>
        </div>
      )}
    </section>
  );
}
