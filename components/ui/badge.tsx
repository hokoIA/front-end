import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.09em] transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-hk-deep/[0.09] text-hk-deep",
        secondary:
          "border-hk-border-subtle bg-hk-surface-muted/90 text-hk-muted",
        outline:
          "border-hk-border-subtle bg-transparent text-hk-ink font-semibold normal-case tracking-normal text-[11px]",
        info: "border-transparent bg-hk-cyan/20 text-hk-deep",
        success:
          "border-transparent bg-hk-success-soft text-hk-success",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
