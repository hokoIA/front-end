import { CustomerMockPage } from "@/features/v2-navigation/customer-mock-page";

export default function CiclosPage() {
  return <CustomerMockPage title="Ciclos Operacionais" description="A agência iniciará manualmente cada ciclo com período e objetivos vigentes. Durante o período, o OIDEA rotineiro observará e interpretará sinais e proporá decisões apenas quando necessário." showStart sections={[
    { title: "Ciclo atual", detail: "Acompanhamento futuro do período e dos objetivos vigentes." },
    { title: "Histórico de ciclos", detail: "Consulta futura aos ciclos concluídos deste cliente." },
  ]} />;
}
