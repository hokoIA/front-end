"use client";

import { GoalSuggestionCard } from "@/features/goals/components/goal-suggestion-card";
import type { GoalSuggestion } from "@/features/goals/types/suggestions";
import { parseGoalSuggestionsResponse } from "@/features/goals/utils/parse-suggestions";
import { PLANNING_PLATFORM_OPTIONS } from "@/features/goals/utils/platform-labels";
import { useGoalSuggestionsMutation } from "@/hooks/api/use-goals-queries";
import type { Customer } from "@/lib/types/customer";
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
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Phase = "form" | "results";

export function GoalSuggestionFlow({
  open,
  onOpenChange,
  customers,
  requireCustomerId,
  onTransformToGoal,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customers: Customer[];
  requireCustomerId: string | null;
  onTransformToGoal: (s: GoalSuggestion) => void;
}) {
  const suggest = useGoalSuggestionsMutation();
  const [phase, setPhase] = useState<Phase>("form");
  const [id_customer, setIdCustomer] = useState("");
  const [platform_name, setPlatformName] = useState("facebook");
  const [momentNote, setMomentNote] = useState("");
  const [results, setResults] = useState<GoalSuggestion[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setPhase("form");
      setResults([]);
      setSelectedId(null);
      setMomentNote("");
      return;
    }
    setIdCustomer(requireCustomerId ?? "");
  }, [open, requireCustomerId]);

  const close = (v: boolean) => {
    if (!v) {
      setPhase("form");
      setResults([]);
      setSelectedId(null);
    }
    onOpenChange(v);
  };

  const runSuggestions = async () => {
    if (!id_customer) {
      toast.error("Escolha o cliente para contextualizar a IA.");
      return;
    }
    try {
      const raw = await suggest.mutateAsync({
        id_customer: Number(id_customer),
        platform_name,
        context: momentNote.trim() ? momentNote.trim() : null,
      });
      const list = parseGoalSuggestionsResponse(raw, platform_name);
      setResults(list);
      setPhase("results");
      if (list.length === 0) {
        toast.message("Nenhuma sugestão retornada para este pedido.");
      }
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Falha ao gerar sugestões.";
      toast.error(msg);
    }
  };

  const platformOpts = PLANNING_PLATFORM_OPTIONS.filter((p) => p.value !== "all");

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-h-[min(92vh,900px)] w-[min(96vw,48rem)] max-w-none overflow-y-auto border-hk-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-hk-action" aria-hidden />
            Sugestões da IA
          </DialogTitle>
          <DialogDescription>
            Envia id_customer (número), platform_name e context (texto ou null)
            ao endpoint real de sugestões.
          </DialogDescription>
        </DialogHeader>

        {phase === "form" && (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>Cliente</Label>
              <Select value={id_customer} onValueChange={setIdCustomer}>
                <SelectTrigger>
                  <SelectValue placeholder="Obrigatório" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id_customer} value={c.id_customer}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Plataforma (platform_name)</Label>
              <Select value={platform_name} onValueChange={setPlatformName}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platformOpts.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Contexto (opcional)</Label>
              <Textarea
                rows={3}
                value={momentNote}
                onChange={(e) => setMomentNote(e.target.value)}
                placeholder="Contexto opcional enviado ao backend (ou vazio)."
              />
            </div>
          </div>
        )}

        {phase === "results" && (
          <div className="space-y-4">
            {results.length === 0 ? (
              <p className="text-sm text-hk-muted">
                Nenhuma sugestão disponível. Ajuste o pedido e tente novamente.
              </p>
            ) : (
              <>
                <p className="text-sm text-hk-muted">
                  {results.length} proposta(s). Selecione para comparar ou
                  transforme em meta (abre o fluxo de criação).
                </p>
                <div className="grid max-h-[55vh] gap-4 overflow-y-auto pr-1 md:grid-cols-2">
                  {results.map((s) => (
                    <GoalSuggestionCard
                      key={s.id}
                      suggestion={s}
                      selected={selectedId === s.id}
                      onSelect={() => setSelectedId(s.id)}
                      onUse={() => {
                        onTransformToGoal(s);
                        close(false);
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 sm:justify-between">
          <Button type="button" variant="outline" onClick={() => close(false)}>
            Fechar
          </Button>
          {phase === "form" ? (
            <Button
              type="button"
              className="gap-2 bg-hk-deep text-white hover:bg-hk-strong"
              onClick={() => void runSuggestions()}
              disabled={suggest.isPending}
            >
              {suggest.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Sparkles className="h-4 w-4" aria-hidden />
              )}
              Gerar sugestões
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setPhase("form")}
              >
                Ajustar pedido
              </Button>
              {selectedId ? (
                <Button
                  type="button"
                  className="bg-hk-action text-white hover:bg-hk-strong"
                  onClick={() => {
                    const s = results.find((r) => r.id === selectedId);
                    if (s) {
                      onTransformToGoal(s);
                      close(false);
                    }
                  }}
                >
                  Usar selecionada
                </Button>
              ) : null}
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
