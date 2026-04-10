/** Conteúdo institucional de suporte (ajuste com dados reais da ho.ko). */
export const SUPPORT_CONTACT = {
  email: "suporte@hoko.com.br",
  commercialWhatsapp: "+55 (11) 0000-0000",
  phone: "+55 (11) 0000-0000",
  address: "São Paulo, SP — Brasil",
  hours: "Segunda a sexta, 9h às 18h (horário de Brasília)",
  preferredChannel:
    "Para incidentes e dúvidas técnicas, use o e-mail de suporte. Para propostas comerciais, WhatsApp comercial.",
} as const;

export type SupportFaqItem = { q: string; a: string };

export const SUPPORT_FAQ: SupportFaqItem[] = [
  {
    q: "Como funciona a cobrança por clientes adicionais?",
    a: "O plano base inclui até 3 clientes na plataforma. A partir do 4º cliente ativo, cada unidade adiciona valor fixo mensal à assinatura, conforme exibido em Configurações → Assinatura.",
  },
  {
    q: "Onde atualizo dados da minha conta e avatar?",
    a: "Em Configurações → Conta. Alterações de perfil refletem na equipe e nos relatórios internos.",
  },
  {
    q: "Como acesso notas fiscais e método de pagamento?",
    a: "Use “Gerenciar no portal de cobrança” na área Assinatura. O portal é o canal oficial para cartão, faturas e cancelamento programado.",
  },
  {
    q: "Perdi o acesso à conta. O que fazer?",
    a: "Utilize “Esqueci minha senha” na tela de login. Se o e-mail corporativo mudou, fale com o suporte com comprovação da organização.",
  },
];
