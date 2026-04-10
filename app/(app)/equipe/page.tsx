import { ModulePlaceholder } from "@/components/data-display/module-placeholder";
import { Users } from "lucide-react";

export default function EquipePage() {
  return (
    <ModulePlaceholder
      title="Equipe"
      description="Membros, convites e papéis (RBAC). Operações mapeadas para os endpoints de team e rbac."
      emptyTitle="Equipe e permissões"
      emptyDescription="Convide colaboradores e gerencie funções quando a API de equipe estiver disponível."
      icon={Users}
    />
  );
}
