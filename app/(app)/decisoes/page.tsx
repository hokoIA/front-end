import { CustomerMockPage } from "@/features/v2-navigation/customer-mock-page";

export default function DecisoesPage() {
  return (
    <CustomerMockPage
      title="Central de Decisões"
      description="Propostas pontuais do ciclo que exigem atenção e deliberação no contexto deste cliente."
      sections={[
        {
          title: "Pendentes",
          detail: "Propostas que ainda aguardam uma decisão humana.",
        },
        {
          title: "Aceitas",
          detail: "Decisões aprovadas e seus fundamentos no ciclo de origem.",
        },
        {
          title: "Descartadas / Expiradas",
          detail: "Histórico preservado sem manter propostas antigas como pendências.",
        },
        {
          title: "Contexto do ciclo",
          detail: "Acesso futuro às evidências e ao período que originaram cada proposta.",
        },
      ]}
    />
  );
}
