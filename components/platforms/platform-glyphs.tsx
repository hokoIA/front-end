"use client";

/**
 * Única fonte de SVGs de marcas no app — consumir via `PlatformIcon`, não importar este arquivo diretamente nas features.
 */

export function GlyphFacebook({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M13.5 22v-9h3.2l.5-3.7h-3.7V7.2c0-1 .3-1.7 1.8-1.7H17V2.1c-.3 0-1.5-.1-2.9-.1-2.9 0-4.9 1.8-4.9 5v2.6H6v3.7h3.2V22h4.3z" />
    </svg>
  );
}

export function GlyphInstagram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function GlyphGoogleAnalytics({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <path
        d="M12 3v18M17 8l-5 5-3-3-4 4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GlyphYoutube({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M21.6 7.2s-.2-1.5-.8-2.2c-.8-.8-1.7-.8-2.1-.9C15.7 4 12 4 12 4s-3.7 0-6.7.1c-.4 0-1.3.1-2.1.9-.6.7-.8 2.2-.8 2.2S2 8.9 2 10.6v1.7c0 1.7.2 3.4.2 3.4s.2 1.5.8 2.2c.8.8 1.9.8 2.4.9 1.7.2 6.6.2 6.6.2s3.7 0 6.7-.1c.4 0 1.3-.1 2.1-.9.6-.7.8-2.2.8-2.2s.2-1.7.2-3.4v-1.7c0-1.7-.2-3.4-.2-3.4zM10 14.5V8.8l5.2 2.9-5.2 2.8z" />
    </svg>
  );
}

export function GlyphLinkedin({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M6.5 8.7h-4V22h4V8.7zm-2-6.2c-1.3 0-2.3 1-2.3 2.3 0 1.2 1 2.2 2.3 2.2s2.2-1 2.2-2.2C6.7 3.5 5.8 2.5 4.5 2.5zm15.2 6.4c-2.2 0-3.7 1-4.4 2.1h-.1V8.7H9.3V22h4v-7.2c0-1.7.3-3.4 2.5-3.4 2.1 0 2.5 1.7 2.5 3.4V22h4v-8.2c0-3.5-.8-6.2-4.8-6.2z" />
    </svg>
  );
}

export function GlyphMeta({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <path d="M12 3c-4 4-7 7.5-7 11a5 5 0 009.2 2.7A5 5 0 0019 14c0-3.5-3-7-7-11z" />
    </svg>
  );
}
