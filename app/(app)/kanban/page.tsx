import { ModulePlaceholder } from "@/components/data-display/module-placeholder";
import { Columns3 } from "lucide-react";

export default function KanbanPage() {
  return (
    <ModulePlaceholder
      title="Kanban"
      description="Quadro operacional com colunas, cartões e etiquetas. Implementação futura com dnd-kit e API kanban."
      emptyTitle="Quadro não montado"
      emptyDescription="A estrutura de arrastar e soltar e os dados do quadro serão carregados a partir da API dedicada."
      icon={Columns3}
    />
  );
}
