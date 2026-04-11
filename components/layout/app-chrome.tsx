"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { AppSidebar } from "./app-sidebar";
import { AppTopbar } from "./app-topbar";
import Link from "next/link";

const STORAGE_KEY = "hk.sidebar.collapsed";

export function AppChrome({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === "1") setCollapsed(true);
    } catch {
      /* ignore */
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.style.setProperty(
      "--hk-sidebar-current",
      collapsed ? "var(--hk-sidebar-collapsed)" : "var(--hk-sidebar-width)",
    );
  }, [collapsed, mounted]);

  const toggleSidebar = useCallback(() => {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return (
    <div className="hk-app-root min-h-svh">
      <AppSidebar
        collapsed={collapsed}
        onToggle={toggleSidebar}
        mounted={mounted}
      />
      <div className="flex min-h-svh flex-col transition-[padding] duration-200 ease-out md:pl-[var(--hk-sidebar-current)]">
        <AppTopbar />
        <main className="hk-main min-w-0 flex-1">{children}</main>
        <footer className="border-t border-hk-divider hk-footer-surface px-4 py-3 sm:px-5 lg:px-8">
          <nav
            aria-label="Institucional"
            className="mx-auto flex max-w-[var(--hk-content-max)] flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-medium tracking-wide text-hk-muted"
          >
            <Link
              href="/legal/termos"
              className="transition-colors hover:text-hk-action"
            >
              Termos de uso
            </Link>
            <span className="text-hk-divider" aria-hidden>
              ·
            </span>
            <Link
              href="/legal/privacidade"
              className="transition-colors hover:text-hk-action"
            >
              Privacidade
            </Link>
            <span className="text-hk-divider" aria-hidden>
              ·
            </span>
            <Link
              href="/configuracoes/legal"
              className="transition-colors hover:text-hk-action"
            >
              Configurações legais
            </Link>
          </nav>
        </footer>
      </div>
    </div>
  );
}
