import { ModulePlaceholder } from "@/components/data-display/module-placeholder";
import { LineChart } from "lucide-react";

export default function AnalisesPage() {
  return (
    <ModulePlaceholder
      title="Análises"
      description="Análises assistidas por IA sobre o contexto do cliente. Respeita o contrato do serviço de análise dedicado."
      emptyTitle="Área pronta para análise"
      emptyDescription="Envie perguntas e contexto quando o backend de análise estiver configurado. Nada é exibido aqui até haver consultas reais."
      icon={LineChart}
    />
  );
}
