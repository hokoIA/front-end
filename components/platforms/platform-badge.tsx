"use client";

import { PlatformIcon } from "@/components/platforms/platform-icon";
import {
  toPlatformVisualKey,
  type PlatformVisualKey,
} from "@/components/platforms/resolve-platform-surface";
import { cn } from "@/lib/utils/cn";
import type { IntegrationSurface } from "@/features/dashboard/types";

type PlatformBadgeProps = {
  platform: IntegrationSurface | PlatformVisualKey;
  label?: string;
  size?: "sm" | "md";
  className?: string;
};

/**
 * Chip opcional: ícone + texto. Prefira `PlatformIcon` sozinho quando não precisar do rótulo embutido.
 */
export function PlatformBadge({
  platform,
  label,
  size = "sm",
  className,
}: PlatformBadgeProps) {
  const visual = toPlatformVisualKey(platform);

  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-md border border-hk-border-subtle bg-hk-canvas/50 px-1.5 py-0.5 text-[10px] font-medium text-hk-deep",
        className,
      )}
    >
      <PlatformIcon platform={visual} size={size} plain />
      {label ? <span className="truncate">{label}</span> : null}
    </span>
  );
}

export function platformKeyToSurface(key: string): PlatformVisualKey {
  return toPlatformVisualKey(key);
}
