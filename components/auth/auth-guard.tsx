"use client";

import { useAuthStatusQuery } from "@/hooks/api/use-auth-queries";
import { Skeleton } from "@/components/ui/skeleton";
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
      <div className="flex min-h-screen flex-col gap-4 bg-hk-canvas p-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full max-w-3xl" />
      </div>
    );
  }

  if (!data?.authenticated) {
    return null;
  }

  return <>{children}</>;
}
