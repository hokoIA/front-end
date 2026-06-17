import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Política de Privacidade da ho.ko AI.nalytics para clientes, usuários e integrações de dados.",
};

const sections = [
  {
    title: "1. Quem somos",
    body: [
      "A ho.ko AI.nalytics é uma plataforma de análise e relatórios para equipes de marketing, agências e empresas que desejam centralizar informações de clientes, integrações, métricas, campanhas e conteúdos.",
      "Esta Política de Privacidade explica como coletamos, usamos, armazenamos e protegemos dados pessoais e dados de plataformas conectadas à aplicação.",
    ],
  },
  {
    title: "2. Dados que podemos coletar",
    body: [
      "Podemos coletar dados cadastrais, como nome, e-mail, telefone, empresa, cargo e informações de acesso à conta.",
      "Também podemos tratar dados de clientes cadastrados na plataforma, registros operacionais, preferências de uso, logs técnicos, métricas de navegação e informações necessárias para segurança, autenticação e suporte.",
      "Quando o usuário autoriza integrações, podemos acessar dados de plataformas como Google Analytics, Google Ads, YouTube, Meta/Facebook, Instagram e LinkedIn, conforme as permissões concedidas pelo próprio usuário.",
    ],
  },
  {
    title: "3. Como usamos os dados",
    body: [
      "Usamos os dados para operar a plataforma, autenticar usuários, organizar clientes, exibir dashboards, gerar relatórios, processar métricas, oferecer suporte, melhorar a experiência do usuário e manter a segurança do serviço.",
      "Dados de plataformas conectadas são usados apenas para fins de análise, relatórios e visualização dentro da ho.ko AI.nalytics.",
    ],
  },
  {
    title: "4. Uso de dados do Google",
    body: [
      "Quando um usuário conecta uma Conta Google, a ho.ko AI.nalytics acessa somente os dados autorizados por esse usuário, de acordo com os escopos exibidos na tela de consentimento do Google.",
      "Dados do Google Ads podem ser usados para listar contas acessíveis pelo usuário, permitir a seleção da conta correta e exibir métricas de campanhas, grupos de anúncios, anúncios, custos, impressões, cliques, conversões e indicadores de performance em dashboards.",
      "Dados do Google Analytics podem ser usados para listar propriedades autorizadas e exibir métricas agregadas de tráfego e desempenho.",
      "A ho.ko AI.nalytics não vende dados do Google, não usa esses dados para publicidade própria, não transfere esses dados para redes de anúncios e não utiliza os dados para criar perfis publicitários.",
      "O uso e a transferência de informações recebidas das APIs do Google obedecem à Google API Services User Data Policy, incluindo os requisitos de Limited Use.",
    ],
  },
  {
    title: "5. Compartilhamento",
    body: [
      "Não vendemos dados pessoais. Podemos compartilhar dados apenas quando necessário para operar a plataforma, cumprir obrigações legais, proteger direitos, prevenir fraude, prestar suporte ou utilizar fornecedores essenciais de infraestrutura, hospedagem, autenticação, processamento e comunicação.",
      "Fornecedores que processam dados em nosso nome devem atuar conforme instruções da ho.ko AI.nalytics e adotar medidas adequadas de segurança.",
    ],
  },
  {
    title: "6. Segurança e retenção",
    body: [
      "Adotamos medidas técnicas e organizacionais para proteger dados contra acesso não autorizado, perda, alteração indevida ou divulgação não autorizada.",
      "Mantemos os dados pelo tempo necessário para prestação do serviço, cumprimento de obrigações legais, auditoria, resolução de disputas e segurança da plataforma.",
    ],
  },
  {
    title: "7. Direitos dos titulares",
    body: [
      "Usuários podem solicitar acesso, correção, atualização, exclusão, portabilidade, limitação de uso ou informações sobre o tratamento de seus dados, conforme a legislação aplicável.",
      "Também é possível revogar permissões concedidas a plataformas externas diretamente na conta da respectiva plataforma ou solicitando suporte à ho.ko AI.nalytics.",
    ],
  },
  {
    title: "8. Contato",
    body: [
      "Para dúvidas, solicitações de privacidade ou exercício de direitos, entre em contato pelo e-mail: contato@hokocomunicacao.com.br.",
    ],
  },
];

export default function PrivacidadePage() {
  return (
    <main className="min-h-svh bg-hk-canvas px-4 py-10 text-hk-ink">
      <article className="mx-auto max-w-4xl rounded-lg border border-hk-border bg-hk-surface p-6 shadow-hk-sm md:p-8">
        <header className="border-b border-hk-border-subtle pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-hk-muted">
            ho.ko AI.nalytics
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-hk-deep">
            Política de Privacidade
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
