"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2, LogIn, Mail, Lock, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/lib/api";

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
  const router = useRouter();
  const { login } = useAuth(); // ← ahora usamos tu contexto

  const onSubmit = async (data: LoginData) => {
    setServerError("");
    setStatusMessage("Iniciando sesión...");
    try {
      // Llama a tu backend real
      const response = (await loginUser({
        email: data.email,
        contraseña: data.password,
      })) as { token?: string; role?: string };
      if (response && response.token) {
        localStorage.setItem("token", response.token);
        // Solo permitimos "user" o "admin" como rol
        const role = response.role === "admin" ? "admin" : "user";
        login(role);
        setStatusMessage("Sesión iniciada con éxito. Redirigiendo...");
        setTimeout(() => {
          router.push(role === "admin" ? "/admin" : "/account");
        }, 1000);
      } else {
        setStatusMessage("");
        setServerError("Credenciales incorrectas o respuesta inválida.");
      }
    } catch (error: any) {
      setStatusMessage("");
      setServerError(
        error?.message || "Error inesperado. Reintentá más tarde."
      );
    }
  };

  const handleGoogleLogin = () => {
    alert("Este botón aún no está conectado. Simulalo manualmente.");
  };

  return (
    <div className="max-w-md w-full space-y-6 mx-auto bg-white/90 rounded-2xl shadow-lg p-8 border border-[#e3f0fa]">
      <h2 className="text-2xl font-bold text-center">Iniciar Sesión</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="email">Email</Label>
          <div className="flex items-center gap-2 py-2">
            <Mail size={16} />
            <Input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
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
            />
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {serverError && (
          <p className="text-sm text-red-500 text-center">{serverError}</p>
        )}

        {statusMessage && (
          <p className="text-sm text-blue-500 text-center">{statusMessage}</p>
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
          <span className="bg-white px-2 text-gray-500">o con Google</span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
        onClick={handleGoogleLogin}
      >
        <ShieldCheck size={16} /> Iniciar sesión con Google
      </Button>

      <p className="text-sm text-center mt-4 text-muted-foreground">
        ¿No tenés una cuenta?{" "}
        <a
          href="/register"
          className="text-blue-600 font-semibold hover:underline"
        >
          Registrate
        </a>
      </p>
    </div>
  );
}
