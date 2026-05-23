"use client";

import type { IntegrationOperationalState } from "@/features/dashboard/types";
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
  operational,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string;
  adapter: IntegrationPlatformAdapter;
  operational?: IntegrationOperationalState;
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
    if (open) {
      setStep(operational === "authorized" ? "resources" : "intro");
      setSelectedId("");
      return;
    }
    setStep("intro");
    setSelectedId("");
  }, [open, operational]);

  const options = integrationResourcesFromUnknown(
    resourcesQuery.data,
    adapter.key === "facebook" || adapter.key === "instagram"
      ? adapter.key
      : undefined,
  );


  const submitConnect = () => {
    if (options.length > 0 && !selectedId) {
      toast.error("Selecione um recurso para continuar.");
      return;
    }
    setStep("connecting");

    const selectedResource = options.find((o) => o.id === selectedId);

    connectMut.mutate(
      adapter.buildConnectPayload(
        customerId,
        selectedId || undefined,
        selectedResource,
      ),
    );
  };

  const oauthOnly = () => {
    const authPathByApiKey: Record<
      IntegrationPlatformAdapter["apiKey"],
      string
    > = {
      meta: "/api/meta/auth",
      google_analytics: "/api/googleAnalytics/auth",
      youtube: "/api/youtube/auth",
      linkedin: "/api/linkedin/auth",
    };
    const authPath = authPathByApiKey[adapter.apiKey];
    window.location.assign(
      `${authPath}?id_customer=${encodeURIComponent(customerId)}`,
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-hk-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-hk-action" aria-hidden />
            {operational === "authorized" ? "Escolher recurso" : "Conectar"}{" "}
            {adapter.label}
          </DialogTitle>
          <DialogDescription>{adapter.description}</DialogDescription>
        </DialogHeader>

        {step === "intro" && (
          <div className="space-y-3 text-sm text-hk-muted">
            <p>
              Autorize a conta na plataforma. Depois do retorno, a tela permitirá
              escolher o ativo específico do cliente.
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
                Nenhum recurso foi retornado para esta conta. Reautorize a conta
                ou confirme se o usuário possui acesso ao ativo.
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
          {step === "intro" && (
            <Button
              type="button"
              className="bg-hk-action text-white hover:bg-hk-strong"
              onClick={oauthOnly}
            >
              Autorizar conta
            </Button>
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
