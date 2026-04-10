"use client";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLinks } from "./nav-links";

const STORAGE_KEY = "hk.sidebar.collapsed";

export function AppSidebar() {
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

  const toggle = () => {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const width = collapsed ? "var(--hk-sidebar-collapsed)" : "var(--hk-sidebar-width)";

  return (
    <aside
      className={cn(
        "hidden shrink-0 border-r border-hk-border bg-hk-surface md:flex md:flex-col",
        "transition-[width] duration-200 ease-out",
      )}
      style={{ width: mounted ? width : "var(--hk-sidebar-width)" }}
    >
      <div
        className={cn(
          "flex h-14 items-center border-b border-hk-border-subtle px-3",
          collapsed && "justify-center px-2",
        )}
      >
        <Logo collapsed={collapsed} />
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <NavLinks collapsed={collapsed} />
      </nav>

      <Separator />

      <div className={cn("p-2", collapsed && "flex justify-center")}>
        <Button
          type="button"
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          className={cn(
            "w-full text-hk-muted hover:text-hk-ink",
            !collapsed && "justify-start gap-2",
          )}
          onClick={toggle}
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
