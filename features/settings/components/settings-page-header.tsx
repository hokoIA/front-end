"use client";

type Props = {
  title: string;
  description: string;
  eyebrow?: string;
};

export function SettingsPageHeader({ title, description, eyebrow }: Props) {
  return (
    <header className="border-b border-hk-border-subtle pb-6">
      {eyebrow ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-hk-action">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-2xl font-semibold tracking-tight text-hk-deep">
        {title}
      </h1>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-hk-muted">
        {description}
      </p>
    </header>
  );
}
