import { ModulePlaceholder } from "@/components/data-display/module-placeholder";
import { CreditCard } from "lucide-react";

export default function AssinaturaPage() {
  return (
    <ModulePlaceholder
      title="Assinatura"
      description="Planos, checkout e portal de cobrança (/api/billing/*)."
      emptyTitle="Billing"
      emptyDescription="Estado do plano e ações de upgrade serão carregados da API de billing."
      icon={CreditCard}
    />
  );
}
