import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hk-action/26 focus-visible:ring-offset-2 focus-visible:ring-offset-hk-canvas disabled:pointer-events-none disabled:opacity-45 disabled:shadow-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-hk-action text-white shadow-hk-sm hover:bg-hk-strong hover:shadow-[0_10px_20px_rgb(25_43_194_/_0.19)] active:translate-y-px active:bg-hk-deep",
        secondary:
          "border border-hk-border-subtle bg-hk-surface text-hk-ink shadow-none hover:border-hk-border hover:bg-hk-surface-muted",
        ghost:
          "text-hk-ink shadow-none hover:bg-hk-deep/[0.05] hover:text-hk-deep",
        link: "text-hk-action underline-offset-4 shadow-none hover:underline",
        outline:
          "border border-hk-border-subtle bg-transparent text-hk-ink shadow-none hover:border-hk-border hover:bg-hk-surface-muted/70",
        destructive:
          "border border-transparent bg-hk-danger text-white shadow-hk-sm hover:bg-[#a72f3a] active:translate-y-px",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-6 text-sm",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
