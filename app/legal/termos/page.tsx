import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Termos de Uso da plataforma ho.ko AI.nalytics para acesso e utilização do serviço.",
};

const sections = [
  {
    title: "1. Aceitação dos termos",
    body: [
      "Estes Termos de Uso regulam o acesso e a utilização da plataforma ho.ko AI.nalytics. Ao acessar ou utilizar a plataforma, o usuário declara que leu, compreendeu e concorda com estes termos.",
      "Caso o usuário utilize a plataforma em nome de uma empresa, agência ou organização, declara possuir autorização para aceitar estes termos em nome dessa organização.",
    ],
  },
  {
    title: "2. Descrição do serviço",
    body: [
      "A ho.ko AI.nalytics é uma plataforma SaaS para organização de clientes, conexões com plataformas externas, visualização de métricas, dashboards, relatórios, planejamento e análises assistidas.",
      "A plataforma pode se integrar a serviços de terceiros, como Google Analytics, Google Ads, YouTube, Meta/Facebook, Instagram e LinkedIn, sempre de acordo com as permissões concedidas pelo usuário ou pela organização cliente.",
    ],
  },
  {
    title: "3. Conta e responsabilidades do usuário",
    body: [
      "O usuário é responsável por manter a confidencialidade de suas credenciais de acesso e por todas as atividades realizadas em sua conta.",
      "O usuário deve fornecer informações corretas, manter permissões adequadas nas plataformas conectadas e garantir que possui autorização para conectar contas, propriedades, páginas, perfis, canais ou contas de anúncios de terceiros.",
    ],
  },
  {
    title: "4. Integrações com terceiros",
    body: [
      "A ho.ko AI.nalytics depende de APIs e serviços fornecidos por terceiros. Alterações, indisponibilidades, limitações, políticas, revisões de acesso ou mudanças nessas plataformas podem afetar funcionalidades da aplicação.",
      "O usuário pode revogar permissões concedidas a serviços externos a qualquer momento. A revogação pode limitar ou interromper a atualização de dados na plataforma.",
    ],
  },
  {
    title: "5. Uso permitido",
    body: [
      "O usuário concorda em utilizar a plataforma apenas para fins lícitos, profissionais e compatíveis com estes termos.",
      "É proibido tentar acessar dados de terceiros sem autorização, interferir no funcionamento do serviço, realizar engenharia reversa, explorar vulnerabilidades, contornar controles de acesso ou usar a plataforma para atividades ilegais, abusivas ou fraudulentas.",
    ],
  },
  {
    title: "6. Dados e relatórios",
    body: [
      "Os dados exibidos na plataforma dependem da disponibilidade, qualidade e permissões das fontes conectadas. A ho.ko AI.nalytics busca apresentar informações úteis e organizadas, mas não garante que dados de terceiros estejam sempre completos, atualizados ou livres de inconsistências.",
      "Relatórios, análises e recomendações geradas pela plataforma têm finalidade informativa e devem ser avaliados pelo usuário antes de qualquer decisão comercial, estratégica, financeira ou operacional.",
    ],
  },
  {
    title: "7. Propriedade intelectual",
    body: [
      "A plataforma, sua interface, marca, tecnologia, código, estrutura, fluxos, textos, componentes e elementos visuais pertencem à ho.ko AI.nalytics ou a seus licenciadores.",
      "O uso da plataforma não transfere ao usuário qualquer direito de propriedade intelectual sobre o serviço.",
    ],
  },
  {
    title: "8. Limitação de responsabilidade",
    body: [
      "Na máxima extensão permitida pela legislação aplicável, a ho.ko AI.nalytics não será responsável por perdas indiretas, lucros cessantes, perda de dados, interrupções causadas por terceiros, decisões tomadas com base em relatórios ou falhas originadas em plataformas externas.",
      "A plataforma é fornecida conforme disponibilidade operacional razoável, podendo passar por manutenções, atualizações e ajustes técnicos.",
    ],
  },
  {
    title: "9. Alterações dos termos",
    body: [
      "Podemos atualizar estes Termos de Uso periodicamente para refletir mudanças legais, operacionais ou funcionais. A versão publicada nesta página será a versão vigente.",
    ],
  },
  {
    title: "10. Contato",
    body: [
      "Para dúvidas sobre estes Termos de Uso, entre em contato pelo e-mail: contato@hokocomunicacao.com.br.",
    ],
  },
];

export default function TermosPage() {
  return (
    <main className="min-h-svh bg-hk-canvas px-4 py-10 text-hk-ink">
      <article className="mx-auto max-w-4xl rounded-lg border border-hk-border bg-hk-surface p-6 shadow-hk-sm md:p-8">
        <header className="border-b border-hk-border-subtle pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-hk-muted">
            ho.ko AI.nalytics
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-hk-deep">
            Termos de Uso
          </h1>
          <p className="mt-3 text-sm leading-6 text-hk-muted">
            Última atualização: 16 de junho de 2026.
          </p>
        </header>

        <div className="mt-7 space-y-7">
          {sections.map((section) => (
            <section key={section.title} className="space-y-3">
              <h2 className="text-lg font-semibold text-hk-deep">
                {section.title}
              </h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-7 text-hk-muted">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
