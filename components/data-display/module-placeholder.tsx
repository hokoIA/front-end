import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/data-display/page-header";
import type { LucideIcon } from "lucide-react";

type ModulePlaceholderProps = {
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  icon?: LucideIcon;
};

export function ModulePlaceholder({
  title,
  description,
  emptyTitle,
  emptyDescription,
  icon,
}: ModulePlaceholderProps) {
  return (
    <div className="space-y-8">
      <PageHeader title={title} description={description} />
      <EmptyState
        icon={icon}
        title={emptyTitle}
        description={emptyDescription}
      />
    </div>
  );
}
