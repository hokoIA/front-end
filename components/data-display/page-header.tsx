import { cn } from "@/lib/utils/cn";

type PageHeaderProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  withDivider?: boolean;
};

export function PageHeader({
  title,
  description,
  eyebrow,
  meta,
  actions,
  className,
  withDivider = true,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-start md:justify-between",
        withDivider && "border-b border-hk-divider pb-5",
        className,
      )}
    >
      <div className="min-w-0 space-y-2.5">
        {eyebrow ? <p className="hk-overline">{eyebrow}</p> : null}
        <h1 className="hk-page-title">{title}</h1>
        {description && (
          <p className="hk-page-subtitle max-w-2xl">{description}</p>
        )}
        {meta ? <div className="flex flex-wrap gap-2 text-xs text-hk-muted">{meta}</div> : null}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2.5">{actions}</div>
      )}
    </div>
  );
}
