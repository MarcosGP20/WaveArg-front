"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormValues } from "@/schemas/auth.schema";
import { registerUser, loginWithGoogle } from "@/lib/api";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuthStore } from "@/store/useAuthStore";

const GoogleLoginButton = dynamic(() => import("@/components/GoogleLoginButton"), { ssr: false });
import { getUserIdFromJWT, getEmailFromJWT, getRoleFromJWT } from "@/lib/jwt";

export function RegisterForm() {
  const [serverError, setServerError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

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
    } catch (error: unknown) {
      setStatusMessage("");
      // Capturamos el mensaje de error que definimos en fetchFromApi
      setServerError(error instanceof Error ? error.message : "Hubo un problema al crear la cuenta.");
    }
  };

  // Registro/Login con Google — mismo endpoint que el login.
  // El backend crea el usuario si no existe, o lo autentica si ya existe.
  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) return;
    setServerError("");
    setStatusMessage("Verificando cuenta de Google...");
    try {
      const response = await loginWithGoogle(credentialResponse.credential);
      if (response?.token) {
        let user = response.user;
        if (!user) {
          user = {
            id: getUserIdFromJWT(response.token) || "unknown",
            email: getEmailFromJWT(response.token) || "",
            rol: getRoleFromJWT(response.token) || "User",
          };
        }
        setAuth(response.token, user);
        setStatusMessage("¡Cuenta lista! Redirigiendo...");
        const isAdmin = user?.rol === "Admin";
        setTimeout(() => router.push(isAdmin ? "/admin" : "/account/profile"), 1000);
      }
    } catch (error: unknown) {
      setStatusMessage("");
      setServerError(error instanceof Error ? error.message : String(error) || "Error al registrarse con Google.");
    }
  };

  return (
    <div className="max-w-md w-full space-y-6 mx-auto bg-white/90 rounded-2xl shadow-lg p-8 border border-[#e3f0fa]">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold text-color-principal">Unite a Wave Arg</h2>
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
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "reg-email-error" : undefined}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p id="reg-email-error" role="alert" className="text-xs text-red-500">
              {errors.email.message}
            </p>
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
              aria-invalid={!!errors.contraseña}
              aria-describedby={errors.contraseña ? "reg-password-error" : undefined}
              {...register("contraseña")}
            />
          </div>
          {errors.contraseña && (
            <p id="reg-password-error" role="alert" className="text-xs text-red-500">
              {errors.contraseña.message}
            </p>
          )}
        </div>

        {/* Feedback al usuario */}
        {serverError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
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
          className="w-full bg-color-principal hover:bg-color-principal-oscuro text-white font-bold py-6 rounded-full shadow-md transition-all active:scale-[0.98]"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
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

      <div className="flex justify-center">
        <GoogleLoginButton
          onSuccess={handleGoogleSuccess}
          onError={() => setServerError("Error al conectar con Google. Intentá de nuevo.")}
          text="signup_with"
        />
      </div>

      <p className="text-sm text-center mt-4 text-gray-500">
        ¿Ya tenés cuenta?{" "}
        <a href="/login" className="text-color-principal font-bold hover:underline">
          Iniciá sesión
        </a>
      </p>
    </div>
  );
}
