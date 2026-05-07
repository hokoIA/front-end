'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/features/landing/ui/button';
import { Badge } from '@/features/landing/ui/badge';
import { Slider } from '@/features/landing/ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/features/landing/ui/accordion';
import { Check, Calculator, Users } from 'lucide-react';

const BASE_PRICE = 299;
const INCLUDED_CLIENTS = 3;
const EXTRA_PER_CLIENT = 50;

function formatBRL(value: number) {
  // Evita depender de ICU/locale no build.
  const fixed = value.toFixed(2).replace('.', ',');
  const [intPart, decPart] = fixed.split(',');
  const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `R$ ${withThousands},${decPart}`;
}

const faqItems = [
  {
    question: 'Como funciona a cobrança por cliente?',
    answer:
      `Você paga um valor fixo de ${formatBRL(BASE_PRICE)}/mês que inclui até ${INCLUDED_CLIENTS} clientes. ` +
      `A partir do ${INCLUDED_CLIENTS + 1}º cliente, somamos ${formatBRL(EXTRA_PER_CLIENT)}/mês por cliente adicional.`,
  },
  {
    question: 'Posso adicionar ou remover clientes quando quiser?',
    answer:
      'Sim. Você pode ajustar a quantidade de clientes conforme sua operação (especialmente útil para agências). ' +
      'O valor mensal acompanha a quantidade de clientes ativos no plano.',
  },
  {
    question: 'O que está incluso no valor base?',
    answer:
      'Acesso aos recursos da plataforma: dashboards por cliente, integrações, relatórios e análises com IA. ' +
      'O que varia é apenas a quantidade de clientes incluídos.',
  },
];

export default function Pricing() {
  const [clients, setClients] = useState<number>(3);

  const pricing = useMemo(() => {
    const extraClients = Math.max(0, clients - INCLUDED_CLIENTS);
    const extras = extraClients * EXTRA_PER_CLIENT;
    const total = BASE_PRICE + extras;
    return { extraClients, extras, total };
  }, [clients]);

  return (
    <section id="pricing" className="py-24">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-headline mb-6">
            Preço simples,{' '}
            <span className="bg-gradient-to-r from-hoko-primary to-hoko-tertiary bg-clip-text text-transparent">
              escalável por cliente
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Um valor fixo para usar a plataforma inteira, com cobrança adicional apenas quando você ultrapassar o número
            de clientes incluídos.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-stretch">
          {/* Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative dark-block p-8 border gradient-border h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
                    <Calculator className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Calculadora de preço</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatBRL(BASE_PRICE)}/mês até {INCLUDED_CLIENTS} clientes • {formatBRL(EXTRA_PER_CLIENT)}/mês por
                      cliente extra
                    </p>
                  </div>
                </div>
                <Badge className="bg-hoko-tertiary/15 text-hoko-tertiary border-hoko-tertiary/30">
                  Tudo incluso
                </Badge>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Quantidade de clientes</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      <strong className="text-foreground">{clients}</strong> cliente{clients === 1 ? '' : 's'}
                    </span>
                  </div>
                  <Slider
                    value={[clients]}
                    min={1}
                    max={30}
                    step={1}
                    onValueChange={(v) => setClients(v[0] ?? 1)}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Dica: ajuste o número para simular sua operação atual (ou crescimento nos próximos meses).
                  </p>
                </div>

                <div className="rounded-2xl bg-muted/20 border border-border p-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-muted-foreground">Total mensal</span>
                    <span className="text-3xl font-bold text-foreground">{formatBRL(pricing.total)}</span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Base (até {INCLUDED_CLIENTS} clientes)</span>
                      <span className="text-foreground">{formatBRL(BASE_PRICE)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Adicionais ({pricing.extraClients} × {formatBRL(EXTRA_PER_CLIENT)})
                      </span>
                      <span className="text-foreground">{formatBRL(pricing.extras)}</span>
                    </div>
                    <div className="pt-3 mt-3 border-t border-border text-xs text-muted-foreground">
                      Valores sujeitos a ajustes. Cobrança mensal.
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full magnetic gradient-brand text-white border-0"
                  size="lg"
                  onClick={() => {
                    window.location.href = '/login';
                  }}
                >
                  Começar agora
                </Button>

                <div className="text-center">
                  <span className="text-xs text-muted-foreground">
                    Precisa de algo específico (white‑label, integrações extras, SLA)?{' '}
                    <a href="#contact" className="text-hoko-tertiary hover:underline">
                      Fale com a gente
                    </a>
                    .
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* What you get */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="dark-block p-8 h-full flex flex-col">
              <h3 className="text-xl font-semibold text-foreground mb-4">O que você recebe</h3>
              <ul className="space-y-3 mb-8">
                {[
                  'Dashboard de métricas por cliente e período',
                  'Integrações com plataformas (Meta, GA4, LinkedIn, YouTube)',
                  'Relatórios automatizados para agilizar entregas',
                  'Análises com IA (descritivas e recomendações práticas)',
                  'Gestão de clientes e organização do histórico',
                  'Suporte via email',
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center bg-hoko-primary/10">
                      <Check className="h-3 w-3 text-hoko-primary" />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="rounded-2xl border border-hoko-primary/20 bg-hoko-primary/5 p-5">
                <div className="text-sm font-semibold text-foreground">Para agências</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Cobrança por cliente facilita escalar sem trocar de “plano”. Você paga conforme cresce.
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto mt-16"
        >
          <h3 className="text-2xl font-semibold text-center mb-8">Perguntas Frequentes</h3>
          <Accordion type="single" collapsible className="dark-block">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b last:border-b-0 px-6">
                <AccordionTrigger className="py-4 text-left hover:text-hoko-primary">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-muted-foreground">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center dark-block-subtle rounded-full px-6 py-3">
            <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center mr-3">
              <Check className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium text-foreground">30 dias para testar na prática</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
