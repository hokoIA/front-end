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

const STORAGE_KEY = "hk.selectedCustomerId";

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

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSelectedId(raw);
    } catch {
      /* ignore */
    }
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!authed) {
      setSelectedId(null);
    }
  }, [authed]);

  useEffect(() => {
    if (!authed || !isSuccess || !customers.length) return;
    if (!selectedId) return;
    const exists = customers.some((c) => c.id_customer === selectedId);
    if (!exists) {
      setSelectedId(null);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
    }
  }, [authed, isSuccess, customers, selectedId]);

  const selectCustomer = useCallback((id: string | null) => {
    setSelectedId(id);
    try {
      if (id) localStorage.setItem(STORAGE_KEY, id);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const selected = useMemo(
    () => customers.find((c) => c.id_customer === selectedId) ?? null,
    [customers, selectedId],
  );

  const isReady =
    storageReady && (!authed || isSuccess || (!isPending && customers.length === 0));

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
