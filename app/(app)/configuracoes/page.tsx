import { PageHeader } from "@/components/data-display/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const LINKS = [
  {
    href: "/configuracoes/conta",
    title: "Conta",
    description: "Perfil, dados cadastrais e preferências de uso.",
  },
  {
    href: "/configuracoes/assinatura",
    title: "Assinatura",
    description: "Plano, faturamento e portal do provedor de pagamento.",
  },
  {
    href: "/configuracoes/seguranca",
    title: "Segurança",
    description: "Sessões, dispositivos e boas práticas corporativas.",
  },
  {
    href: "/configuracoes/ajuda",
    title: "Ajuda",
    description: "Documentação, suporte e canais oficiais.",
  },
] as const;

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Configurações"
        description="Central de governança do workspace. Cada seção evoluirá com as APIs de conta e billing."
      />
      <ul className="grid gap-3 sm:grid-cols-2">
        {LINKS.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="group block">
              <Card className="h-full border-hk-border transition-colors hover:border-hk-action/30 hover:shadow-hk-sm">
                <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
                  <div className="min-w-0 space-y-1">
                    <CardTitle className="text-base text-hk-deep group-hover:text-hk-action">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {item.description}
                    </CardDescription>
                  </div>
                  <ChevronRight
                    className="size-4 shrink-0 text-hk-muted transition-transform group-hover:translate-x-0.5 group-hover:text-hk-action"
                    aria-hidden
                  />
                </CardHeader>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
