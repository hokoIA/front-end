import { ModulePlaceholder } from "@/components/data-display/module-placeholder";
import { User } from "lucide-react";

export default function ContaPage() {
  return (
    <ModulePlaceholder
      title="Conta"
      description="Perfil, avatar e atualização cadastral via /api/profile e /api/update."
      emptyTitle="Dados de perfil"
      emptyDescription="As informações da conta serão exibidas após integração com a API de perfil."
      icon={User}
    />
  );
}
