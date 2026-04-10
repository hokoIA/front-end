import type { SettingsNavItem } from "../types";

export const SETTINGS_NAV_ITEMS: SettingsNavItem[] = [
  {
    href: "/configuracoes",
    label: "Visão geral",
    description: "Resumo da conta e atalhos",
  },
  {
    href: "/configuracoes/conta",
    label: "Conta",
    description: "Perfil, avatar e dados cadastrais",
  },
  {
    href: "/configuracoes/assinatura",
    label: "Assinatura",
    description: "Plano, uso e portal de cobrança",
  },
  {
    href: "/configuracoes/seguranca",
    label: "Segurança",
    description: "Senha, sessão e exclusão",
  },
  {
    href: "/configuracoes/ajuda",
    label: "Ajuda & suporte",
    description: "Canais e perguntas frequentes",
  },
  {
    href: "/configuracoes/legal",
    label: "Legal",
    description: "Termos e privacidade",
  },
];
