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
            <p className="hk-overline mb-2 px-3">
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
                      "group relative flex items-center gap-2.5 rounded-lg py-[0.5625rem] text-[0.8125rem] font-medium transition-[background-color,color,border-color] duration-150",
                      disabled && "cursor-not-allowed opacity-45",
                      collapsed ? "justify-center px-0" : "border-l-[3px] pl-3 pr-2",
                      collapsed && active && "bg-[var(--hk-sidebar-active)] text-white",
                      collapsed &&
                        !active &&
                        "text-white/65 hover:bg-white/[0.07] hover:text-white",
                      !collapsed && active &&
                        "border-hk-cyan bg-[var(--hk-sidebar-active)] text-white",
                      !collapsed &&
                        !active &&
                        "border-transparent text-white/65 hover:border-white/15 hover:bg-white/[0.07] hover:text-white",
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-[17px] shrink-0 transition-colors duration-150",
                        active
                          ? "text-hk-cyan"
                          : "text-white/55 group-hover:text-hk-cyan",
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
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-5" aria-label="Agência">
        {collapsed && <p className="sr-only">Agência</p>}
        {renderSections(AGENCY_NAV_SECTIONS)}
      </div>
      <div className="border-t border-white/10 pt-4" aria-label="Área do cliente">
        <p className={cn("hk-overline mb-2.5 px-3", collapsed && "sr-only")}>Área do cliente</p>
        <div className={cn("mb-3.5 px-1", collapsed && "flex justify-center px-0")}>
          {!isReady || isLoadingCustomers ? (
            <div className={cn("hk-skeleton h-9 rounded-lg", collapsed ? "w-9" : "w-full")} />
          ) : customers.length === 0 ? (
            <p className={cn("text-xs text-white/60", collapsed ? "sr-only" : "px-2")}>Nenhum cliente cadastrado</p>
          ) : (
            <Select value={selected?.id_customer} onValueChange={selectCustomer}>
              <SelectTrigger
                aria-label={selected ? `Cliente selecionado: ${selected.name}` : "Selecionar cliente"}
                title={collapsed ? selected?.name ?? "Selecionar cliente" : undefined}
                className={cn(
                  "border-white/15 bg-white/[0.07] text-white hover:border-white/30 focus:border-hk-cyan/60 focus:ring-hk-cyan/25 [&>svg]:text-white/60",
                  collapsed ? "h-9 w-9 justify-center px-0 [&>svg]:hidden" : "w-full",
                )}
              >
                {collapsed ? <Users className="size-4 text-hk-cyan" /> : <SelectValue placeholder="Selecionar cliente" />}
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
          <p className="mb-3.5 px-3 text-xs leading-5 text-white/55">Selecione um cliente para acessar esta área.</p>
        )}
        <div className="flex flex-col gap-5">{renderSections(CUSTOMER_NAV_SECTIONS, !selected)}</div>
      </div>
    </div>
  );
}
