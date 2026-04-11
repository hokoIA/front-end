"use client";

import type { IntegrationPlatformAdapter } from "@/features/integrations/adapters/types";
import { integrationResourcesFromUnknown } from "@/features/integrations/adapters/resource-options";
import { extractOAuthRedirectUrl } from "@/features/integrations/utils/oauth-response";
import { queryKeys } from "@/lib/api/query-keys";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Step = "intro" | "resources" | "connecting" | "error";

export function PlatformConnectFlow({
  open,
  onOpenChange,
  customerId,
  adapter,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string;
  adapter: IntegrationPlatformAdapter;
}) {
  const qc = useQueryClient();
  const [step, setStep] = useState<Step>("intro");
  const [selectedId, setSelectedId] = useState<string>("");

  const resourcesQuery = useQuery({
    queryKey:
      adapter.apiKey === "meta"
        ? queryKeys.integrations.metaPages(customerId)
        : adapter.apiKey === "google_analytics"
          ? queryKeys.integrations.gaProperties(customerId)
          : adapter.apiKey === "youtube"
            ? queryKeys.integrations.youtubeChannels(customerId)
            : queryKeys.integrations.linkedinOrgs(customerId),
    queryFn: () => adapter.listResources(customerId),
    enabled: open && step === "resources",
    staleTime: 30_000,
  });

  const connectMut = useMutation({
    mutationFn: (payload: Record<string, unknown>) => adapter.connect(payload),
    onSuccess: (data) => {
      const url = extractOAuthRedirectUrl(data);
      if (url) {
        window.location.assign(url);
        return;
      }
      void qc.invalidateQueries({ queryKey: queryKeys.integrations.all });
      void qc.invalidateQueries({ queryKey: queryKeys.customers.all });
      toast.success("Conexão registrada. Sincronizando status…");
      onOpenChange(false);
    },
    onError: () => {
      setStep("error");
      toast.error("Falha na conexão. Verifique permissões e tente novamente.");
    },
  });

  useEffect(() => {
    if (!open) {
      setStep("intro");
      setSelectedId("");
    }
  }, [open]);

  const options = integrationResourcesFromUnknown(resourcesQuery.data);

  const goResources = () => {
    setStep("resources");
  };

  const submitConnect = () => {
    if (options.length > 0 && !selectedId) {
      toast.error("Selecione um recurso para continuar.");
      return;
    }
    setStep("connecting");
    connectMut.mutate(
      adapter.buildConnectPayload(
        customerId,
        selectedId || undefined,
      ),
    );
  };

  const oauthOnly = () => {
    setStep("connecting");
    connectMut.mutate(adapter.buildConnectPayload(customerId));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-hk-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-hk-action" aria-hidden />
            Conectar {adapter.label}
          </DialogTitle>
          <DialogDescription>{adapter.description}</DialogDescription>
        </DialogHeader>

        {step === "intro" && (
          <div className="space-y-3 text-sm text-hk-muted">
            <ol className="list-decimal space-y-2 pl-4">
              <li>Autorize via OAuth na plataforma.</li>
              <li>Liste os recursos disponíveis para este cliente.</li>
              <li>Selecione página, propriedade ou canal.</li>
              <li>Salve a conexão e aguarde o status atualizado.</li>
            </ol>
            <p className="rounded-md border border-hk-border-subtle bg-hk-canvas/80 p-3 text-xs">
              Dica: o contrato exato do corpo do POST pode variar por ambiente.
              Enviamos chaves comuns (<code className="text-hk-action">id_customer</code>{" "}
              + identificador do recurso) para maximizar compatibilidade.
            </p>
          </div>
        )}

        {step === "resources" && (
          <div className="space-y-3">
            {resourcesQuery.isPending ? (
              <div className="flex items-center gap-2 text-sm text-hk-muted">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Carregando recursos…
              </div>
            ) : resourcesQuery.isError ? (
              <p className="text-sm text-rose-700">
                Não foi possível listar recursos. Tente autorizar primeiro ou
                verifique se a sessão ainda é válida.
              </p>
            ) : options.length === 0 ? (
              <p className="text-sm text-hk-muted">
                Nenhum recurso retornado. Você pode tentar iniciar só com OAuth
                — alguns fluxos preenchem recursos após a primeira autorização.
              </p>
            ) : (
              <div className="grid gap-2">
                <Label>Recurso</Label>
                <Select value={selectedId} onValueChange={setSelectedId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione…" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        {step === "connecting" && (
          <div className="flex items-center gap-2 text-sm text-hk-muted">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Conectando…
          </div>
        )}

        {step === "error" && (
          <p className="text-sm text-rose-700">
            Ajuste as permissões da conta ou repita o fluxo. Se o erro persistir,
            contate o suporte com o horário da tentativa.
          </p>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          {step === "intro" && (
            <>
              <Button type="button" variant="secondary" onClick={oauthOnly}>
                Só autorizar (OAuth)
              </Button>
              <Button
                type="button"
                className="bg-hk-action text-white hover:bg-hk-strong"
                onClick={goResources}
              >
                Listar e escolher recurso
              </Button>
            </>
          )}
          {step === "resources" && (
            <Button
              type="button"
              className="bg-hk-action text-white hover:bg-hk-strong"
              onClick={submitConnect}
              disabled={
                connectMut.isPending || (options.length > 0 && !selectedId)
              }
            >
              Salvar conexão
            </Button>
          )}
          {step === "error" && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStep("intro")}
            >
              Recomeçar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
