import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[100px] w-full rounded-md border border-hk-border bg-hk-surface px-3 py-2 text-sm text-hk-ink shadow-hk-sm",
          "placeholder:text-hk-muted",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hk-action/25 focus-visible:border-hk-action/40",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
