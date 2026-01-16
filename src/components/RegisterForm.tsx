"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormValues } from "@/schemas/auth.schema";
import { registerUser } from "@/lib/api";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, User, Mail, Lock, UserPlus, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const [serverError, setServerError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      rolId: 0,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError("");
    setStatusMessage("Creando tu cuenta...");

    try {
      // Enviamos los datos exactos que espera el controlador de .NET
      await registerUser({
        email: data.email,
        contraseña: data.contraseña,
        rolId: data.rolId || 0,
      });

      setStatusMessage(
        "¡Registro exitoso! Redirigiendo al inicio de sesión..."
      );

      // Usamos router.push para una navegación fluida (SPA)
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      setStatusMessage("");
      // Capturamos el mensaje de error que definimos en fetchFromApi
      setServerError(error?.message || "Hubo un problema al crear la cuenta.");
    }
  };

  return (
    <div className="max-w-md w-full space-y-6 mx-auto bg-white/90 rounded-2xl shadow-lg p-8 border border-[#e3f0fa]">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold text-[#05467D]">Unite a Wave Arg</h2>
        <p className="text-sm text-gray-500">
          Crea tu cuenta y surfeá al próximo nivel
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <Input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className={`pl-10 ${errors.contraseña ? "border-red-500" : ""}`}
              {...register("contraseña")}
            />
          </div>
          {errors.contraseña && (
            <p className="text-xs text-red-500">{errors.contraseña.message}</p>
          )}
        </div>

        {/* Feedback al usuario */}
        {serverError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 text-center">{serverError}</p>
          </div>
        )}

        {statusMessage && (
          <p className="text-sm text-blue-600 text-center animate-pulse">
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
              <Loader2 className="animate-spin mr-2" size={18} /> Procesando...
            </>
          ) : (
            <>
              <UserPlus className="mr-2" size={18} /> Crear cuenta
            </>
          )}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-400">O también</span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full py-6 flex items-center justify-center gap-2 border-gray-200 hover:bg-gray-50 transition-colors"
        onClick={() => alert("Función próximamente disponible")}
      >
        <ShieldCheck className="text-blue-500" size={18} /> Registrarse con
        Google
      </Button>

      <p className="text-sm text-center mt-4 text-gray-500">
        ¿Ya tenés cuenta?{" "}
        <a href="/login" className="text-[#05467D] font-bold hover:underline">
          Iniciá sesión
        </a>
      </p>
    </div>
  );
}
