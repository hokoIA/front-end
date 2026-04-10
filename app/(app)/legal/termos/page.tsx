import { PageHeader } from "@/components/data-display/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function TermosPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Termos de uso"
        description="Texto legal de referência para o workspace ho.ko AI.nalytics. Substitua pelo documento jurídico final."
      />
      <Card className="border-hk-border">
        <CardContent className="space-y-4 pt-6 text-sm leading-relaxed text-hk-muted">
          <p>
            Este espaço destina-se ao texto oficial dos termos de uso do serviço,
            incluindo escopo de licença, obrigações do cliente, limitação de
            responsabilidade e legislação aplicável.
          </p>
          <p>
            A versão publicada aqui deve refletir o contrato vigente entre a ho.ko
            e a organização cliente. Atualize este conteúdo com o departamento
            jurídico antes do go-live.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
