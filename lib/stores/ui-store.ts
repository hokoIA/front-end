import { create } from "zustand";

/**
 * Estado global de UI mínimo (side effects de produto, não dados de domínio).
 */
type UiStore = {
  /** Ex.: painel lateral de filtros, tour, etc. */
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;
  mobileNavConsumed: boolean;
  setMobileNavConsumed: (v: boolean) => void;
};

export const useUiStore = create<UiStore>((set) => ({
  commandOpen: false,
  setCommandOpen: (open) => set({ commandOpen: open }),
  mobileNavConsumed: false,
  setMobileNavConsumed: (v) => set({ mobileNavConsumed: v }),
}));
