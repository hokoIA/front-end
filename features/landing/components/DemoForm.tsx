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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/features/landing/ui/select';
import { DialogHeader, DialogTitle, DialogDescription } from '@/features/landing/ui/dialog';
import { Loader as Loader2, CircleCheck as CheckCircle, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { trackEvent } from "@/lib/analytics";

const formSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  company: z.string().min(2, 'Nome da empresa deve ter pelo menos 2 caracteres'),
  position: z.string().min(2, 'Cargo deve ter pelo menos 2 caracteres'),
  companySize: z.string().min(1, 'Selecione o tamanho da empresa'),
  interests: z.string().min(10, 'Descreva brevemente seus interesses'),
});

type FormData = z.infer<typeof formSchema>;

const companySizes = [
  { value: 'startup', label: '1-10 funcionários (Startup)' },
  { value: 'small', label: '11-50 funcionários (Pequena)' },
  { value: 'medium', label: '51-200 funcionários (Média)' },
  { value: 'large', label: '201-1000 funcionários (Grande)' },
  { value: 'enterprise', label: '1000+ funcionários (Enterprise)' },
];

export default function DemoForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
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

      trackEvent("generate_lead", {
        form_name: "demo_form",
        lead_type: "demo_request",
        company_size: data.companySize,
        source_component: "DemoForm",
      });

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
        className="text-center py-8"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-hoko-quaternary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Solicitação enviada!</h3>
        <p className="text-muted-foreground mb-4">
          Nossa equipe entrará em contato em até 24 horas para agendar sua demonstração personalizada.
        </p>
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            Enquanto isso, que tal conhecer nossos cases de sucesso?
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      <DialogHeader>
        <DialogTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-hoko-primary" />
          <span>Solicitar Demonstração</span>
        </DialogTitle>
        <DialogDescription>
          Preencha os dados abaixo e nossa equipe entrará em contato.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-2 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nome completo *</Label>
            <Input
              id="name"
              {...register('name')}
              className={`focus-ring ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Seu nome"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="position">Cargo *</Label>
            <Input
              id="position"
              {...register('position')}
              className={`focus-ring ${errors.position ? 'border-red-500' : ''}`}
              placeholder="Ex: CMO, Diretor de Marketing"
            />
            {errors.position && (
              <p className="text-sm text-red-600 mt-1">{errors.position.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email corporativo *</Label>
          <Input
            id="email"
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
            <Label htmlFor="phone">Telefone *</Label>
            <Input
              id="phone"
              {...register('phone')}
              className={`focus-ring ${errors.phone ? 'border-red-500' : ''}`}
              placeholder="(11) 99999-9999"
              onChange={(e) => {
                const formatted = formatPhone(e.target.value);
                e.target.value = formatted;
                setValue('phone', formatted);
              }}
            />
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="company">Empresa *</Label>
            <Input
              id="company"
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
          <Label htmlFor="companySize">Tamanho da empresa *</Label>
          <Select onValueChange={(value) => setValue('companySize', value)}>
            <SelectTrigger className={`focus-ring ${errors.companySize ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Selecione o tamanho da empresa" />
            </SelectTrigger>
            <SelectContent>
              {companySizes.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.companySize && (
            <p className="text-sm text-red-600 mt-1">{errors.companySize.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="interests">Principais desafios e interesses *</Label>
          <Textarea
            id="interests"
            {...register('interests')}
            className={`focus-ring ${errors.interests ? 'border-red-500' : ''}`}
            placeholder="Conte-nos sobre seus principais desafios em gestão de marca e o que mais te interessa na nossa plataforma..."
            rows={3}
          />
          {errors.interests && (
            <p className="text-sm text-red-600 mt-1">{errors.interests.message}</p>
          )}
        </div>

        {/*<div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-hoko-quaternary mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-foreground">O que você recebe:</p>
              <ul className="mt-1 space-y-1 text-muted-foreground">
                <li>• Demonstração ao vivo da plataforma (45 min)</li>
                <li>• Análise gratuita dos seus dados</li>
                <li>• Proposta comercial personalizada</li>
                <li>• 30 dias de teste gratuito</li>
              </ul>
            </div>
          </div>
        </div>*/}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full gradient-brand text-white border-0 magnetic"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando solicitação...
            </>
          ) : (
            'Agendar demonstração'
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Ao enviar, você concorda com nossa{' '}
          <button type="button" className="underline hover:text-primary" onClick={() => window.location.href = "/legal/privacidade"}>
            Política de Privacidade
          </button>
        </p>
      </form>
    </div>
  );
}