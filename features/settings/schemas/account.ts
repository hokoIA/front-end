import { z } from "zod";

export const accountProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Informe pelo menos 2 caracteres")
    .max(120, "Nome muito longo"),
  email: z.string().email("E-mail inválido"),
});

export type AccountProfileForm = z.infer<typeof accountProfileSchema>;
