"use client";

import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLogoutMutation } from "@/hooks/api/use-auth-queries";
import { useSelectedCustomer } from "@/components/providers/selected-customer-provider";
import { cn } from "@/lib/utils/cn";
import { Menu, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Breadcrumbs } from "./breadcrumbs";
import { NavLinks } from "./nav-links";

export function AppTopbar({ className }: { className?: string }) {
  const router = useRouter();
  const logout = useLogoutMutation();
  const { customers, selected, selectCustomer, isReady, isLoadingCustomers } =
    useSelectedCustomer();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b border-hk-border bg-hk-surface px-3 sm:gap-3 md:px-6",
        className,
      )}
    >
      <Dialog open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-hk-muted md:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="size-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="left-0 top-0 flex h-full max-w-[min(100%,20rem)] translate-x-0 translate-y-0 flex-col rounded-none border-y-0 border-l-0 p-0 sm:max-w-[min(100%,20rem)]">
          <DialogHeader className="border-b border-hk-border px-4 py-3 text-left">
            <DialogTitle className="sr-only">Navegação principal</DialogTitle>
            <Logo />
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-2 py-4">
            <NavLinks
              collapsed={false}
              onNavigate={() => setMobileNavOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Link
        href="/dashboard"
        className="shrink-0 md:hidden"
        aria-label="Início"
      >
        <Logo collapsed />
      </Link>

      <div className="hidden min-w-0 flex-1 flex-col gap-0.5 md:flex">
        <Breadcrumbs />
      </div>

      <div className="min-w-0 flex-1 md:max-w-xs md:flex-none lg:max-w-sm">
        {!isReady || isLoadingCustomers ? (
          <div className="h-9 w-full animate-pulse rounded-md bg-hk-border-subtle" />
        ) : customers.length === 0 ? (
          <div className="flex h-9 w-full items-center rounded-md border border-dashed border-hk-border px-3 text-xs text-hk-muted">
            Nenhum cliente cadastrado
          </div>
        ) : (
          <Select
            value={selected?.id_customer}
            onValueChange={(id) => selectCustomer(id)}
          >
            <SelectTrigger
              className="h-9 border-hk-border bg-hk-canvas/50 text-left text-sm"
              aria-label="Cliente selecionado"
            >
              <SelectValue placeholder="Selecionar cliente" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((c) => (
                <SelectItem key={c.id_customer} value={c.id_customer}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="hidden shrink-0 items-center lg:flex">
        <Badge variant="secondary" className="font-normal text-xs">
          Workspace
        </Badge>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-full border border-hk-border-subtle"
            aria-label="Menu da conta"
          >
            <User className="size-4 text-hk-action" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-hk-muted">Sessão</span>
              <span className="text-sm text-hk-ink">Conta corporativa</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/configuracoes/conta">Perfil e conta</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/configuracoes/assinatura">Assinatura</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-red-600 focus:text-red-600"
            onClick={() => {
              logout.mutate(undefined, {
                onSettled: () => router.replace("/login"),
              });
            }}
          >
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
