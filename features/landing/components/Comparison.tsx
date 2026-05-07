'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const comparisonData = [
  {
    feature: 'Dashboard organizado por cliente e período',
    hoko: true,
    others: false,
  },
  {
    feature: 'Integrações em um só lugar (Meta, GA4, LinkedIn, YouTube)',
    hoko: true,
    others: false,
  },
  {
    feature: 'Métricas e gráficos prontos para apresentação',
    hoko: true,
    others: true,
  },
  {
    feature: 'Relatórios automatizados para entregas',
    hoko: true,
    others: true,
  },
  {
    feature: 'Análises com IA (resumo + recomendações)',
    hoko: true,
    others: false,
  },
  {
    feature: 'Histórico e contexto por cliente (documentos + informações)',
    hoko: true,
    others: false,
  },
  {
    feature: 'Exportação/compartilhamento de resultados',
    hoko: true,
    others: true,
  },
  {
    feature: 'Suporte brasileiro especializado',
    hoko: true,
    others: false,
  },
];

export default function Comparison() {
  return (
    <section id="comparison" className="py-24">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-headline mb-6">
            Por que escolher a{' '}
            <span className="bg-gradient-to-r from-hoko-primary to-hoko-secondary bg-clip-text text-transparent">
              ho.ko AI.nalytics?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Enquanto outras ferramentas ficam fragmentadas por canal, a ho.ko AI.nalytics centraliza dados por cliente e gera relatórios e análises com IA.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="dark-block overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[minmax(0,1fr)_72px_72px] sm:grid-cols-[minmax(0,1fr)_180px_180px] bg-muted/20">
              <div className="p-3 sm:p-6">
                <h3 className="text-sm sm:text-lg font-semibold text-foreground">Funcionalidade</h3>
              </div>
              <div className="p-3 sm:p-6 text-center border-x">
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded gradient-brand flex items-center justify-center shrink-0">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-semibold text-hoko-primary text-[11px] leading-tight sm:text-base">ho.ko AI.nalytics</span>
                </div>
              </div>
              <div className="p-3 sm:p-6 text-center">
                <h3 className="text-[11px] leading-tight sm:text-lg font-semibold text-muted-foreground">
                  Ferramentas tradicionais
                </h3>
              </div>
            </div>

            {/* Features */}
            <div className="divide-y">
              {comparisonData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="grid grid-cols-[minmax(0,1fr)_72px_72px] sm:grid-cols-[minmax(0,1fr)_180px_180px] hover:bg-muted/10 transition-colors duration-300"
                >
                  <div className="p-3 sm:p-6 min-w-0">
                    <span className="text-sm sm:text-base font-medium text-foreground break-words">{item.feature}</span>
                  </div>
                  <div className="p-3 sm:p-6 text-center border-x">
                    {item.hoko ? (
                      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                    ) : (
                      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100">
                        <X className="h-4 w-4 text-red-600" />
                      </div>
                    )}
                  </div>
                  <div className="p-3 sm:p-6 text-center flex items-center justify-center">
                    {item.others ? (
                      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                    ) : (
                      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100">
                        <X className="h-4 w-4 text-red-600" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <div className="dark-block p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4 text-foreground">
              A diferença está na abordagem completa
            </h3>
            <p className="text-muted-foreground">
              O diferencial está na organização e na execução: dashboards prontos, histórico por cliente e análises com IA
              para acelerar decisões e entregas.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}