import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { AlertCircle } from "lucide-react";

type ErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorState({
  title = "Não foi possível carregar",
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-hk-border bg-hk-surface px-6 py-10 text-center",
        className,
      )}
    >
      <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-red-50 text-red-600">
        <AlertCircle className="size-5" />
      </div>
      <h3 className="text-sm font-semibold text-hk-ink">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-hk-muted">{message}</p>
      {onRetry && (
        <Button type="button" variant="secondary" className="mt-4" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  );
}
