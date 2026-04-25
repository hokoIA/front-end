import { cn } from "@/lib/utils/cn";

type FiltersBarProps = React.HTMLAttributes<HTMLDivElement>;

export function FiltersBar({ className, ...props }: FiltersBarProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-hk-border-subtle bg-hk-surface p-3.5 shadow-hk-xs md:p-4",
        className,
      )}
      {...props}
    />
  );
}
