import { Logo } from "@/components/brand/logo";
import type { ReactNode } from "react";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="relative hidden w-[42%] flex-col justify-between bg-hk-deep p-10 text-white lg:flex">
        <Logo inverted />
        <div className="max-w-sm space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-hk-cyan/90">
            ho.ko AI.nalytics
          </p>
          <h1 className="text-2xl font-semibold leading-snug tracking-tight">
            Inteligência operacional para agências e marketing B2B.
          </h1>
          <p className="text-sm leading-relaxed text-white/70">
            Centralize clientes, integrações, métricas e decisões com governança
            e segurança corporativa.
          </p>
        </div>
        <p className="text-xs text-white/45">
          © {new Date().getFullYear()} ho.ko · Uso empresarial
        </p>
      </aside>

      <div className="flex flex-1 flex-col justify-center bg-hk-canvas px-4 py-10 sm:px-8 md:px-12">
        <div className="mx-auto w-full max-w-[420px]">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
