"use client";

import { PageHeader } from "@/components/data-display/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { useAuthStatusQuery } from "@/hooks/api/use-auth-queries";
import { cn } from "@/lib/utils/cn";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CircleAlert,
  Clock3,
  FileText,
  Link2,
  Plus,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  ACTIVATION_MOCK_CUSTOMERS,
  type ActivationMockCustomer,
  type MinimumItem,
} from "./mock-customers";

type Area = "overview" | "materials" | "connections" | "evaluation";
const AREAS: { id: Area; label: string }[] = [
  { id: "overview", label: "Visão geral" },
  { id: "materials", label: "Materiais" },
  { id: "connections", label: "Conexões" },
  { id: "evaluation", label: "Avaliação" },
];

const minimumText: Record<MinimumItem["status"], string> = {
  pending: "Pendente",
  processing: "Processando material",
  identified: "Identificado no material",
  manual: "Indicado pelo Admin · aguardando conferência",
};

function MinimumRow({ item }: { item: MinimumItem }) {
  const done = item.status === "identified" || item.status === "manual";
  return (
    <div className="flex gap-3 border-b border-hk-divider py-3 last:border-0">
      <span
        className={cn(
          "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full",
          done ? "bg-hk-success-soft text-hk-success" : "bg-hk-surface-soft text-hk-muted",
        )}
      >
        {done ? <Check className="size-4" aria-hidden /> : <Clock3 className="size-4" aria-hidden />}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-hk-deep">{item.label}</p>
        <p className="mt-0.5 text-xs text-hk-muted">{minimumText[item.status]}</p>
        {item.source ? <p className="mt-1 text-xs text-hk-ink">Fonte: {item.source}</p> : null}
      </div>
    </div>
  );
}

function SectionCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("border-hk-border bg-hk-surface p-5 shadow-hk-sm", className)}>
      <h2 className="text-base font-semibold text-hk-deep">{title}</h2>
      {description ? <p className="mt-1 text-sm text-hk-muted">{description}</p> : null}
      <div className="mt-4">{children}</div>
    </Card>
  );
}

export function ActivationCustomersView({ customerId }: { customerId: string }) {
  const { data: auth, isPending: authPending } = useAuthStatusQuery();
  const [customer, setCustomer] = useState<ActivationMockCustomer>(() =>
    ACTIVATION_MOCK_CUSTOMERS.find((item) => item.id === customerId)!,
  );
  const [area, setArea] = useState<Area>("overview");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [materialType, setMaterialType] = useState<"file" | "text">("file");
  const [fileName, setFileName] = useState("");
  const [textDraft, setTextDraft] = useState("");
  const [objectiveDraft, setObjectiveDraft] = useState<string | null>(null);
  const [manualClaims, setManualClaims] = useState<Record<string, { source: string; excerpt: string }>>({});
  const [manualTarget, setManualTarget] = useState<MinimumItem | null>(null);
  const [manualSource, setManualSource] = useState("");
  const [manualExcerpt, setManualExcerpt] = useState("");
  const minimums = customer.minimums.map((item) => manualClaims[item.id]
    ? { ...item, status: "manual" as const, source: manualClaims[item.id].source }
    : item);
  const covered = minimums.filter(
    (item) => item.status === "identified" || item.status === "manual",
  ).length;
  const evaluationState = customer.evaluation === "not-ready" && covered === minimums.length
    ? "ready"
    : customer.evaluation;
  const isAdmin = String(auth?.user?.role ?? "").toLowerCase() === "admin";

  const updateEvaluation = (evaluation: ActivationMockCustomer["evaluation"], situation: string, nextAction: string) => {
    setCustomer((current) => ({ ...current, evaluation, situation, nextAction }));
  };

  if (authPending) {
    return <div className="hk-page py-8 text-sm text-hk-muted">Verificando acesso…</div>;
  }
  if (!isAdmin) {
    return (
      <div className="hk-page hk-page--narrow py-10">
        <SectionCard title="Acesso administrativo" description="A Ativação é destinada ao Admin.">
          <Button asChild variant="outline"><Link href="/clientes">Voltar para Clientes</Link></Button>
        </SectionCard>
      </div>
    );
  }

  const openArea = (next: Area) => {
    setArea(next);
  };

  return (
    <div className="hk-page space-y-6 pb-16 pt-4">
      <Link href="/clientes" className="inline-flex items-center gap-2 text-sm font-medium text-hk-muted hover:text-hk-action">
        <ArrowLeft className="size-4" aria-hidden /> Clientes & Integrações
      </Link>

          <PageHeader
            eyebrow={customer.evaluation === "active" ? "Clientes / Ativo" : "Clientes / Em Ativação"}
            title={customer.name}
            description="Prepare as informações do cliente ao longo do tempo. A análise estratégica fica disponível após a autorização."
            meta={<><span className="rounded-full bg-hk-info-soft px-2.5 py-1 font-semibold text-hk-info">{customer.situation}</span><span>Contato: {customer.contact}</span></>}
            actions={<Button asChild variant="outline"><Link href="/clientes">Voltar à lista</Link></Button>}
          />
          <nav aria-label="Áreas da Ativação" className="flex flex-wrap gap-2 border-b border-hk-divider pb-3">
            {AREAS.map((item) => (
              <Button
                key={item.id}
                type="button"
                variant={area === item.id ? "default" : "ghost"}
                className={area === item.id ? "bg-hk-deep text-white hover:bg-hk-strong" : "text-hk-muted"}
                aria-current={area === item.id ? "page" : undefined}
                onClick={() => setArea(item.id)}
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {area === "overview" && (
            <div className="space-y-5">
              <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
                <SectionCard title="O que precisa de atenção" description="Situação da coleta deste cliente.">
                  <p className="text-sm font-semibold text-hk-deep">{covered} de {minimums.length} informações mínimas cobertas</p>
                  <p className="mt-2 text-sm text-hk-muted">{customer.nextAction}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button onClick={() => openArea("materials")} className="gap-2 bg-hk-action text-white hover:bg-hk-strong"><Plus className="size-4" aria-hidden /> Adicionar material</Button>
                    <Button variant="outline" onClick={() => openArea("connections")} className="gap-2"><Link2 className="size-4" aria-hidden /> Ver conexões</Button>
                  </div>
                </SectionCard>
                <SectionCard title="Próximo passo" description="A avaliação geral depende da cobertura dos mínimos processados.">
                  <p className="text-sm text-hk-ink">{evaluationState === "active" ? "Ativação autorizada. A análise estratégica pode ser iniciada posteriormente." : evaluationState === "review" ? "O parecer tem solicitações para revisar." : evaluationState === "running" ? "Avaliação em andamento. Você pode sair e voltar depois." : evaluationState === "failed" ? "A avaliação foi interrompida. Você pode tentar novamente." : covered === minimums.length ? "Os mínimos estão cobertos. Revise a avaliação." : "Complete os mínimos pendentes ou em processamento."}</p>
                  <Button variant="outline" className="mt-4" onClick={() => openArea("evaluation")}>Abrir avaliação <ArrowRight className="ml-2 size-4" aria-hidden /></Button>
                </SectionCard>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <SectionCard title="Informações mínimas" description="Cobertura necessária antes da avaliação geral.">
                  <div>{minimums.map((item) => <MinimumRow key={item.id} item={item} />)}</div>
                  <Button variant="ghost" className="mt-2 text-hk-action" onClick={() => openArea("materials")}>Ver fontes e acervo</Button>
                </SectionCard>
                <SectionCard title="Contexto reunido">
                  <div className="space-y-3 text-sm text-hk-ink">
                    <p><FileText className="mr-2 inline size-4 text-hk-action" aria-hidden />{customer.materials.length} materiais reunidos</p>
                    <p><Link2 className="mr-2 inline size-4 text-hk-action" aria-hidden />{customer.connections.filter((item) => item.state === "Conectado").length} conexões disponíveis</p>
                    <p className="border-t border-hk-divider pt-3 text-hk-muted">Contato</p>
                    <p>{customer.contact} · {customer.phone}</p>
                    <p className="text-hk-muted">Objetivo inicial declarado</p>
                    <p>{(objectiveDraft ?? customer.objective) || "Ainda não informado."}</p>
                    <Label htmlFor="activation-objective">Revisar objetivo</Label>
                    <Input id="activation-objective" value={objectiveDraft ?? customer.objective} onChange={(event) => setObjectiveDraft(event.target.value)} placeholder="Direção inicial informada pelo cliente" />
                  </div>
                </SectionCard>
              </div>
            </div>
          )}

          {area === "materials" && (
            <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <SectionCard title="Cobertura dos mínimos" description="Um material pode cobrir mais de uma informação.">
                <div>{minimums.map((item) => (
                  <div key={item.id}>
                    <MinimumRow item={item} />
                    {manualClaims[item.id] ? <p className="mb-2 text-xs text-hk-muted">Indicação: {manualClaims[item.id].excerpt}</p> : null}
                    {item.status === "pending" && customer.materials.some((material) => material.status === "Processado") ? (
                      <Button size="sm" variant="outline" className="mb-3" onClick={() => { setManualTarget(item); setManualSource(""); setManualExcerpt(""); }}>Indicar cobertura</Button>
                    ) : null}
                  </div>
                ))}</div>
                <p className="mt-3 text-xs text-hk-muted">Uma indicação manual sempre aponta para material processado. A conferência ocorre na avaliação geral.</p>
              </SectionCard>
              <div className="space-y-5">
                <SectionCard title="Adicionar material" description="Entrada rápida de arquivo, ata ou texto.">
                  <div className="flex gap-2">
                    <Button variant={materialType === "file" ? "default" : "outline"} onClick={() => setMaterialType("file")}>Arquivo</Button>
                    <Button variant={materialType === "text" ? "default" : "outline"} onClick={() => setMaterialType("text")}>Texto</Button>
                  </div>
                  {materialType === "file" ? (
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="activation-file">Selecionar arquivo</Label>
                      <Input id="activation-file" type="file" onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")} />
                      {fileName ? <p className="text-xs text-hk-muted">Selecionado localmente: {fileName}</p> : null}
                    </div>
                  ) : (
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="activation-text">Conteúdo</Label>
                      <Textarea id="activation-text" value={textDraft} onChange={(event) => setTextDraft(event.target.value)} placeholder="Cole aqui uma ata ou outra informação recebida." rows={6} />
                    </div>
                  )}
                  <Button disabled className="mt-4">Enviar material</Button>
                  <p className="mt-2 text-xs text-hk-muted">Envio disponível após a integração.</p>
                </SectionCard>
                <SectionCard title="Acervo enviado" description="Materiais e cobertura identificada.">
                  {customer.materials.length === 0 ? <p className="text-sm text-hk-muted">Nenhum material recebido.</p> : (
                    <ul className="divide-y divide-hk-divider">
                      {customer.materials.map((item) => (
                        <li key={item.id} className="py-3 first:pt-0">
                          <p className="text-sm font-semibold text-hk-deep">{item.title}</p>
                          <p className="mt-1 text-xs text-hk-muted">{item.kind} · {item.status}</p>
                          <p className="mt-1 text-xs text-hk-ink">{item.covers.length ? `Cobertura: ${item.covers.join(", ")}` : "Cobertura ainda não identificada."}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </SectionCard>
              </div>
            </div>
          )}

          {area === "connections" && (
            <SectionCard title="Conexões do cliente" description="A ausência de uma plataforma pode limitar a análise; não bloqueia automaticamente a Ativação.">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {customer.connections.map((item) => (
                  <div key={item.name} className="rounded-lg border border-hk-border-subtle p-4">
                    <p className="text-sm font-semibold text-hk-deep">{item.name}</p>
                    <p className="mt-1 text-xs text-hk-muted">{item.state}{item.detail ? ` · ${item.detail}` : ""}</p>
                    <Button disabled variant="outline" size="sm" className="mt-4">{item.state === "Renovar acesso" ? "Renovar" : item.state === "Conectado" ? "Ver recurso" : "Conectar"}</Button>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-hk-muted">Conectar e renovar estarão disponíveis após a integração desta área.</p>
            </SectionCard>
          )}

          {area === "evaluation" && (
            <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
              <SectionCard title="Avaliação geral" description="Análise qualitativa do conjunto reunido para este cliente.">
                {evaluationState === "not-ready" && (
                  <div className="flex gap-3 rounded-lg bg-hk-warning-soft p-4 text-sm text-hk-ink">
                    <CircleAlert className="size-5 shrink-0 text-hk-warning" aria-hidden />
                    <p>A avaliação ainda não pode ser solicitada. {minimums.filter((item) => item.status === "pending").length} mínimo(s) pendente(s) e {minimums.filter((item) => item.status === "processing").length} em processamento. Consulte Materiais para ver as fontes.</p>
                  </div>
                )}
                {evaluationState === "ready" && <p className="text-sm text-hk-ink">Todos os mínimos estão cobertos por materiais processados. A indicação manual será conferida na avaliação.</p>}
                {evaluationState === "running" && <p role="status" className="text-sm text-hk-ink">Avaliação em andamento. O processamento pode demorar; não é necessário manter esta página aberta.</p>}
                {evaluationState === "failed" && <p role="alert" className="text-sm text-hk-ink">A avaliação foi interrompida por falha técnica. Os materiais permanecem disponíveis para uma nova tentativa.</p>}
                {evaluationState === "review" && (
                  <div className="space-y-4 text-sm text-hk-ink">
                    <div className="rounded-lg border border-hk-warning/30 bg-hk-warning-soft p-4">
                      <p className="font-semibold text-hk-deep">Solicitação · documento financeiro</p>
                      <p className="mt-1">O objetivo declarado pede contexto financeiro adicional para sustentar a análise. O Admin pode complementar ou seguir ciente da limitação.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-hk-deep">Parecer completo</h3>
                      <p className="mt-1 text-hk-muted">Os mínimos foram identificados. Uma conexão ainda está indisponível e pode limitar a leitura de desempenho. A indicação manual de contexto do negócio requer conferência.</p>
                    </div>
                  </div>
                )}
                {evaluationState === "active" && <p className="text-sm text-hk-ink">Ativação autorizada. A análise estratégica pode ser iniciada em etapa futura.</p>}
                <div className="mt-5 flex flex-wrap gap-2">
                  {evaluationState === "not-ready" && <Button disabled>Solicitar avaliação geral</Button>}
                  {evaluationState === "ready" && <Button onClick={() => updateEvaluation("running", "Avaliação em andamento", "Aguardar resultado")} className="bg-hk-action text-white hover:bg-hk-strong">Solicitar avaliação geral</Button>}
                  {evaluationState === "running" && <Button onClick={() => updateEvaluation("review", "Revisão necessária", "Revisar solicitações da avaliação")} variant="outline">Ver resultado</Button>}
                  {evaluationState === "failed" && <Button onClick={() => updateEvaluation("running", "Avaliação em andamento", "Aguardar resultado")} variant="outline">Tentar novamente</Button>}
                  {evaluationState === "review" && (
                    <>
                      <Button variant="outline" onClick={() => openArea("materials")}>Complementar materiais</Button>
                      <Button onClick={() => setConfirmOpen(true)} className="bg-hk-action text-white hover:bg-hk-strong">Autorizar Ativação</Button>
                    </>
                  )}
                  {evaluationState === "active" && <Button disabled>Iniciar análise estratégica · etapa futura</Button>}
                </div>
              </SectionCard>
              <SectionCard title="Caminho da decisão">
                <ol className="space-y-4 text-sm text-hk-ink">
                  <li className="flex gap-2"><BookOpen className="size-4 shrink-0 text-hk-action" aria-hidden /> Materiais enviados e processados.</li>
                  <li className="flex gap-2"><ShieldCheck className="size-4 shrink-0 text-hk-action" aria-hidden /> Cobertura mínima revisada.</li>
                  <li className="flex gap-2"><Clock3 className="size-4 shrink-0 text-hk-action" aria-hidden /> Parecer geral e decisão do Admin.</li>
                </ol>
              </SectionCard>
            </div>
          )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Autorizar Ativação?</DialogTitle>
            <DialogDescription>A avaliação aponta uma solicitação documental e uma conexão indisponível. Você pode seguir ciente dessas limitações.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Voltar</Button>
            <Button onClick={() => { updateEvaluation("active", "Ativação autorizada", "Iniciar análise estratégica"); setConfirmOpen(false); }} className="bg-hk-action text-white hover:bg-hk-strong">Autorizar mesmo assim</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={manualTarget !== null} onOpenChange={(open) => { if (!open) setManualTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Indicar cobertura</DialogTitle>
            <DialogDescription>Vincule “{manualTarget?.label}” a um material já processado. A avaliação geral ainda deverá conferir esta indicação.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="activation-manual-source">Material processado</Label>
            <select id="activation-manual-source" value={manualSource} onChange={(event) => setManualSource(event.target.value)} className="h-9 w-full rounded-lg border border-hk-border bg-hk-surface px-3 text-sm text-hk-ink">
              <option value="">Selecione um material</option>
              {customer.materials.filter((item) => item.status === "Processado").map((item) => <option key={item.id} value={item.title}>{item.title}</option>)}
            </select>
            <Label htmlFor="activation-manual-excerpt">Trecho ou motivo da indicação</Label>
            <Textarea id="activation-manual-excerpt" value={manualExcerpt} onChange={(event) => setManualExcerpt(event.target.value)} rows={3} placeholder="Onde esta informação aparece no material?" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setManualTarget(null)}>Cancelar</Button>
            <Button disabled={!manualTarget || !manualSource || !manualExcerpt.trim()} onClick={() => {
              if (manualTarget) setManualClaims((current) => ({
                ...current,
                [manualTarget.id]: { source: manualSource, excerpt: manualExcerpt.trim() },
              }));
              setManualTarget(null);
            }}>Indicar cobertura</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
