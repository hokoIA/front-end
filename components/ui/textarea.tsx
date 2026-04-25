import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[100px] w-full rounded-lg border border-hk-border-subtle bg-hk-surface px-3 py-2.5 text-sm font-medium text-hk-ink shadow-none transition-[border-color,box-shadow,background-color]",
          "placeholder:font-normal placeholder:text-hk-muted",
          "hover:border-hk-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hk-action/22 focus-visible:border-hk-action/35",
          "disabled:cursor-not-allowed disabled:opacity-45",
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
