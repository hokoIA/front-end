"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:rounded-xl group-[.toaster]:bg-hk-surface group-[.toaster]:text-hk-ink group-[.toaster]:border-hk-border group-[.toaster]:shadow-hk-md",
          description: "group-[.toast]:text-hk-muted",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
