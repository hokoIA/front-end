import { PageHeader } from "@/components/data-display/page-header";

const sections = [
  { title: "Pendentes", detail: "Propostas que aguardam deliberação da agência." },
  { title: "Aceitas", detail: "Decisões aprovadas e seus fundamentos." },
  { title: "Descartadas / Expiradas", detail: "Histórico de propostas sem vigência." },
  { title: "Ciclo de origem", detail: "Acesso futuro ao contexto e às evidências de cada proposta." },
];

export default function DecisoesPage() {
  return (
    <div className="hk-page space-y-6 py-6">
      <PageHeader eyebrow="Agência" title="Central de Decisões" description="Espaço futuro para propostas relevantes da inteligência OIDEA de todos os clientes, sem selecionar um cliente antes." />
      <p className="rounded-lg border border-hk-info/20 bg-hk-info-soft px-4 py-3 text-sm text-hk-info">Estrutura visual V2</p>
      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <section key={section.title} className="hk-section min-h-36 p-5" aria-label={section.title}>
            <h2 className="text-base font-semibold text-hk-deep">{section.title}</h2>
            <p className="mt-2 text-sm text-hk-muted">{section.detail}</p>
            <p className="mt-4 text-xs text-hk-muted">Nenhum dado conectado nesta etapa.</p>
          </section>
        ))}
      </div>
    </div>
  );
}
