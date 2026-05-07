'use client';

import { motion } from 'framer-motion';
import {
  ChartBar as BarChart3,
  TrendingUp,
  Users,
  Eye,
  Sparkles,
  MousePointerClick,
} from 'lucide-react';

export default function DashboardMockup() {
  return (
    <div className="relative w-full max-w-full">
      {/* Main Dashboard Container */}
      <motion.div
        className="relative dark-block p-4 sm:p-6 shadow-2xl gradient-border w-full max-w-full overflow-hidden"
        whileHover={{ y: -5 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Dashboard Multi‑Plataforma</h3>
            <p className="text-sm text-muted-foreground">Métricas por cliente e período</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="w-2 h-2 bg-hoko-tertiary rounded-full animate-pulse-subtle" />
            <span className="text-xs text-muted-foreground">Atualizado diariamente</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <motion.div
            className="bg-hoko-primary/10 rounded-xl p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="h-4 w-4 text-hoko-primary" />
              <span className="text-xs font-medium">Alcance (Meta)</span>
            </div>
            <div className="text-2xl font-bold text-hoko-primary">128,4k</div>
            {/*<div className="text-xs text-hoko-quaternary flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% vs período anterior
            </div>8*/}
          </motion.div>

          <motion.div
            className="bg-hoko-tertiary/10 rounded-xl p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <MousePointerClick className="h-4 w-4 text-hoko-tertiary" />
              <span className="text-xs font-medium">Sessões (GA4)</span>
            </div>
            <div className="text-2xl font-bold text-hoko-tertiary">42,1k</div>
            {/*<div className="text-xs text-hoko-quaternary flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5% vs período anterior
            </div>*/}
          </motion.div>
        </div>

        {/* Chart Area */}
        <motion.div
          className="bg-muted/20 rounded-xl p-4 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">Impressões por mês</span>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Simulated Chart */}
          <div className="flex items-end gap-1 h-20 overflow-hidden">
            {[52, 60, 58, 70, 66, 78, 72, 85, 68, 72, 70, 88, 80, 83, 78, 85, 89, 86, 80, 75, 76, 85, 90, 66, 88, 65, 97, 99].map((height, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-t from-hoko-secondary to-hoko-primary rounded-t flex-1 min-w-0"
                style={{ height: `${height}%` }}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: 2 + index * 0.08 }}
              />
            ))}
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-12 gap-y-1 text-[10px] sm:text-xs text-muted-foreground mt-2">
            <span>Jan</span>
            <span>Fev</span>
            <span>Mar</span>
            <span>Abr</span>
            <span>Mai</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Ago</span>
            <span>Set</span>
            <span>Out</span>
            <span>Nov</span>
            <span>Dez</span>
          </div>
        </motion.div>

        {/* Insights */}
        <motion.div
          className="bg-hoko-secondary/15 border border-hoko-secondary/30 rounded-xl p-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Sparkles className="h-4 w-4 text-hoko-tertiary" />
            <span className="text-xs font-medium text-foreground">Resumo da IA</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            No período selecionado, o Instagram concentrou a maior parte do alcance. Sugestão: priorize Reels e
            replique os formatos que geraram mais engajamento.
          </p>
        </motion.div>
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-2 right-2 sm:-top-4 sm:-right-4 dark-block-subtle rounded-full p-2 sm:p-3 shadow-lg"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <Users className="h-5 w-5 text-hoko-primary" />
      </motion.div>

      <motion.div
        className="absolute bottom-2 left-2 sm:-bottom-4 sm:-left-4 dark-block-subtle rounded-full p-2 sm:p-3 shadow-lg"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <TrendingUp className="h-5 w-5 text-hoko-tertiary" />
      </motion.div>
    </div>
  );
}
