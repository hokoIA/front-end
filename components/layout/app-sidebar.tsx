"use client";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NavLinks } from "./nav-links";

type AppSidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const width = collapsed
    ? "var(--hk-sidebar-collapsed)"
    : "var(--hk-sidebar-width)";

  return (
    <aside
      className={cn(
        "hk-print-hide fixed inset-y-0 left-0 z-40 hidden flex-col hk-sidebar-surface md:flex",
        "border-r border-hk-divider",
        "shadow-[inset_-1px_0_0_rgba(14,14,82,0.03)]",
        "transition-[width] duration-200 ease-out",
      )}
      style={{ width }}
      aria-label="Navegação principal"
    >
      <div
        className={cn(
          "flex h-[3.35rem] shrink-0 items-center border-b border-hk-divider/80 px-3 lg:h-14 lg:px-4",
          collapsed && "justify-center px-2",
        )}
      >
        <Logo collapsed={collapsed} />
      </div>

      <nav className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden px-2.5 py-5 [scrollbar-width:thin]">
        <NavLinks collapsed={collapsed} />
      </nav>

      <div
        className={cn(
          "shrink-0 border-t border-hk-divider/80 p-2.5",
          collapsed && "flex justify-center",
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          className={cn(
            "w-full text-hk-muted hover:bg-hk-deep/[0.045] hover:text-hk-deep",
            !collapsed && "justify-start gap-2 px-2.5",
          )}
          onClick={onToggle}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <>
              <ChevronLeft className="size-4" />
              <span className="text-xs font-medium">Recolher</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
