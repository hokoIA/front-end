"use client";

import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  analises: "Análises",
  "alimentar-modelo": "Base de Contexto",
  metas: "Planejamento Estratégico",
  clientes: "Clientes & Integrações",
  equipe: "Equipe",
  kanban: "Kanban",
  configuracoes: "Configurações",
  conta: "Conta",
  assinatura: "Assinatura",
  seguranca: "Segurança",
  ajuda: "Ajuda & suporte",
  legal: "Legal",
  termos: "Termos de uso",
  privacidade: "Privacidade",
};

function segmentLabel(segment: string): string {
  return LABELS[segment] ?? segment.replace(/-/g, " ");
}

export function Breadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const crumbs = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    return { href, label: segmentLabel(seg), isLast: i === segments.length - 1 };
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "text-xs font-medium tracking-[0.01em] text-hk-muted",
        className,
      )}
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {crumbs.map((c, i) => (
          <li key={c.href} className="flex items-center gap-1.5">
            {i > 0 && (
              <span className="font-normal text-hk-divider" aria-hidden>
                /
              </span>
            )}
            {c.isLast ? (
              <span className="font-semibold tracking-normal text-hk-deep">
                {c.label}
              </span>
            ) : (
              <Link
                href={c.href}
                className="font-medium tracking-normal text-hk-muted transition-colors hover:text-hk-action"
              >
                {c.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
