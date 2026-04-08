import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es obligatorio")
    .email("Formato de correo inválido"),
  contraseña: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es obligatorio")
    .email("Formato de correo inválido"),
  contraseña: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  rolId: z.number(),
});

export const solicitarResetSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es obligatorio")
    .email("Formato de correo inválido"),
});

export const resetearContrasenaSchema = z
  .object({
    nuevaContrasena: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmarContrasena: z.string().min(1, "Confirmá tu contraseña"),
  })
  .refine((data) => data.nuevaContrasena === data.confirmarContrasena, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarContrasena"],
  });

// Tipos inferidos para usar con React Hook Form
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type SolicitarResetFormValues = z.infer<typeof solicitarResetSchema>;
export type ResetearContrasenaFormValues = z.infer<typeof resetearContrasenaSchema>;
