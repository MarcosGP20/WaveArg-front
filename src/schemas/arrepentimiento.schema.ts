import { z } from "zod";

// Botón de arrepentimiento: sin cuenta, alcanza con nombre y email (los límites son los del back).
export const arrepentimientoSchema = z.object({
  nombre: z.string().trim().min(1, "Escribí tu nombre").max(200, "Escribilo en menos de 200 caracteres"),
  email: z
    .string()
    .trim()
    .min(1, "Escribí tu email para mandarte el código")
    .email("Revisá el email: le falta algo, como el @ o el dominio"),
  numeroPedido: z.string().trim().max(50, "El número de pedido es más corto"),
  detalle: z.string().trim().max(1000, "Contalo en menos de 1000 caracteres"),
});

export type ArrepentimientoFormValues = z.infer<typeof arrepentimientoSchema>;
