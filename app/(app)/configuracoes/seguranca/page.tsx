import { ModulePlaceholder } from "@/components/data-display/module-placeholder";
import { Shield } from "lucide-react";

export default function SegurancaPage() {
  return (
    <ModulePlaceholder
      title="Segurança"
      description="Sessão baseada em cookie HttpOnly, boas práticas e futuras opções de 2FA conforme produto."
      emptyTitle="Postura de segurança"
      emptyDescription="Conteúdo específico de segurança será adicionado quando o fluxo estiver definido com o backend."
      icon={Shield}
    />
  );
}
