import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  BriefcaseBusiness,
  Columns3,
  LayoutDashboard,
  LineChart,
  Settings,
  Target,
  Users,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export const MAIN_NAV_SECTIONS: NavSection[] = [
  {
    title: "Visão",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Análise & contexto",
    items: [
      { href: "/analises", label: "Análises", icon: LineChart },
      { href: "/alimentar-modelo", label: "Base de Contexto", icon: BookOpen },
    ],
  },
  {
    title: "Estratégia",
    items: [
      {
        href: "/metas",
        label: "Planejamento Estratégico",
        icon: Target,
      },
    ],
  },
  {
    title: "Operações",
    items: [
      {
        href: "/clientes",
        label: "Clientes & Integrações",
        icon: BriefcaseBusiness,
      },
      { href: "/equipe", label: "Equipe", icon: Users },
      { href: "/kanban", label: "Kanban", icon: Columns3 },
    ],
  },
  {
    title: "Conta",
    items: [
      { href: "/configuracoes", label: "Configurações", icon: Settings },
    ],
  },
];
