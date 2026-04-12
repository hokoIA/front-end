"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export const CLIENT_PAGE_SIZE_DEFAULT = 10;

/**
 * Paginação apenas no cliente; `resetKey` deve mudar quando filtro/ordem alterar a lista base.
 */
export function useClientPagination<T>(
  items: readonly T[],
  pageSize: number,
  resetKey: string,
) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [resetKey]);

  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const safePage = Math.min(Math.max(1, page), pageCount);

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  const slice = useMemo(() => {
    const p = Math.min(Math.max(1, page), pageCount);
    const start = (p - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize, pageCount]);

  const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(total, safePage * pageSize);

  const goPrev = useCallback(() => {
    setPage((p) => Math.max(1, p - 1));
  }, []);

  const goNext = useCallback(() => {
    setPage((p) => Math.min(pageCount, p + 1));
  }, [pageCount]);

  return {
    page: safePage,
    pageCount,
    slice,
    total,
    from,
    to,
    setPage,
    goPrev,
    goNext,
  };
}
