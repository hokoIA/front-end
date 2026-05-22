// app/legal/termos/page.tsx
import { Card, CardContent } from "@/components/ui/card";

export default function TermosPage() {
    return (
        <main className="min-h-svh bg-hk-page px-4 py-10">
            <div className="mx-auto max-w-4xl space-y-6">
                <div>
                    <h1 className="text-3xl font-semibold text-hk-deep">
                        Termos de Uso
                    </h1>
                    <p className="mt-2 text-sm text-hk-muted">
                        Termos de uso da plataforma ho.ko AI.nalytics.
                    </p>
                </div>

                <Card className="border-hk-border">
                    <CardContent className="space-y-4 pt-6 text-sm leading-relaxed text-hk-muted">
                        <p>
                            Este espaço destina-se ao texto oficial dos termos de uso do
                            serviço, incluindo escopo de licença, obrigações do cliente,
                            limitação de responsabilidade e legislação aplicável.
                        </p>

                        <p>
                            A versão publicada aqui deve refletir o contrato vigente entre a
                            ho.ko e a organização cliente. Atualize este conteúdo com o
                            documento jurídico final antes do go-live.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}