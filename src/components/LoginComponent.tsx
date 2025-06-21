// components/LoginForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2, LogIn, Mail, Lock, ShieldCheck } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Mínimo 6 caracteres" }),
});

type LoginData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const [serverError, setServerError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const onSubmit = async (data: LoginData) => {
    setServerError("");
    setStatusMessage("Iniciando sesión...");

    try {
      const response = await axios.post("/api/login", data);
      const token = response.data.token;
      localStorage.setItem("token", token);

      setStatusMessage("Sesión iniciada con éxito. Redirigiendo...");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error: any) {
      setStatusMessage("");
      setServerError(
        error?.response?.data?.message || "Error al iniciar sesión"
      );
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://tu-api.com/api/auth/google";
  };

  return (
    <div
      className="max-w-md w-full space-y-6 mx-auto bg-white/90 rounded-2xl shadow-lg p-8 border border-[#e3f0fa]"
      aria-labelledby="login-title"
    >
      <h2 id="login-title" className="text-2xl font-bold text-center">
        Iniciar Sesión
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="email">Email</Label>
          <div className="flex items-center gap-2 py-2">
            <Mail size={16} />
            <Input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p
              id="email-error"
              className="text-sm text-red-500"
              role="alert"
              aria-live="polite"
            >
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
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
            />
          </div>
          {errors.password && (
            <p
              id="password-error"
              className="text-sm text-red-500"
              role="alert"
              aria-live="polite"
            >
              {errors.password.message}
            </p>
          )}
        </div>

        {serverError && (
          <p
            className="text-sm text-red-500 text-center"
            role="alert"
            aria-live="assertive"
          >
            {serverError}
          </p>
        )}

        {statusMessage && (
          <p
            className="text-sm text-blue-500 text-center"
            role="status"
            aria-live="polite"
          >
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
              <Loader2 className="animate-spin mr-2" size={16} /> Iniciando...
            </>
          ) : (
            <>
              <LogIn className="mr-2" size={16} /> Iniciar sesión
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
        onClick={handleGoogleLogin}
        aria-label="Iniciar sesión con Google"
      >
        <ShieldCheck size={16} /> Iniciar sesión con Google
      </Button>
    </div>
  );
}
