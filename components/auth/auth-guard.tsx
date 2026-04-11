"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStatusQuery } from "@/hooks/api/use-auth-queries";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isPending } = useAuthStatusQuery();

  useEffect(() => {
    if (isPending) return;
    if (data?.authenticated) return;
    const path =
      typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : pathname;
    router.replace(`/login?next=${encodeURIComponent(path)}`);
  }, [data?.authenticated, isPending, pathname, router]);

  if (isPending) {
    return (
      <div className="hk-app-root flex min-h-svh">
        <div className="hidden w-[var(--hk-sidebar-width)] shrink-0 flex-col border-r border-hk-divider bg-hk-surface/80 p-4 md:flex">
          <Skeleton className="mb-8 h-10 w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-9 w-full rounded-lg" />
            <Skeleton className="h-9 w-full rounded-lg" />
            <Skeleton className="h-9 w-full rounded-lg" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <Skeleton className="h-[3.25rem] w-full shrink-0 lg:h-14" />
          <div className="hk-main flex flex-1 flex-col gap-5 p-5 lg:p-8">
            <div className="space-y-2">
              <Skeleton className="h-4 w-48 rounded-md" />
              <Skeleton className="h-8 w-72 max-w-full rounded-lg" />
            </div>
            <Skeleton className="h-36 w-full max-w-2xl rounded-xl" />
            <Skeleton className="min-h-[14rem] w-full flex-1 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!data?.authenticated) {
    return null;
  }

  return <>{children}</>;
}
