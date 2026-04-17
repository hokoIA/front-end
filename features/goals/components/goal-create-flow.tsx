"use client";

import { GoalKpiBuilder } from "@/features/goals/components/goal-kpi-builder";
import type { GoalSuggestion } from "@/features/goals/types/suggestions";
import type { GoalKpiUi } from "@/features/goals/types/ui";
import { PLANNING_PLATFORM_OPTIONS } from "@/features/goals/utils/platform-labels";
import { useCreateGoalMutation } from "@/hooks/api/use-goals-queries";
import type { Customer } from "@/lib/types/customer";
import type { GoalCreatePayload } from "@/lib/types/goals";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Loader2, Target } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const STEPS = ["Contexto", "Descrição", "Período", "KPIs", "Revisão"] as const;

function parseOptionalNumber(raw: string): number | null {
  const t = raw.trim();
  if (!t) return null;
  const n = Number(t.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function buildPayload(d: {
  id_customer: string;
  platform_name: string;
  tipo_meta: string;
  title: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  kpis: GoalKpiUi[];
}): GoalCreatePayload {
  const rows = d.kpis
    .filter((k) => k.kpi.trim() && k.name.trim())
    .map((k) => ({
      kpi: k.kpi.trim(),
      label: k.name.trim(),
      baseline: parseOptionalNumber(k.baseline ?? ""),
      target: parseOptionalNumber(k.target ?? ""),
      unit: k.unit?.trim() ? k.unit.trim() : null,
    }));
  return {
    id_customer: Number(d.id_customer),
    platform_name: d.platform_name.trim(),
    tipo_meta: d.tipo_meta.trim(),
    title: d.title.trim(),
    descricao: d.descricao.trim(),
    data_inicio: d.data_inicio,
    data_fim: d.data_fim,
    kpis: rows,
    status: "ativo",
  };
}

export function GoalCreateFlow({
  open,
  onOpenChange,
  customers,
  requireCustomerId,
  initialFromSuggestion,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customers: Customer[];
  requireCustomerId: string | null;
  initialFromSuggestion?: GoalSuggestion | null;
}) {
  const create = useCreateGoalMutation();
  const [step, setStep] = useState(0);
  const [id_customer, setIdCustomer] = useState("");
  const [platform_name, setPlatformName] = useState("facebook");
  const [tipo_meta, setTipoMeta] = useState("");
  const [title, setTitle] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data_inicio, setDataInicio] = useState("");
  const [data_fim, setDataFim] = useState("");
  const [kpis, setKpis] = useState<GoalKpiUi[]>([]);

  const reset = useCallback(() => {
    setStep(0);
    setIdCustomer(requireCustomerId ?? "");
    setPlatformName("facebook");
    setTipoMeta("");
    setTitle("");
    setDescricao("");
    setDataInicio("");
    setDataFim("");
    setKpis([]);
  }, [requireCustomerId]);

  useEffect(() => {
    if (!open) {
      reset();
      return;
    }
    setIdCustomer(requireCustomerId ?? "");
  }, [open, requireCustomerId, reset]);

  useEffect(() => {
    if (!open || !initialFromSuggestion) return;
    const s = initialFromSuggestion;
    setTitle(s.title);
    setPlatformName(s.platform?.trim() ? s.platform : "facebook");
    setTipoMeta(s.tipoMeta ?? "");
    setDescricao(s.descricao ?? "");
    setKpis(
      s.kpis.map((row, i) => ({
        id: `kpi-sg-${i}`,
        kpi: row.kpi,
        name: row.label,
        baseline: "",
        target: "",
        unit: "",
      })),
    );
    setStep(0);
  }, [open, initialFromSuggestion]);

  const close = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const submit = async () => {
    if (!id_customer.trim()) {
      toast.error("Selecione o cliente da meta.");
      return;
    }
    if (!title.trim()) {
      toast.error("Informe o título da meta.");
      return;
    }
    if (!tipo_meta.trim()) {
      toast.error("Informe o tipo de meta.");
      return;
    }
    if (!descricao.trim()) {
      toast.error("Informe a descrição da meta.");
      return;
    }
    if (!data_inicio || !data_fim) {
      toast.error("Informe data de início e data de fim.");
      return;
    }
    const validKpis = kpis.filter((k) => k.kpi.trim() && k.name.trim());
    if (validKpis.length === 0) {
      toast.error("Inclua pelo menos um KPI com identificador e nome.");
      return;
    }
    try {
      await create.mutateAsync(
        buildPayload({
          id_customer,
          platform_name,
          tipo_meta,
          title,
          descricao,
          data_inicio,
          data_fim,
          kpis,
        }),
      );
      toast.success("Meta criada com sucesso.");
      close(false);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Não foi possível salvar a meta.";
      toast.error(msg);
    }
  };

  const platformOpts = PLANNING_PLATFORM_OPTIONS.filter((p) => p.value !== "all");

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-h-[min(92vh,900px)] w-[min(96vw,40rem)] max-w-none overflow-y-auto border-hk-border p-0 gap-0">
        <div className="border-b border-hk-border bg-gradient-to-r from-hk-deep/90 to-hk-action/80 px-6 py-5 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl text-white">
              <Target className="h-6 w-6" aria-hidden />
              Nova meta
            </DialogTitle>
            <DialogDescription className="text-white/85">
              Etapa {step + 1} de {STEPS.length}: {STEPS[step]}. Campos alinhados
              ao contrato real do backend.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex gap-1">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${i <= step ? "bg-white" : "bg-white/30"}`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6 px-6 py-5">
          {step === 0 && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-hk-deep">Contexto</p>
              <div className="grid gap-2">
                <Label>Cliente</Label>
                <Select value={id_customer} onValueChange={setIdCustomer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
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
                <Label>Tipo de meta (tipo_meta)</Label>
                <Input
                  value={tipo_meta}
                  onChange={(e) => setTipoMeta(e.target.value)}
                  placeholder="Ex.: conversão, branding, tráfego"
                />
              </div>
              <div className="grid gap-2">
                <Label>Título</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nome claro da meta"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-hk-deep">Descrição</p>
              <Label htmlFor="goal-desc">Descrição (descricao)</Label>
              <Textarea
                id="goal-desc"
                rows={8}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Contexto e definição da meta em texto livre."
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-hk-deep">Período</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="g-ini">Início (data_inicio)</Label>
                  <Input
                    id="g-ini"
                    type="date"
                    value={data_inicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="g-fim">Fim (data_fim)</Label>
                  <Input
                    id="g-fim"
                    type="date"
                    value={data_fim}
                    onChange={(e) => setDataFim(e.target.value)}
                  />
                </div>
              </div>
              <p className="text-xs text-hk-muted">
                Novas metas são enviadas com <strong>status: ativo</strong>, como
                esperado pelo backend na criação.
              </p>
            </div>
          )}

          {step === 3 && <GoalKpiBuilder kpis={kpis} onChange={setKpis} />}

          {step === 4 && (
            <div className="space-y-3 text-sm">
              <p className="font-medium text-hk-deep">Revisão</p>
              <ul className="space-y-2 rounded-lg border border-hk-border-subtle bg-hk-canvas/50 p-4 text-hk-muted">
                <li>
                  <span className="font-medium text-hk-ink">Cliente:</span>{" "}
                  {customers.find((c) => c.id_customer === id_customer)?.name ??
                    "—"}
                </li>
                <li>
                  <span className="font-medium text-hk-ink">Plataforma:</span>{" "}
                  {platform_name}
                </li>
                <li>
                  <span className="font-medium text-hk-ink">Tipo:</span>{" "}
                  {tipo_meta || "—"}
                </li>
                <li>
                  <span className="font-medium text-hk-ink">Título:</span>{" "}
                  {title || "—"}
                </li>
                <li>
                  <span className="font-medium text-hk-ink">Período:</span>{" "}
                  {data_inicio || "—"} → {data_fim || "—"}
                </li>
                <li>
                  <span className="font-medium text-hk-ink">KPIs válidos:</span>{" "}
                  {kpis.filter((k) => k.kpi.trim() && k.name.trim()).length}
                </li>
              </ul>
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-hk-border-subtle bg-hk-canvas/50 px-6 py-4">
          <div className="flex w-full flex-wrap items-center justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              className="gap-1"
              disabled={step === 0}
              onClick={back}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Voltar
            </Button>
            <div className="flex gap-2">
              {step < STEPS.length - 1 ? (
                <Button
                  type="button"
                  className="gap-1 bg-hk-action text-white hover:bg-hk-strong"
                  onClick={next}
                >
                  Avançar
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </Button>
              ) : (
                <Button
                  type="button"
                  className="bg-hk-action text-white hover:bg-hk-strong"
                  onClick={() => void submit()}
                  disabled={create.isPending}
                >
                  {create.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    "Salvar meta"
                  )}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
