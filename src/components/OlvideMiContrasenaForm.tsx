"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { solicitarResetContrasena } from "@/lib/api";
import { solicitarResetSchema, SolicitarResetFormValues } from "@/schemas/auth.schema";

export function OlvideMiContrasenaForm() {
  const [enviado, setEnviado] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SolicitarResetFormValues>({
    resolver: zodResolver(solicitarResetSchema),
  });

  const onSubmit = async (data: SolicitarResetFormValues) => {
    await solicitarResetContrasena(data.email).catch(() => {});
    // Siempre mostramos el mensaje genérico, sin importar si el email existe
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div className="max-w-md w-full mx-auto bg-white/90 rounded-2xl shadow-lg p-8 border border-[#e3f0fa] text-center space-y-4">
        <CheckCircle className="mx-auto text-green-500" size={48} />
        <h2 className="text-xl font-bold text-color-principal">Revisá tu email</h2>
        <p className="text-gray-600 text-sm">
          Si el email está registrado, recibirás un enlace para restablecer tu
          contraseña en los próximos minutos.
        </p>
        <p className="text-xs text-gray-400">
          El link expira en 30 minutos. Si no lo ves, revisá la carpeta de spam.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-color-principal font-semibold text-sm hover:underline mt-2"
        >
          <ArrowLeft size={14} /> Volver al inicio de sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full space-y-6 mx-auto bg-white/90 rounded-2xl shadow-lg p-8 border border-[#e3f0fa]">
      <div>
        <h2 className="text-2xl font-bold text-center text-color-principal">
          Olvidé mi contraseña
        </h2>
        <p className="text-sm text-center text-gray-500 mt-2">
          Ingresá tu email y te enviaremos un link para restablecer tu
          contraseña.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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

        <Button
          type="submit"
          className="w-full bg-color-principal hover:bg-color-principal-oscuro text-white font-bold py-6 rounded-full shadow-md transition-all active:scale-[0.98]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2" size={18} /> Enviando...
            </>
          ) : (
            "Enviar link de recuperación"
          )}
        </Button>
      </form>

      <p className="text-sm text-center text-gray-500">
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-color-principal font-semibold hover:underline"
        >
          <ArrowLeft size={14} /> Volver al inicio de sesión
        </Link>
      </p>
    </div>
  );
}
