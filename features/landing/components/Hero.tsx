'use client';

import { motion } from 'framer-motion';
import { Button } from '@/features/landing/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/features/landing/ui/dialog';
import { ArrowRight, Play } from 'lucide-react';
import DemoForm from './DemoForm';
import DashboardMockup from './DashboardMockup';
import { trackEvent } from "@/lib/analytics";

export default function Hero() {
  return (
    <section id="dashboard" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-hoko-primary/5 via-hoko-secondary/5 to-hoko-tertiary/5" />

        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Floating Elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-hoko-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-hoko-tertiary/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container-custom relative w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-4 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left w-full min-w-0"
          >
            <motion.h1
              className="text-[2.2rem] leading-[1.05] sm:text-5xl lg:text-6xl font-bold mb-5 sm:mb-6 bg-gradient-to-r from-hoko-primary via-hoko-secondary to-hoko-tertiary bg-clip-text text-transparent break-words mx-auto lg:mx-0 max-w-[14ch] sm:max-w-[13ch] lg:max-w-[12.5ch] xl:max-w-[13.5ch]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Decisões mais inteligentes, marcas mais fortes.
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg lg:text-xl leading-relaxed text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Plataforma de inteligência de marca e comunicação, que conecta performance, percepção e valor  para decisões mais rápidas, embasadas e estratégicas.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                size="lg"
                className="magnetic gradient-brand text-white border-0 group w-full sm:w-auto"
                onClick={() => {
                  trackEvent("signup_cta_click", {
                    location: "hero",
                    label: "Experimente agora",
                    destination: "/login",
                  });

                  window.location.href = "/login";
                }}
              >
                Experimente agora
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className="magnetic group w-full sm:w-auto"
                    onClick={() => {
                      trackEvent("demo_modal_open", {
                        location: "hero",
                        label: "Solicite uma demonstração",
                      });
                    }}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Solicite uma demonstração
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DemoForm />
                </DialogContent>
              </Dialog>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-10 sm:mt-12 pt-8 border-t"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="text-center lg:text-left w-full min-w-0">
                <div className="text-2xl font-bold text-hoko-primary">4+</div>
                <div className="text-sm text-muted-foreground">Integrações (Meta, GA4, LinkedIn, YouTube)</div>
              </div>
              <div className="text-center lg:text-left w-full min-w-0">
                <div className="text-2xl font-bold text-hoko-tertiary">IA</div>
                <div className="text-sm text-muted-foreground">Análises e recomendações</div>
              </div>
              <div className="text-center lg:text-left w-full min-w-0">
                <div className="text-2xl font-bold text-hoko-tertiary">Por cliente</div>
                <div className="text-sm text-muted-foreground">Dashboard com filtros de período</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative w-full min-w-0"
          >
            <DashboardMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}