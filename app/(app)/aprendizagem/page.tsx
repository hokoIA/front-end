import { CustomerMockPage } from "@/features/v2-navigation/customer-mock-page";

export default function AprendizagemPage() {
  return <CustomerMockPage title="Aprendizagem & Histórico" description="Relatórios consolidados e histórico dos ciclos concluídos deste cliente ficarão disponíveis aqui." sections={[
    { title: "Avaliações de ciclos", detail: "Relatório consolidado de cada ciclo concluído." },
    { title: "Resultados", detail: "Evidências e resultados observados, com seus limites." },
    { title: "Decisões", detail: "Propostas e deliberações preservadas no histórico." },
    { title: "Aprendizados", detail: "Síntese para orientar os ciclos seguintes." },
  ]} />;
}
