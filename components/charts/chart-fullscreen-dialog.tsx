"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils/cn";
import { Maximize2 } from "lucide-react";
import type { ReactNode } from "react";

type ChartFullscreenDialogProps = {
  title: string;
  description?: string;
  children: ReactNode;
  /** Rótulo acessível do botão de ampliar */
  triggerLabel?: string;
  className?: string;
};

/**
 * Ação discreta para ampliar um gráfico; conteúdo reutiliza os mesmos componentes de série/donut.
 */
export function ChartFullscreenDialog({
  title,
  description,
  children,
  triggerLabel = "Ampliar gráfico",
  className,
}: ChartFullscreenDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 text-hk-muted opacity-80 hover:text-hk-deep hover:opacity-100 print:hidden"
          aria-label={triggerLabel}
        >
          <Maximize2 className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "max-h-[min(92vh,900px)] max-w-[min(96vw,56rem)] gap-4 overflow-y-auto print:hidden",
          className,
        )}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <div className="min-h-0 w-full min-w-0">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
