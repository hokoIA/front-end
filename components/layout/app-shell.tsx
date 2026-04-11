import type { ReactNode } from "react";
import { AppChrome } from "./app-chrome";

export function AppShell({ children }: { children: ReactNode }) {
  return <AppChrome>{children}</AppChrome>;
}
