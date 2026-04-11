"use client";

import { getKanbanClientPortalLink } from "@/lib/api/kanban";
import { extractPortalUrl } from "@/features/kanban/utils/normalize";
import { Button } from "@/components/ui/button";
import { HttpError } from "@/lib/api/http-client";
import { ExternalLink, Link2, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export function KanbanExternalLinkCard({
  customerId,
  customerName,
}: {
  customerId: string;
  customerName: string;
}) {
  const [url, setUrl] = useState<string | null>(null);

  const fetchLink = useMutation({
    mutationFn: () => getKanbanClientPortalLink(customerId),
    onSuccess: (data) => {
      const u = extractPortalUrl(data);
      if (u) {
        setUrl(u);
        toast.success("Link obtido. Você pode copiar abaixo.");
      } else {
        toast.error("Resposta sem URL de portal. Verifique a API.");
      }
    },
    onError: (err) => {
      const msg =
        err instanceof HttpError
          ? err.message
          : "Não foi possível obter o link externo.";
      toast.error(msg);
    },
  });

  const copy = async () => {
    if (!url) {
      toast.error("Obtenha o link antes de copiar.");
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado para a área de transferência.");
    } catch {
      toast.error("Não foi possível copiar. Copie manualmente.");
    }
  };

  return (
    <section
      aria-label="Portal externo do cliente"
      className="rounded-xl border border-hk-border bg-gradient-to-br from-hk-surface to-hk-cyan/5 p-4 shadow-hk-sm"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-hk-action/10 text-hk-action">
          <ExternalLink className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div>
            <h3 className="text-sm font-semibold text-hk-deep">
              Área externa do cliente
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-hk-muted">
              Link dedicado para <strong>{customerName}</strong> visualizar
              entregas, aprovar ou solicitar ajustes sem acessar o painel
              completo da agência.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => fetchLink.mutate()}
              disabled={fetchLink.isPending}
            >
              {fetchLink.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              ) : (
                <Link2 className="h-3.5 w-3.5" aria-hidden />
              )}
              Obter link
            </Button>
            <Button
              type="button"
              size="sm"
              className="gap-1.5 bg-hk-deep text-white hover:bg-hk-strong"
              onClick={() => void copy()}
              disabled={!url}
            >
              Copiar link
            </Button>
          </div>
          {url ? (
            <p className="break-all rounded-md border border-hk-border bg-hk-canvas/50 p-2 font-mono text-[11px] text-hk-deep">
              {url}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
