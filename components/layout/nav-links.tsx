"use client";

import { cn } from "@/lib/utils/cn";
import { useAuthStatusQuery } from "@/hooks/api/use-auth-queries";
import { useRbacMeQuery } from "@/hooks/api/use-rbac-queries";
import { MAIN_NAV_SECTIONS } from "@/lib/navigation";
import { rbacAllows } from "@/lib/types/rbac";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinksProps = {
  collapsed: boolean;
  onNavigate?: () => void;
};

export function NavLinks({ collapsed, onNavigate }: NavLinksProps) {
  const pathname = usePathname();
  const { data: auth } = useAuthStatusQuery();
  const { data: rbac, isPending: rbacLoading } = useRbacMeQuery();
  const authRole = String(auth?.user?.role ?? "").toLowerCase();
  const isAuthAdmin = authRole === "admin";

  const canSeeItem = (permission?: string, managePermission?: string) => {
    if (!permission && !managePermission) return true;
    if (rbacLoading) return isAuthAdmin;
    if (permission && rbacAllows(rbac, permission)) return true;
    if (managePermission && rbacAllows(rbac, managePermission)) return true;
    if (isAuthAdmin) return true;
    return false;
  };

  return (
    <div className="flex flex-col gap-7">
      {MAIN_NAV_SECTIONS.map((section) => (
        <div key={section.title}>
          {!collapsed && (
            <p className="mb-2.5 px-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-hk-muted">
              {section.title}
            </p>
          )}
          <ul className="flex flex-col gap-1">
            {section.items
              .filter((item) =>
                canSeeItem(item.permission, item.managePermission),
              )
              .map((item) => {
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
                      "group relative flex items-center gap-3 rounded-lg py-2.5 text-sm font-medium transition-colors duration-150",
                      collapsed ? "justify-center px-0" : "border-l-[3px] pl-2.5",
                      collapsed && active && "bg-hk-deep/[0.07] text-hk-deep",
                      collapsed && !active && "text-hk-muted hover:bg-hk-deep/[0.04] hover:text-hk-ink",
                      !collapsed && active &&
                        "border-hk-action bg-hk-deep/[0.06] text-hk-deep",
                      !collapsed &&
                        !active &&
                        "border-transparent text-hk-muted hover:border-hk-border-subtle hover:bg-hk-deep/[0.035] hover:text-hk-ink",
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-[18px] shrink-0 transition-colors duration-150",
                        active
                          ? "text-hk-action"
                          : "text-hk-muted group-hover:text-hk-action",
                      )}
                      strokeWidth={1.65}
                      aria-hidden
                    />
                    {!collapsed && (
                      <span className="truncate pr-1">{item.label}</span>
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
