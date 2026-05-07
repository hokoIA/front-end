'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/features/landing/ui/button';

const logos = [
  { name: 'CPN Engenharia', src: 'https://images.pexels.com/photos/6963758/pexels-photo-6963758.jpeg?auto=compress&cs=tinysrgb&w=200&h=80&fit=crop' },
  { name: 'Jacarandá Investimentos', src: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=200&h=80&fit=crop' },
  { name: 'Café Carneiro', src: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=200&h=80&fit=crop' },
  { name: 'TechFlow Solutions', src: 'https://images.pexels.com/photos/3861943/pexels-photo-3861943.jpeg?auto=compress&cs=tinysrgb&w=200&h=80&fit=crop' },
  { name: 'Verde Capital', src: 'https://images.pexels.com/photos/7688394/pexels-photo-7688394.jpeg?auto=compress&cs=tinysrgb&w=200&h=80&fit=crop' },
];

const testimonials = [
  {
    quote: "A ho.ko transformou nossa tomada de decisão. Agora temos previsibilidade real do impacto das nossas ações de marca.",
    author: "Marina Silva",
    position: "CMO, CPN Engenharia",
    rating: 5,
  },
  {
    quote: "Em 6 meses, conseguimos aumentar nosso brand awareness em 40% usando as predições da plataforma.",
    author: "Carlos Mendes",
    position: "Diretor de Marketing, Jacarandá Investimentos",
    rating: 5,
  },
  {
    quote: "Os relatórios automatizados economizam 15 horas semanais da nossa equipe. ROI impressionante!",
    author: "Ana Costa",
    position: "Head de Comunicação, Café Carneiro",
    rating: 5,
  },
];

export default function SocialProof() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="social-proof" className="py-24">
      <div className="container-custom">
        {/* Client Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm text-muted-foreground mb-8">
            Empresas que confiam na ho.ko AI.nalytics
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-60 hover:opacity-100 transition-opacity duration-300">
            {logos.map((logo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="flex items-center justify-center"
              >
                <div className="bg-muted/30 rounded-lg px-4 py-2 text-sm font-medium text-foreground">
                  {logo.name}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials Slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div
            className="relative"
            onMouseEnter={() => setIsPlaying(false)}
            onMouseLeave={() => setIsPlaying(true)}
          >
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="dark-block p-12 text-center relative"
            >
              <Quote className="h-12 w-12 text-hoko-primary/30 mx-auto mb-6" />
              
              <blockquote className="text-2xl font-medium mb-8 leading-relaxed text-foreground">
                "{testimonials[currentTestimonial].quote}"
              </blockquote>
              
              <div className="flex items-center justify-center space-x-1 mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="w-5 h-5 bg-amber-400 rounded-full"
                  />
                ))}
              </div>
              
              <cite className="not-italic">
                <div className="font-semibold text-lg text-foreground">
                  {testimonials[currentTestimonial].author}
                </div>
                <div className="text-muted-foreground">
                  {testimonials[currentTestimonial].position}
                </div>
              </cite>
            </motion.div>

            {/* Navigation */}
            <div className="flex items-center justify-center space-x-4 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={prevTestimonial}
                className="magnetic"
                aria-label="Depoimento anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? 'bg-hoko-primary w-8'
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                    aria-label={`Ir para depoimento ${index + 1}`}
                  />
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={nextTestimonial}
                className="magnetic"
                aria-label="Próximo depoimento"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-4 gap-8 mt-16"
        >
          {[
            { number: '150+', label: 'Empresas atendidas' },
            { number: '95%', label: 'Taxa de retenção' },
            { number: '3x', label: 'ROI médio' },
            { number: '24h', label: 'Tempo de implementação' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-bold gradient-brand bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}