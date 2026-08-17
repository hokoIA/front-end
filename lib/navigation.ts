import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  BriefcaseBusiness,
  Columns3,
  Home,
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
  permission?: string;
  managePermission?: string;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export const MAIN_NAV_SECTIONS: NavSection[] = [
  {
    title: "Visão",
    items: [
      { href: "/inicio", label: "Início", icon: Home },
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
    title: "Produção",
    items: [
      { 
        href: "/kanban",
        label: "Kanban",
        icon: Columns3
      },
    ],
  },
  {
    title: "Operações",
    items: [
      {
        href: "/clientes",
        label: "Clientes & Integrações",
        icon: Users,
        permission: "platforms:connect",
      },
      {
        href: "/equipe",
        label: "Equipe",
        icon: BriefcaseBusiness,
        permission: "page:team:view",
        managePermission: "team:manage",
      },
    ],
  },
  {
    title: "Conta",
    items: [
      { href: "/configuracoes", label: "Configurações", icon: Settings },
    ],
  },
];
