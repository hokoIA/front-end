import type { ReactNode } from "react";
import Link from "next/link";
import { AppSidebar } from "./app-sidebar";
import { AppTopbar } from "./app-topbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-hk-canvas">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
        <footer className="border-t border-hk-border-subtle px-4 py-3 md:px-8">
          <nav
            aria-label="Institucional"
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-hk-muted"
          >
            <Link
              href="/legal/termos"
              className="hover:text-hk-action hover:underline"
            >
              Termos de uso
            </Link>
            <span className="text-hk-border" aria-hidden>
              ·
            </span>
            <Link
              href="/legal/privacidade"
              className="hover:text-hk-action hover:underline"
            >
              Privacidade
            </Link>
            <span className="text-hk-border" aria-hidden>
              ·
            </span>
            <Link
              href="/configuracoes/legal"
              className="hover:text-hk-action hover:underline"
            >
              Configurações legais
            </Link>
          </nav>
        </footer>
      </div>
    </div>
  );
}
