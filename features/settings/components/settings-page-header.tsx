"use client";

import { PageHeader } from "@/components/data-display/page-header";

type Props = {
  title: string;
  description: string;
  eyebrow?: string;
};

export function SettingsPageHeader({ title, description, eyebrow }: Props) {
  return (
    <PageHeader eyebrow={eyebrow} title={title} description={description} />
  );
}
