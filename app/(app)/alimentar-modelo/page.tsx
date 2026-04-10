import { ModulePlaceholder } from "@/components/data-display/module-placeholder";
import { BookOpen } from "lucide-react";

export default function AlimentarModeloPage() {
  return (
    <ModulePlaceholder
      title="Base de Contexto"
      description="Documentos e materiais que enriquecem o contexto da IA. Integração preparada para o endpoint de armazenamento de documentos."
      emptyTitle="Nenhum documento indexado"
      emptyDescription="Faça upload ou sincronize fontes aprovadas pela governança do cliente. Esta área não usa dados fictícios."
      icon={BookOpen}
    />
  );
}
