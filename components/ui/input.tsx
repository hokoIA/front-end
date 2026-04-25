import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-lg border border-hk-border-subtle bg-hk-surface px-3 py-1 text-sm font-medium text-hk-ink shadow-none transition-[border-color,box-shadow,background-color]",
          "placeholder:font-normal placeholder:text-hk-muted",
          "hover:border-hk-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hk-action/22 focus-visible:ring-offset-0 focus-visible:border-hk-action/35",
          "disabled:cursor-not-allowed disabled:opacity-45",
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
