import { ModulePlaceholder } from "@/components/data-display/module-placeholder";
import { Target } from "lucide-react";

export default function MetasPage() {
  return (
    <ModulePlaceholder
      title="Planejamento Estratégico"
      description="Metas, ações e acompanhamento alinhados ao ciclo comercial. Dados provenientes da API de goals."
      emptyTitle="Sem metas cadastradas"
      emptyDescription="Crie metas e vincule ações sugeridas ou geradas quando a API estiver conectada."
      icon={Target}
    />
  );
}
