import { ModulePlaceholder } from "@/components/data-display/module-placeholder";
import { BriefcaseBusiness } from "lucide-react";

export default function ClientesPage() {
  return (
    <ModulePlaceholder
      title="Clientes & Integrações"
      description="Cadastro de clientes e conexões com Meta, Google Analytics, LinkedIn e YouTube. Contratos existentes do backend serão respeitados."
      emptyTitle="Gestão de clientes"
      emptyDescription="Liste clientes, configure integrações e status de conexão. Esta tela será preenchida com dados reais da API."
      icon={BriefcaseBusiness}
    />
  );
}
