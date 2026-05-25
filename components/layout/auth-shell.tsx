import Image from "next/image";
import type { ReactNode } from "react";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh">
      <aside className="relative hidden w-[42%] flex-col justify-between bg-hk-deep p-10 text-white lg:flex">
        <Image
          src="/logotipo.png"
          alt="ho.ko AI.nalytics"
          width={2400}
          height={768}
          priority
          className="h-auto w-[10.5rem] object-contain"
          style={{ height: "auto" }}
        />
        <div className="max-w-sm space-y-4">
          <h1 className="text-2xl font-semibold leading-snug tracking-tight">
            Inteligência operacional para agências e marketing B2B.
          </h1>
          <p className="text-sm font-medium leading-relaxed text-white/72">
            Centralize clientes, integrações, métricas e decisões com governança
            e segurança corporativa.
          </p>
        </div>
        <p className="text-xs font-medium text-white/50">
          © {new Date().getFullYear()} ho.ko · Uso empresarial
        </p>
      </aside>

      <div className="hk-auth-art-surface flex flex-1 flex-col justify-center px-4 py-10 sm:px-8 md:px-12">
        <div className="relative z-10 mx-auto w-full max-w-[420px]">
          <div className="mb-8 flex justify-center lg:hidden">
            <div className="rounded-lg bg-hk-deep px-4 py-3 shadow-hk-md">
              <Image
                src="/logotipo.png"
                alt="ho.ko AI.nalytics"
                width={2400}
                height={768}
                priority
                className="h-auto w-40 object-contain"
                style={{ height: "auto" }}
              />
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
