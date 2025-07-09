"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "@/lib/api";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, User, Mail, Lock, LogIn, ShieldCheck } from "lucide-react";

// 📌 Validaciones con zod
const registerSchema = z
  .object({
    name: z.string().min(2, { message: "Nombre muy corto" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z.string().min(6, { message: "Mínimo 6 caracteres" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const [serverError, setServerError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const onSubmit = async (data: RegisterData) => {
    setServerError("");
    setStatusMessage("Registrando...");
    try {
      // Llama a tu backend real
      await registerUser({
        name: data.name,
        email: data.email,
        Contraseña: data.password,
      });
      setStatusMessage("Registro exitoso. Redirigiendo...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (error: any) {
      setStatusMessage("");
      setServerError(error?.message || "Error al registrarse");
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = "https://tu-api.com/api/auth/google";
  };

  return (
    <div className="max-w-md w-full space-y-6 mx-auto bg-white/90 rounded-2xl shadow-lg p-8 border border-[#e3f0fa]">
      <h2 className="text-2xl font-bold text-center">Crear cuenta</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="name">Nombre</Label>
          <div className="flex items-center gap-2 py-2">
            <User size={16} />
            <Input
              id="name"
              type="text"
              placeholder="Tu nombre"
              {...register("name")}
              aria-invalid={!!errors.name}
            />
          </div>
          {errors.name && (
            <p className="text-sm text-red-500" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <div className="flex items-center gap-2 py-2">
            <Mail size={16} />
            <Input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              {...register("email")}
              aria-invalid={!!errors.email}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="password">Contraseña</Label>
          <div className="flex items-center gap-2 py-2">
            <Lock size={16} />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              aria-invalid={!!errors.password}
            />
          </div>
          {errors.password && (
            <p className="text-sm text-red-500" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
          <div className="flex items-center gap-2 py-2">
            <Lock size={16} />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              aria-invalid={!!errors.confirmPassword}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500" role="alert">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {serverError && (
          <p className="text-sm text-red-500 text-center" role="alert">
            {serverError}
          </p>
        )}

        {statusMessage && (
          <p className="text-sm text-blue-500 text-center" role="status">
            {statusMessage}
          </p>
        )}

        <Button
          type="submit"
          className="w-full bg-[#05467D] hover:bg-[#0F3C64] text-white font-bold py-3 rounded-xl shadow transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2" size={16} /> Registrando...
            </>
          ) : (
            <>
              <LogIn className="mr-2" size={16} /> Registrarse
            </>
          )}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-2 text-muted-foreground">
            o con Google
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
        onClick={handleGoogleRegister}
        aria-label="Registrarse con Google"
      >
        <ShieldCheck size={16} /> Registrarse con Google
      </Button>

      <p className="text-sm text-center mt-4 text-muted-foreground">
        ¿Ya tenés cuenta?{" "}
        <a
          href="/login"
          className="text-blue-600 font-semibold hover:underline transition"
        >
          Iniciá sesión
        </a>
      </p>
    </div>
  );
}
