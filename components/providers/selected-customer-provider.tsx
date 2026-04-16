"use client";

import { useAuthStatusQuery } from "@/hooks/api/use-auth-queries";
import { useCustomersQuery } from "@/hooks/api/use-customers-queries";
import type { Customer } from "@/lib/types/customer";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const LEGACY_COMPAT_STORAGE_KEYS = ["selectedCustomerId", "hk.selectedCustomerId"] as const;

function readStoredSelectedCustomerId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return (
      LEGACY_COMPAT_STORAGE_KEYS.map((key) => window.localStorage.getItem(key)).find(Boolean) ??
      null
    );
  } catch {
    return null;
  }
}

type SelectedCustomerContextValue = {
  customers: Customer[];
  selected: Customer | null;
  selectCustomer: (id: string | null) => void;
  /** Hidratação do storage + (quando autenticado) primeira resposta da lista */
  isReady: boolean;
  isLoadingCustomers: boolean;
  refetchCustomers: () => void;
};

const SelectedCustomerContext = createContext<
  SelectedCustomerContextValue | undefined
>(undefined);

function SelectedCustomerInner({ children }: { children: React.ReactNode }) {
  const { data: auth } = useAuthStatusQuery();
  const authed = auth?.authenticated === true;

  /* Clientes: lista deve trazer `integrations` por item quando o gateway expõe GET /customer/list. */
  const {
    data: customers = [],
    isSuccess,
    isPending,
    isFetching,
    refetch,
  } = useCustomersQuery(authed);

  const [selectedId, setSelectedId] = useState<string | null>(readStoredSelectedCustomerId);

  useEffect(() => {
    if (!authed || !isSuccess || !customers.length) return;
    if (!selectedId) return;
    const exists = customers.some((c) => c.id_customer === selectedId);
    if (!exists) {
      try {
        for (const key of LEGACY_COMPAT_STORAGE_KEYS) {
          localStorage.removeItem(key);
        }
      } catch {
        /* ignore */
      }
    }
  }, [authed, isSuccess, customers, selectedId]);

  const selectCustomer = useCallback((id: string | null) => {
    setSelectedId(id);
    try {
      if (id) {
        for (const key of LEGACY_COMPAT_STORAGE_KEYS) {
          localStorage.setItem(key, id);
        }
      } else {
        for (const key of LEGACY_COMPAT_STORAGE_KEYS) {
          localStorage.removeItem(key);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  const effectiveSelectedId = authed ? selectedId : null;

  const selected = useMemo(
    () => customers.find((c) => c.id_customer === effectiveSelectedId) ?? null,
    [customers, effectiveSelectedId],
  );

  const isReady = !authed || isSuccess || (!isPending && customers.length === 0);

  const value = useMemo(
    () => ({
      customers,
      selected,
      selectCustomer,
      isReady,
      isLoadingCustomers: authed && (isPending || isFetching),
      refetchCustomers: () => {
        void refetch();
      },
    }),
    [
      customers,
      selected,
      selectCustomer,
      isReady,
      authed,
      isPending,
      isFetching,
      refetch,
    ],
  );

  return (
    <SelectedCustomerContext.Provider value={value}>
      {children}
    </SelectedCustomerContext.Provider>
  );
}

export function SelectedCustomerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SelectedCustomerInner>{children}</SelectedCustomerInner>;
}

export function useSelectedCustomer() {
  const ctx = useContext(SelectedCustomerContext);
  if (!ctx) {
    throw new Error(
      "useSelectedCustomer must be used within SelectedCustomerProvider",
    );
  }
  return ctx;
}
