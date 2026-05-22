// app/legal/privacidade/page.tsx
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacidadePage() {
    return (
        <main className="min-h-svh bg-hk-page px-4 py-10">
            <div className="mx-auto max-w-4xl space-y-6">
                <div>
                    <h1 className="text-3xl font-semibold text-hk-deep">
                        Política de Privacidade
                    </h1>
                    <p className="mt-2 text-sm text-hk-muted">
                        Política de privacidade e tratamento de dados da ho.ko AI.nalytics.
                    </p>
                </div>

                <Card className="border-hk-border">
                    <CardContent className="space-y-4 pt-6 text-sm leading-relaxed text-hk-muted">
                        <p>
                            Descreva aqui como dados pessoais e métricas são coletados,
                            processados, retidos e compartilhados, em conformidade com a LGPD
                            e demais normas aplicáveis ao seu público.
                        </p>

                        <p>
                            Inclua informações sobre subprocessadores, transferência
                            internacional, direitos dos titulares e canal de contato do
                            encarregado.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}