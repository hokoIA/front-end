"use client";

import { GoalFormStrategicSection } from "@/features/goals/components/goal-form-strategic-section";
import { GoalFormTimelineSection } from "@/features/goals/components/goal-form-timeline-section";
import { GoalKpiBuilder } from "@/features/goals/components/goal-kpi-builder";
import type { GoalSuggestion } from "@/features/goals/types/suggestions";
import type {
  GoalLifecycleStatus,
  GoalOrigin,
  GoalPriority,
  GoalKpiUi,
} from "@/features/goals/types/ui";
import { PLANNING_PLATFORM_OPTIONS } from "@/features/goals/utils/platform-labels";
import { useCreateGoalMutation } from "@/hooks/api/use-goals-queries";
import type { Customer } from "@/lib/types/customer";
import type { GoalInput } from "@/lib/types/goals";
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
import { ChevronLeft, ChevronRight, Loader2, Target } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const STEPS = [
  "Contexto",
  "Estratégia",
  "Temporalidade",
  "KPIs",
  "Revisão",
] as const;

const origins: { value: GoalOrigin; label: string }[] = [
  { value: "manual", label: "Manual" },
  { value: "ai", label: "Sugerida por IA" },
  { value: "meeting", label: "Derivada de reunião" },
  { value: "prior_analysis", label: "Derivada de análise anterior" },
  { value: "unknown", label: "Outro / indefinido" },
];

const priorities: { value: GoalPriority; label: string }[] = [
  { value: "critical", label: "Crítica" },
  { value: "high", label: "Alta" },
  { value: "medium", label: "Média" },
  { value: "low", label: "Baixa" },
  { value: "unknown", label: "—" },
];

function buildPayload(d: {
  id_customer: string;
  platform: string;
  goal_type: string;
  title: string;
  priority: GoalPriority;
  responsible: string;
  origin: GoalOrigin;
  campaign_link: string;
  description: string;
  smart: string;
  rationale: string;
  hypothesis: string;
  expectedImpact: string;
  internalNotes: string;
  startDate: string;
  endDate: string;
  durationWeeks: string;
  checkpointCadence: string;
  status: GoalLifecycleStatus;
  kpis: GoalKpiUi[];
}): GoalInput {
  const weeks = d.durationWeeks ? Number(d.durationWeeks) : undefined;
  return {
    id_customer: d.id_customer,
    platform: d.platform,
    goal_type: d.goal_type || undefined,
    title: d.title,
    priority: d.priority === "unknown" ? undefined : d.priority,
    responsible: d.responsible || undefined,
    origin: d.origin === "unknown" ? undefined : d.origin,
    campaign_link: d.campaign_link || undefined,
    description: d.description || undefined,
    smart: d.smart || undefined,
    rationale: d.rationale || undefined,
    hypothesis: d.hypothesis || undefined,
    expected_impact: d.expectedImpact || undefined,
    internal_notes: d.internalNotes || undefined,
    start_date: d.startDate || undefined,
    end_date: d.endDate || undefined,
    duration_weeks: Number.isFinite(weeks) ? weeks : undefined,
    checkpoint_cadence: d.checkpointCadence || undefined,
    status: d.status,
    kpis: d.kpis
      .filter((k) => k.name.trim())
      .map((k) => ({
        id: k.id,
        name: k.name,
        baseline: k.baseline,
        target: k.target,
        unit: k.unit,
        direction: k.direction,
        note: k.note,
      })),
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
  /** Cliente obrigatório escolhido no contexto global (id). */
  requireCustomerId: string | null;
  initialFromSuggestion?: GoalSuggestion | null;
}) {
  const create = useCreateGoalMutation();
  const [step, setStep] = useState(0);
  const [id_customer, setIdCustomer] = useState("");
  const [platform, setPlatform] = useState("facebook");
  const [goal_type, setGoalType] = useState("");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<GoalPriority>("high");
  const [responsible, setResponsible] = useState("");
  const [origin, setOrigin] = useState<GoalOrigin>("manual");
  const [campaign_link, setCampaignLink] = useState("");
  const [description, setDescription] = useState("");
  const [smart, setSmart] = useState("");
  const [rationale, setRationale] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [expectedImpact, setExpectedImpact] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [durationWeeks, setDurationWeeks] = useState("");
  const [checkpointCadence, setCheckpointCadence] = useState("Mensal");
  const [status, setStatus] = useState<GoalLifecycleStatus>("draft");
  const [kpis, setKpis] = useState<GoalKpiUi[]>([]);

  const reset = useCallback(() => {
    setStep(0);
    setIdCustomer(requireCustomerId ?? "");
    setPlatform("facebook");
    setGoalType("");
    setTitle("");
    setPriority("high");
    setResponsible("");
    setOrigin("manual");
    setCampaignLink("");
    setDescription("");
    setSmart("");
    setRationale("");
    setHypothesis("");
    setExpectedImpact("");
    setInternalNotes("");
    setStartDate("");
    setEndDate("");
    setDurationWeeks("");
    setCheckpointCadence("Mensal");
    setStatus("draft");
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
    setPlatform(s.platform);
    setGoalType(s.goalType ?? "");
    setDescription(s.description ?? s.strategicObjective);
    setSmart(s.smart ?? "");
    setRationale(s.rationaleTiming);
    setPriority(s.priority === "unknown" ? "high" : s.priority);
    setOrigin("ai");
    setStartDate(s.startDate ?? "");
    setEndDate(s.endDate ?? "");
    setKpis(
      s.suggestedKpis.map((name, i) => ({
        id: `kpi-sg-${i}`,
        name,
        direction: "increase" as const,
      })),
    );
    setStep(0);
  }, [open, initialFromSuggestion]);

  const patchStrategic = (patch: Record<string, string>) => {
    if (patch.description !== undefined) setDescription(patch.description);
    if (patch.smart !== undefined) setSmart(patch.smart);
    if (patch.rationale !== undefined) setRationale(patch.rationale);
    if (patch.hypothesis !== undefined) setHypothesis(patch.hypothesis);
    if (patch.expectedImpact !== undefined)
      setExpectedImpact(patch.expectedImpact);
    if (patch.internalNotes !== undefined)
      setInternalNotes(patch.internalNotes);
  };

  const patchTimeline = (patch: Record<string, string | GoalLifecycleStatus>) => {
    if (patch.startDate !== undefined) setStartDate(String(patch.startDate));
    if (patch.endDate !== undefined) setEndDate(String(patch.endDate));
    if (patch.durationWeeks !== undefined)
      setDurationWeeks(String(patch.durationWeeks));
    if (patch.checkpointCadence !== undefined)
      setCheckpointCadence(String(patch.checkpointCadence));
    if (patch.status !== undefined) setStatus(patch.status as GoalLifecycleStatus);
  };

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
    try {
      await create.mutateAsync(
        buildPayload({
          id_customer,
          platform,
          goal_type,
          title,
          priority,
          responsible,
          origin,
          campaign_link,
          description,
          smart,
          rationale,
          hypothesis,
          expectedImpact,
          internalNotes,
          startDate,
          endDate,
          durationWeeks,
          checkpointCadence,
          status,
          kpis,
        }),
      );
      toast.success("Meta criada. Acompanhe execução e gere análises no detalhe.");
      close(false);
    } catch {
      toast.error("Não foi possível salvar a meta.");
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
              Nova meta estratégica
            </DialogTitle>
            <DialogDescription className="text-white/85">
              Etapa {step + 1} de {STEPS.length}: {STEPS[step]}. Revise tudo antes
              de publicar — especialmente se a origem for IA.
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
              <p className="text-sm font-medium text-hk-deep">Contexto da meta</p>
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
                <Label>Plataforma</Label>
                <Select value={platform} onValueChange={setPlatform}>
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
                <Label>Tipo de meta</Label>
                <Input
                  value={goal_type}
                  onChange={(e) => setGoalType(e.target.value)}
                  placeholder="Ex.: Tráfego, branding, conversão"
                />
              </div>
              <div className="grid gap-2">
                <Label>Título / OKR</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nome claro da meta"
                />
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Prioridade</Label>
                  <Select
                    value={priority}
                    onValueChange={(v) => setPriority(v as GoalPriority)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Origem</Label>
                  <Select
                    value={origin}
                    onValueChange={(v) => setOrigin(v as GoalOrigin)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {origins.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Responsável</Label>
                <Input
                  value={responsible}
                  onChange={(e) => setResponsible(e.target.value)}
                  placeholder="Nome na agência ou squad"
                />
              </div>
              <div className="grid gap-2">
                <Label>Vínculo campanha / plano (opcional)</Label>
                <Input
                  value={campaign_link}
                  onChange={(e) => setCampaignLink(e.target.value)}
                  placeholder="ID, nome ou link interno"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <GoalFormStrategicSection
              description={description}
              smart={smart}
              rationale={rationale}
              hypothesis={hypothesis}
              expectedImpact={expectedImpact}
              internalNotes={internalNotes}
              onChange={patchStrategic}
            />
          )}

          {step === 2 && (
            <GoalFormTimelineSection
              startDate={startDate}
              endDate={endDate}
              durationWeeks={durationWeeks}
              checkpointCadence={checkpointCadence}
              status={status}
              onChange={patchTimeline}
            />
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
                  {platform}
                </li>
                <li>
                  <span className="font-medium text-hk-ink">Título:</span>{" "}
                  {title || "—"}
                </li>
                <li>
                  <span className="font-medium text-hk-ink">Período:</span>{" "}
                  {startDate || "—"} → {endDate || "—"}
                </li>
                <li>
                  <span className="font-medium text-hk-ink">KPIs:</span>{" "}
                  {kpis.filter((k) => k.name.trim()).length}
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
