"use client";

import { SETTINGS_NAV_ITEMS } from "../constants/nav";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SettingsNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Configurações"
      className="rounded-xl border border-hk-border bg-hk-surface p-2 shadow-hk-sm"
    >
      <ul className="flex flex-col gap-0.5">
        {SETTINGS_NAV_ITEMS.map((item) => {
          const active =
            item.href === "/configuracoes"
              ? pathname === "/configuracoes"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "block rounded-lg border px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "border-hk-border bg-hk-deep/[0.08] font-medium text-hk-deep"
                    : "border-transparent text-hk-muted hover:border-hk-border-subtle hover:bg-hk-surface-muted hover:text-hk-ink",
                )}
              >
                <span className="block">{item.label}</span>
                <span className="mt-0.5 block text-xs font-normal text-hk-muted">
                  {item.description}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
