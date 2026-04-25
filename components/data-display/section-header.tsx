import { cn } from "@/lib/utils/cn";

type SectionHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  compact?: boolean;
};

export function SectionHeader({
  title,
  description,
  actions,
  className,
  compact = false,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between",
        compact && "gap-2",
        className,
      )}
    >
      <div className="min-w-0 space-y-1">
        <h2 className="text-base font-semibold tracking-[-0.015em] text-hk-deep md:text-[1.05rem]">
          {title}
        </h2>
        {description ? (
          <p className="text-sm font-medium leading-relaxed text-hk-muted">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
