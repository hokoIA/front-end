import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe a senha."),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Informe seu nome."),
    email: z.string().email("Informe um e-mail válido."),
    password: z
      .string()
      .min(8, "Use no mínimo 8 caracteres.")
      .regex(/[A-Z]/, "Inclua ao menos 1 letra maiúscula.")
      .regex(/[a-z]/, "Inclua ao menos 1 letra minúscula.")
      .regex(/[^A-Za-z0-9]/, "Inclua ao menos 1 caractere especial."),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "As senhas não coincidem.",
    path: ["confirm"],
  });

export const forgotSchema = z.object({
  email: z.string().email("Informe um e-mail válido."),
});

export const resetSchema = z
  .object({
    password: z.string().min(8, "Mínimo de 8 caracteres."),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "As senhas não coincidem.",
    path: ["confirm"],
  });
