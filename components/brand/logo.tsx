import { cn } from "@/lib/utils/cn";

type LogoProps = {
  className?: string;
  /** Tamanho compacto para sidebar colapsada */
  collapsed?: boolean;
  /** Painel escuro (área de autenticação) */
  inverted?: boolean;
};

export function Logo({ className, collapsed, inverted }: LogoProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 font-semibold tracking-tight",
        inverted ? "text-white" : "text-hk-deep",
        className,
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-md shadow-hk-sm",
          inverted
            ? "border border-white/25 bg-white/10 text-white"
            : "bg-hk-action text-white",
          collapsed ? "size-8 text-xs" : "size-9 text-sm",
        )}
        aria-hidden
      >
        hk
      </span>
      {!collapsed && (
        <span className="flex flex-col leading-tight">
          <span className={cn("text-sm", inverted ? "text-white" : "text-hk-deep")}>
            ho.ko
          </span>
          <span
            className={cn(
              "text-[11px] font-normal",
              inverted ? "text-white/65" : "text-hk-muted",
            )}
          >
            AI.nalytics
          </span>
        </span>
      )}
    </div>
  );
}
