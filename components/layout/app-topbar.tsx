"use client";

import { Logo } from "@/components/brand/logo";
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
import { useLogoutMutation } from "@/hooks/api/use-auth-queries";
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header
      className={cn(
        "hk-print-hide sticky top-0 z-30 flex h-[3.35rem] shrink-0 items-center gap-2 border-b border-hk-divider/85 bg-hk-surface/95 px-3 backdrop-blur sm:gap-3 sm:px-4 lg:h-14 lg:px-6",
        className,
      )}
      style={{
        boxShadow: "var(--hk-shadow-topbar)",
      }}
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
        <DialogContent className="hk-sidebar-surface left-0 top-0 flex h-full max-w-[min(100%,20rem)] translate-x-0 translate-y-0 flex-col rounded-none border-y-0 border-l-0 border-r-white/10 p-0 shadow-hk-lg sm:max-w-[min(100%,20rem)] [&>button]:text-white/70 [&>button:hover]:border-white/15 [&>button:hover]:bg-white/10 [&>button:hover]:text-white">
          <DialogHeader className="border-b border-white/10 px-4 py-3.5 text-left">
            <DialogTitle className="sr-only">Navegação principal</DialogTitle>
            <Logo inverted />
          </DialogHeader>
          <div className="flex flex-1 overflow-hidden">
            <div className="hk-sidebar-scroll -mr-5 flex-1 overflow-y-scroll px-2 py-4 pr-7">
              <NavLinks
                collapsed={false}
                onNavigate={() => setMobileNavOpen(false)}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Link
        href="/inicio"
        className="shrink-0 md:hidden"
        aria-label="Início"
      >
        <Logo collapsed />
      </Link>

      <div className="min-w-0 flex-1">
        <Breadcrumbs className="hidden md:block" />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-full border border-hk-border-subtle bg-hk-surface text-hk-action shadow-none hover:border-hk-border hover:bg-hk-surface-muted/80"
            aria-label="Menu da conta"
          >
            <User className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-hk-muted">
                Sessão
              </span>
              <span className="text-sm font-semibold text-hk-ink">
                Conta corporativa
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-hk-divider" />
          <DropdownMenuItem asChild>
            <Link href="/configuracoes/conta">Perfil e conta</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/configuracoes/assinatura">Assinatura</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-hk-divider" />
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
