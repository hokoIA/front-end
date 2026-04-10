import { PageHeader } from "@/components/data-display/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacidadePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Privacidade"
        description="Política de privacidade e tratamento de dados. Alinhar ao DPA e às bases legais de cada mercado."
      />
      <Card className="border-hk-border">
        <CardContent className="space-y-4 pt-6 text-sm leading-relaxed text-hk-muted">
          <p>
            Descreva aqui como dados pessoais e métricas são coletados,
            processados, retidos e compartilhados, em conformidade com a LGPD e
            demais normas aplicáveis ao seu público.
          </p>
          <p>
            Inclua informações sobre subprocessadores, transferência internacional
            (se houver), direitos dos titulares e canal de contato do encarregado.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
