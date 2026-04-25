import { cn } from "@/lib/utils/cn";

type DataPanelProps = React.HTMLAttributes<HTMLDivElement>;

export function DataPanel({ className, ...props }: DataPanelProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-hk-border bg-hk-surface p-4 shadow-hk-sm md:p-5",
        className,
      )}
      {...props}
    />
  );
}
