import { ModulePlaceholder } from "@/components/data-display/module-placeholder";
import { LifeBuoy } from "lucide-react";

export default function AjudaPage() {
  return (
    <ModulePlaceholder
      title="Ajuda"
      description="Canais de suporte, SLA e base de conhecimento. Conteúdo editorial pode ser estático ou CMS."
      emptyTitle="Suporte"
      emptyDescription="Inclua links para documentação e contato quando o material estiver disponível."
      icon={LifeBuoy}
    />
  );
}
