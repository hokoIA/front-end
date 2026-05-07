'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/features/landing/ui/button';
import { Input } from '@/features/landing/ui/input';
import { Label } from '@/features/landing/ui/label';
import { Textarea } from '@/features/landing/ui/textarea';
import { SheetHeader, SheetTitle, SheetDescription } from '@/features/landing/ui/sheet';
import { Loader as Loader2, CircleCheck as CheckCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  company: z.string().min(2, 'Nome da empresa deve ter pelo menos 2 caracteres'),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.message || 'Erro no envio');

      setIsSubmitted(true);
      toast.success('Solicitação enviada com sucesso! Entraremos em contato em breve.');
      reset();
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-hoko-quaternary" />
        </div>
        <h3 className="text-2xl font-semibold mb-3">Mensagem enviada!</h3>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Recebemos sua mensagem e nossa equipe entrará em contato em até 2 horas durante o horário comercial.
        </p>
        <div className="bg-gradient-brand-subtle rounded-lg p-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Sparkles className="h-4 w-4 text-hoko-primary" />
            <span className="font-medium text-sm">Próximos passos</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Prepare-se para descobrir como nossa IA pode transformar sua estratégia de marca!
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      <SheetHeader>
        <SheetTitle className="text-2xl">Vamos conversar?</SheetTitle>
        <SheetDescription>
          Conte-nos sobre seus desafios e vamos mostrar como a ho.ko AI.nalytics pode ajudar sua marca a crescer.
        </SheetDescription>
      </SheetHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
        <div>
          <Label htmlFor="contact-name">Nome completo *</Label>
          <Input
            id="contact-name"
            {...register('name')}
            className={`focus-ring ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Seu nome"
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="contact-email">Email *</Label>
          <Input
            id="contact-email"
            type="email"
            {...register('email')}
            className={`focus-ring ${errors.email ? 'border-red-500' : ''}`}
            placeholder="seu.email@empresa.com"
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contact-phone">Telefone *</Label>
            <Input
              id="contact-phone"
              {...register('phone', {
                onChange: (e) => {
                  const formatted = formatPhone(e.target.value);
                  e.target.value = formatted;
                }
              })}
              className={`focus-ring ${errors.phone ? 'border-red-500' : ''}`}
              placeholder="(19) 99714-8221"
            />
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="contact-company">Empresa *</Label>
            <Input
              id="contact-company"
              {...register('company')}
              className={`focus-ring ${errors.company ? 'border-red-500' : ''}`}
              placeholder="Nome da empresa"
            />
            {errors.company && (
              <p className="text-sm text-red-600 mt-1">{errors.company.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="contact-message">Como podemos ajudar? *</Label>
          <Textarea
            id="contact-message"
            {...register('message')}
            className={`focus-ring ${errors.message ? 'border-red-500' : ''}`}
            placeholder="Conte-nos sobre seus objetivos, desafios atuais em gestão de marca, ou qualquer pergunta específica sobre nossa plataforma..."
            rows={4}
          />
          {errors.message && (
            <p className="text-sm text-red-600 mt-1">{errors.message.message}</p>
          )}
        </div>

        <div className="bg-hoko-primary/5 rounded-lg p-4 border border-hoko-primary/20">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-hoko-primary/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="h-3 w-3 text-hoko-primary" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">Resposta rápida garantida</p>
              <p className="text-muted-foreground text-xs">
                Nossa equipe de especialistas responde em até 2 horas durante o horário comercial.
                Para urgências, entre em contato via WhatsApp.
              </p>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full gradient-brand text-white border-0 magnetic"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando mensagem...
            </>
          ) : (
            'Enviar mensagem'
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Ao enviar, você concorda com nossa{' '}
          <button type="button" className="underline hover:text-primary">
            Política de Privacidade
          </button>
          . Seus dados estão seguros conosco.
        </p>
      </form>
    </div>
  );
}