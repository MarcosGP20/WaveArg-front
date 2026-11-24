import { z } from "zod";

// Formulario de avisos de la home: sólo el email es obligatorio.
export const leadSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Escribí tu email para poder avisarte")
    .email("Revisá el email: le falta algo, como el @ o el dominio"),
  modelo: z.string().trim().max(60, "Contalo en menos de 60 caracteres"),
  whatsapp: z
    .string()
    .trim()
    .refine((v) => v === "" || /^\+?\d[\d\s-]{7,17}$/.test(v), "Escribí el número con código de área, sólo números"),
});

export type LeadFormValues = z.infer<typeof leadSchema>;
