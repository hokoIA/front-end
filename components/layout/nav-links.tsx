"use client";

import { cn } from "@/lib/utils/cn";
import { useAuthStatusQuery } from "@/hooks/api/use-auth-queries";
import { useRbacMeQuery } from "@/hooks/api/use-rbac-queries";
import { useSelectedCustomer } from "@/components/providers/selected-customer-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AGENCY_NAV_SECTIONS, CUSTOMER_NAV_SECTIONS, type NavSection } from "@/lib/navigation";
import { rbacAllows } from "@/lib/types/rbac";
import { Users } from "lucide-react";
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
  const { customers, selected, selectCustomer, isReady, isLoadingCustomers } = useSelectedCustomer();
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

  const renderSections = (sections: NavSection[], disabled = false) =>
    sections.map((section) => {
      const items = section.items.filter((item) => canSeeItem(item.permission, item.managePermission));
      if (items.length === 0) return null;
      return (
        <div key={section.title}>
          {!collapsed && (
            <p className="hk-overline mb-2.5 px-3">
              {section.title}
            </p>
          )}
          <ul className="flex flex-col gap-1">
            {items
              .map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-disabled={disabled}
                    tabIndex={disabled ? -1 : undefined}
                    title={collapsed ? item.label : undefined}
                    onClick={(event) => {
                      if (disabled) event.preventDefault();
                      else onNavigate?.();
                    }}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg py-2.5 text-sm font-medium transition-[background-color,color,border-color] duration-150",
                      disabled && "cursor-not-allowed opacity-45",
                      collapsed ? "justify-center px-0" : "border-l-[3px] pl-3 pr-2",
                      collapsed && active && "bg-hk-deep/[0.09] text-hk-deep",
                      collapsed &&
                        !active &&
                        "text-hk-muted hover:bg-hk-deep/[0.045] hover:text-hk-ink",
                      !collapsed && active &&
                        "border-hk-action bg-hk-deep/[0.08] text-hk-deep",
                      !collapsed &&
                        !active &&
                        "border-transparent text-hk-muted hover:border-hk-border-subtle hover:bg-hk-deep/[0.045] hover:text-hk-ink",
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
      );
    });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6" aria-label="Agência">
        {collapsed && <p className="sr-only">Agência</p>}
        {renderSections(AGENCY_NAV_SECTIONS)}
      </div>
      <div className="border-t border-hk-divider pt-5" aria-label="Área do cliente">
        <p className={cn("hk-overline mb-3 px-3", collapsed && "sr-only")}>Área do cliente</p>
        <div className={cn("mb-4 px-1", collapsed && "flex justify-center px-0")}>
          {!isReady || isLoadingCustomers ? (
            <div className={cn("hk-skeleton h-9 rounded-lg", collapsed ? "w-9" : "w-full")} />
          ) : customers.length === 0 ? (
            <p className={cn("text-xs text-hk-muted", collapsed ? "sr-only" : "px-2")}>Nenhum cliente cadastrado</p>
          ) : (
            <Select value={selected?.id_customer} onValueChange={selectCustomer}>
              <SelectTrigger
                aria-label={selected ? `Cliente selecionado: ${selected.name}` : "Selecionar cliente"}
                title={collapsed ? selected?.name ?? "Selecionar cliente" : undefined}
                className={collapsed ? "h-9 w-9 justify-center px-0 [&>svg]:hidden" : "w-full"}
              >
                {collapsed ? <Users className="size-4 text-hk-action" /> : <SelectValue placeholder="Selecionar cliente" />}
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id_customer} value={customer.id_customer}>{customer.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        {!selected && !collapsed && (
          <p className="mb-4 px-3 text-xs leading-5 text-hk-muted">Selecione um cliente para acessar esta área.</p>
        )}
        <div className="flex flex-col gap-6">{renderSections(CUSTOMER_NAV_SECTIONS, !selected)}</div>
      </div>
    </div>
  );
}
