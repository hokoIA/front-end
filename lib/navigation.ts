import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  BriefcaseBusiness,
  CalendarRange,
  Columns3,
  History,
  Home,
  LayoutDashboard,
  LineChart,
  ListChecks,
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

export const AGENCY_NAV_SECTIONS: NavSection[] = [
  {
    title: "Visão da agência",
    items: [
      { href: "/inicio", label: "Início", icon: Home },
    ],
  },
  {
    title: "Administração",
    items: [
      { href: "/clientes", label: "Clientes & Integrações", icon: Users },
      {
        href: "/equipe",
        label: "Equipe",
        icon: BriefcaseBusiness,
        permission: "page:team:view",
        managePermission: "team:manage",
      },
      { href: "/configuracoes", label: "Configurações", icon: Settings },
    ],
  },
];

export const CUSTOMER_NAV_SECTIONS: NavSection[] = [
  {
    title: "Visão do cliente",
    items: [
      { href: "/dashboard", label: "Visão Geral", icon: LayoutDashboard },
    ],
  },
  {
    title: "Inteligência & Estratégia",
    items: [
      { href: "/alimentar-modelo", label: "Base de Contexto", icon: BookOpen },
      { href: "/analises", label: "Análises Estratégicas", icon: LineChart },
      { href: "/metas", label: "Planejamento Estratégico", icon: Target },
    ],
  },
  {
    title: "Operação",
    items: [
      { href: "/ciclos", label: "Ciclos Operacionais", icon: CalendarRange },
      { href: "/decisoes", label: "Central de Decisões", icon: ListChecks },
      { href: "/kanban", label: "Kanban", icon: Columns3 },
    ],
  },
  {
    title: "Resultados",
    items: [
      { href: "/aprendizagem", label: "Aprendizagem & Histórico", icon: History },
    ],
  },
];
