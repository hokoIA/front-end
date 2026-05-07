'use client';

import { motion } from 'framer-motion';
import { Button } from '@/features/landing/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/features/landing/ui/sheet';
import { ArrowRight, Sparkles } from 'lucide-react';
import ContactForm from './ContactForm';

export default function FinalCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-brand-finalCTA opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.1)_100%)]" />
      
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-48 h-48 border border-white/10 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center text-white"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-8"
          >
            <Sparkles className="h-8 w-8" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-display font-bold mb-6 max-w-4xl mx-auto"
          >
            Sua marca merece decisões baseadas em{' '}
            <span className="text-white/90">inteligência</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-white/80 mb-12 max-w-2xl mx-auto"
          >
            Pare de apostar no escuro. Use dados e IA para construir decisões mais rápidas, embasadas e consistentes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  size="lg"
                  className="bg-white text-hoko-primary hover:bg-white/90 magnetic group px-8 py-4 text-lg font-semibold"
                >
                  Quero conhecer a plataforma
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md">
                <ContactForm />
              </SheetContent>
            </Sheet>

            <div className="text-center sm:text-left">
              <div className="text-white/90 text-sm font-medium">
                ✓ Sem compromisso inicial
              </div>
              <div className="text-white/90 text-sm font-medium">
                ✓ Demonstração personalizada
              </div>
            </div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 pt-12 border-t border-white/20"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-2">30 dias</div>
                <div className="text-white/80 text-sm">Para testar na prática</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">Onboarding</div>
                <div className="text-white/80 text-sm">Configuração guiada</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">Suporte</div>
                <div className="text-white/80 text-sm">Equipe no Brasil</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}