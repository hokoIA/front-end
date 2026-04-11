import { cn } from "@/lib/utils/cn";
import Image from "next/image";

type LogoProps = {
  className?: string;
  /** Tamanho compacto para sidebar colapsada ou mobile */
  collapsed?: boolean;
  /** Painel escuro (área de autenticação) */
  inverted?: boolean;
};

/** Ícone de marca: `app/favicon.ico` (servido em `/favicon.ico`). */
export function Logo({ className, collapsed, inverted }: LogoProps) {
  const markSize = collapsed ? 32 : 40;

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 font-semibold tracking-tight",
        inverted ? "text-white" : "text-hk-ink",
        className,
      )}
    >
      <span
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg",
          inverted && "brightness-0 invert",
        )}
        aria-hidden
      >
        <Image
          src="/favicon.ico"
          alt=""
          width={markSize}
          height={markSize}
          className="object-contain"
          priority
          unoptimized
        />
      </span>
      {!collapsed && (
        <span className="flex min-w-0 flex-col leading-tight">
          <span
            className={cn(
              "text-[0.9375rem] font-semibold tracking-tight",
              inverted ? "text-white" : "text-hk-deep",
            )}
          >
            ho.ko
          </span>
          <span
            className={cn(
              "text-[0.6875rem] font-medium uppercase tracking-[0.14em]",
              inverted ? "text-white/70" : "text-hk-muted",
            )}
          >
            AI.nalytics
          </span>
        </span>
      )}
    </div>
  );
}
