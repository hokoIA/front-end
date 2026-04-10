import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-hk-border bg-hk-surface px-3 py-1 text-sm text-hk-ink shadow-hk-sm transition-colors",
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
Input.displayName = "Input";

export { Input };
