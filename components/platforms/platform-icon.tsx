"use client";

import {
  GlyphFacebook,
  GlyphGoogleAnalytics,
  GlyphInstagram,
  GlyphLinkedin,
  GlyphMeta,
  GlyphYoutube,
} from "@/components/platforms/platform-glyphs";
import {
  toPlatformVisualKey,
  type PlatformVisualKey,
} from "@/components/platforms/resolve-platform-surface";
import { cn } from "@/lib/utils/cn";
import type { IntegrationSurface } from "@/features/dashboard/types";

const sizeMap = {
  sm: "size-6 [&_svg]:size-[14px]",
  md: "size-8 [&_svg]:size-[15px]",
} as const;

const plainGlyphClass = {
  sm: "size-4 shrink-0",
  md: "size-[15px] shrink-0",
} as const;

export type PlatformIconProps = {
  platform: IntegrationSurface | PlatformVisualKey;
  size?: keyof typeof sizeMap;
  className?: string;
  /** Sem borda/fundo — só o glifo (útil em listas densas). */
  plain?: boolean;
};

function renderGlyph(
  platform: PlatformVisualKey,
  plain: boolean,
  size: keyof typeof sizeMap,
) {
  const c = plain ? plainGlyphClass[size] : undefined;
  switch (platform) {
    case "facebook":
      return <GlyphFacebook className={c} />;
    case "instagram":
      return <GlyphInstagram className={c} />;
    case "google_analytics":
    case "google":
      return <GlyphGoogleAnalytics className={c} />;
    case "youtube":
      return <GlyphYoutube className={c} />;
    case "linkedin":
      return (
        <GlyphLinkedin
          className={plain ? cn(plainGlyphClass[size], "scale-95") : c}
        />
      );
    case "meta":
    default:
      return <GlyphMeta className={c} />;
  }
}

/**
 * Ícone de plataforma — use `plain` quando só o glifo bastar; caso contrário, fundo discreto ho.ko.
 */
export function PlatformIcon({
  platform,
  size = "sm",
  className,
  plain = false,
}: PlatformIconProps) {
  const visual = toPlatformVisualKey(platform);

  if (plain) {
    return (
      <span
        className={cn("inline-flex text-hk-deep/90", className)}
        aria-hidden
      >
        {renderGlyph(visual, true, size)}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md border border-hk-border-subtle bg-hk-canvas/90 text-hk-deep",
        sizeMap[size],
        className,
      )}
      aria-hidden
    >
      {renderGlyph(visual, false, size)}
    </span>
  );
}

/** Alias para strings vindas de tabelas / byPlatform. */
export function PlatformIconFromLabel({
  label,
  ...rest
}: { label: string } & Omit<PlatformIconProps, "platform">) {
  return <PlatformIcon platform={toPlatformVisualKey(label)} {...rest} />;
}
