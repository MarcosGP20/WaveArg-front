"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2, Lock, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { resetearContrasena } from "@/lib/api";
import { resetearContrasenaSchema, ResetearContrasenaFormValues } from "@/schemas/auth.schema";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [exito, setExito] = useState(false);
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetearContrasenaFormValues>({
    resolver: zodResolver(resetearContrasenaSchema),
  });

  const onSubmit = async (data: ResetearContrasenaFormValues) => {
    setServerError("");
    try {
      await resetearContrasena(token, data.nuevaContrasena);
      setExito(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "";
      if (message.includes("inválido") || message.includes("expiró")) {
        setServerError("El link expiró o ya fue usado. Pedí uno nuevo.");
      } else {
        setServerError("Ocurrió un error. Intentá de nuevo.");
      }
    }
  };

  if (!token) {
    return (
      <div className="max-w-md w-full mx-auto bg-white/90 rounded-2xl shadow-lg p-8 border border-[#e3f0fa] text-center space-y-4">
        <AlertTriangle className="mx-auto text-yellow-500" size={48} />
        <h2 className="text-xl font-bold text-color-principal">Link inválido</h2>
        <p className="text-gray-600 text-sm">
          Este link de recuperación no es válido.
        </p>
        <Link
          href="/olvide-mi-contrasena"
          className="inline-block text-color-principal font-semibold text-sm hover:underline"
        >
          Solicitar un nuevo link
        </Link>
      </div>
    );
  }

  if (exito) {
    return (
      <div className="max-w-md w-full mx-auto bg-white/90 rounded-2xl shadow-lg p-8 border border-[#e3f0fa] text-center space-y-4">
        <CheckCircle className="mx-auto text-green-500" size={48} />
        <h2 className="text-xl font-bold text-color-principal">
          ¡Contraseña actualizada!
        </h2>
        <p className="text-gray-600 text-sm">
          Ya podés iniciar sesión con tu nueva contraseña.
        </p>
        <p className="text-xs text-gray-400">
          Redirigiendo al inicio de sesión...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full space-y-6 mx-auto bg-white/90 rounded-2xl shadow-lg p-8 border border-[#e3f0fa]">
      <div>
        <h2 className="text-2xl font-bold text-center text-color-principal">
          Nueva contraseña
        </h2>
        <p className="text-sm text-center text-gray-500 mt-2">
          Elegí una contraseña nueva para tu cuenta.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="nuevaContrasena">Nueva contraseña</Label>
          <div className="flex items-center gap-2 py-2">
            <Lock size={16} className="text-gray-400" />
            <Input
              id="nuevaContrasena"
              type="password"
              placeholder="Mínimo 6 caracteres"
              className={errors.nuevaContrasena ? "border-red-500" : ""}
              {...register("nuevaContrasena")}
            />
          </div>
          {errors.nuevaContrasena && (
            <p className="text-xs text-red-500 mt-1">
              {errors.nuevaContrasena.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmarContrasena">Confirmá la contraseña</Label>
          <div className="flex items-center gap-2 py-2">
            <Lock size={16} className="text-gray-400" />
            <Input
              id="confirmarContrasena"
              type="password"
              placeholder="Repetí tu nueva contraseña"
              className={errors.confirmarContrasena ? "border-red-500" : ""}
              {...register("confirmarContrasena")}
            />
          </div>
          {errors.confirmarContrasena && (
            <p className="text-xs text-red-500 mt-1">
              {errors.confirmarContrasena.message}
            </p>
          )}
        </div>

        {serverError && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600 text-center">{serverError}</p>
            {serverError.includes("expiró") && (
              <p className="text-xs text-center mt-1">
                <Link
                  href="/olvide-mi-contrasena"
                  className="text-color-principal font-semibold hover:underline"
                >
                  Pedí un nuevo link aquí
                </Link>
              </p>
            )}
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-color-principal hover:bg-color-principal-oscuro text-white font-bold py-6 rounded-xl shadow-md transition-all active:scale-[0.98]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2" size={18} /> Guardando...
            </>
          ) : (
            "Cambiar contraseña"
          )}
        </Button>
      </form>
    </div>
  );
}
