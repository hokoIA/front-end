"use client";

import { cn } from "@/lib/utils/cn";
import { MAIN_NAV_SECTIONS } from "@/lib/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinksProps = {
  collapsed: boolean;
  onNavigate?: () => void;
};

export function NavLinks({ collapsed, onNavigate }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-6">
      {MAIN_NAV_SECTIONS.map((section) => (
        <div key={section.title}>
          {!collapsed && (
            <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-hk-muted">
              {section.title}
            </p>
          )}
          <ul className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    onClick={() => onNavigate?.()}
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors",
                      collapsed && "justify-center px-0",
                      active
                        ? "bg-hk-deep/10 text-hk-deep font-medium"
                        : "text-hk-muted hover:bg-hk-canvas hover:text-hk-ink",
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-[18px] shrink-0 transition-colors",
                        active
                          ? "text-hk-action"
                          : "text-hk-muted group-hover:text-hk-action",
                      )}
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    {!collapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
