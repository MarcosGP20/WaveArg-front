"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2, LogIn, Mail, Lock, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore"; // Importamos tu nuevo Store
import { loginSchema, LoginFormValues } from "@/schemas/auth.schema"; // Importamos el esquema centralizado
import {
  decodeJWT,
  getUserIdFromJWT,
  getEmailFromJWT,
  getRoleFromJWT,
} from "@/lib/jwt"; // Para extraer datos del JWT

export function LoginForm() {
  const [serverError, setServerError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const router = useRouter();

  // Obtenemos la función setAuth del estado global
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError("");
    setStatusMessage("Validando credenciales...");

    try {
      // 1. Llamada al backend .NET
      const response = await loginUser({
        email: data.email,
        contraseña: data.contraseña, // Usamos 'contraseña' como definimos en el DTO
      });

      console.log("🔍 Respuesta del login:", response);

      // 2. Si hay éxito, guardamos en el Estado Global (Zustand)
      if (response && response.token) {
        console.log("✅ Token recibido, guardando en store...");

        // Si el backend no devuelve user, lo extraemos del JWT
        let user = response.user;
        if (!user) {
          const userId = getUserIdFromJWT(response.token);
          const email = getEmailFromJWT(response.token);
          const rol = getRoleFromJWT(response.token);

          user = {
            id: userId || "unknown",
            email: email || data.email,
            rol: rol || "User",
          };
          console.log("📄 Usuario extraído del JWT:", user);
        }

        setAuth(response.token, user);
        console.log("✅ Auth guardado en store");

        setStatusMessage("Sesión iniciada con éxito. Redirigiendo...");

        // 3. Redirección basada en Rol (con validación)
        const isAdmin = user?.rol === "Admin";

        setTimeout(() => {
          router.push(isAdmin ? "/admin" : "/account/profile");
        }, 1000);
      }
    } catch (error: any) {
      setStatusMessage("");
      // El error viene del throw que configuramos en api.ts
      setServerError(error.message || "Credenciales incorrectas.");
    }
  };

  return (
    <div className="max-w-md w-full space-y-6 mx-auto bg-white/90 rounded-2xl shadow-lg p-8 border border-[#e3f0fa]">
      <h2 className="text-2xl font-bold text-center text-[#05467D]">
        Iniciar Sesión
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Campo Email */}
        <div>
          <Label htmlFor="email">Email</Label>
          <div className="flex items-center gap-2 py-2">
            <Mail size={16} className="text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              className={errors.email ? "border-red-500" : ""}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Campo Contraseña */}
        <div>
          <Label htmlFor="password">Contraseña</Label>
          <div className="flex items-center gap-2 py-2">
            <Lock size={16} className="text-gray-400" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className={errors.contraseña ? "border-red-500" : ""}
              {...register("contraseña")}
            />
          </div>
          {errors.contraseña && (
            <p className="text-xs text-red-500 mt-1">
              {errors.contraseña.message}
            </p>
          )}
        </div>

        {/* Mensajes de Estado */}
        {serverError && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600 text-center">{serverError}</p>
          </div>
        )}

        {statusMessage && (
          <p className="text-sm text-blue-600 text-center font-medium">
            {statusMessage}
          </p>
        )}

        <Button
          type="submit"
          className="w-full bg-[#05467D] hover:bg-[#0F3C64] text-white font-bold py-6 rounded-xl shadow-md transition-all active:scale-[0.98]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2" size={18} /> Iniciando...
            </>
          ) : (
            <>
              <LogIn className="mr-2" size={18} /> Entrar a Wave Arg
            </>
          )}
        </Button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-4 text-gray-400">o continuar con</span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full py-6 rounded-xl flex items-center justify-center gap-3 border-gray-200 hover:bg-gray-50"
        onClick={() => alert("Próximamente...")}
      >
        <ShieldCheck size={18} className="text-blue-500" /> Google
      </Button>

      <p className="text-sm text-center mt-6 text-gray-500">
        ¿Aún no eres parte?{" "}
        <a
          href="/register"
          className="text-[#05467D] font-bold hover:underline"
        >
          Crea tu cuenta gratis
        </a>
      </p>
    </div>
  );
}
