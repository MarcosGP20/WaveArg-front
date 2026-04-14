"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Bell, Shield, Trash2, ChevronRight, Loader2, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cambiarContrasena } from "@/lib/api";

interface CambiarContrasenaForm {
  contrasenaActual: string;
  nuevaContrasena: string;
  confirmarContrasena: string;
}

export default function SettingsPage() {
  const { token, user, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!token || !user) router.replace("/login");
  }, [mounted, token, user, router]);

  if (!mounted || !token || !user) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin w-6 h-6 mr-2 text-gray-400" />
        <span className="text-gray-400">Cargando...</span>
      </div>
    );
  }

  const handleDeleteAccount = () => {
    toast.info("Función disponible próximamente.");
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/account" className="hover:text-color-principal transition-colors">
          Mi cuenta
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-600 font-medium">Ajustes</span>
      </nav>

      <h1 className="text-3xl font-bold text-color-principal mb-8">Ajustes</h1>

      <div className="space-y-4">
        {/* Notificaciones */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-xl">
              <Bell className="text-color-principal" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Notificaciones</h2>
          </div>

          <div className="space-y-4">
            <SettingRow
              label="Novedades y promociones"
              description="Recibí ofertas exclusivas y lanzamientos de nuevos productos."
              soon
            />
            <SettingRow
              label="Actualizaciones de pedidos"
              description="Te avisamos cuando tu pedido tenga novedades de estado."
              soon
            />
          </div>
        </div>

        {/* Seguridad */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-50 rounded-xl">
              <Shield className="text-green-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Seguridad</h2>
          </div>

          <div className="py-3 border-t border-gray-50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Cambiar contraseña</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Actualizá tu contraseña periódicamente para mayor seguridad.
                </p>
              </div>
              {!showPasswordForm && (
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full shrink-0"
                  onClick={() => setShowPasswordForm(true)}
                >
                  Cambiar
                </Button>
              )}
            </div>

            {showPasswordForm && (
              <PasswordForm
                onClose={() => setShowPasswordForm(false)}
                onSuccess={() => {
                  setShowPasswordForm(false);
                  logout();
                  router.push("/login");
                }}
              />
            )}
          </div>
        </div>

        {/* Zona de peligro */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-50 rounded-xl">
              <Trash2 className="text-red-500" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Zona de peligro</h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-medium text-gray-700 text-sm">Eliminar cuenta</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Esta acción es permanente e irreversible.
              </p>
            </div>
            <Button
              variant="outline"
              className="border-red-300 text-red-500 hover:bg-red-50 hover:border-red-400 rounded-full shrink-0"
              onClick={handleDeleteAccount}
            >
              <Trash2 size={14} className="mr-2" />
              Eliminar cuenta
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link
          href="/account/profile"
          className="text-sm text-gray-400 hover:text-color-principal transition-colors"
        >
          ← Volver a mi perfil
        </Link>
      </div>
    </div>
  );
}

function PasswordForm({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CambiarContrasenaForm>();

  const nuevaContrasena = watch("nuevaContrasena");

  const onSubmit = async (data: CambiarContrasenaForm) => {
    try {
      await cambiarContrasena({
        contrasenaActual: data.contrasenaActual,
        nuevaContrasena: data.nuevaContrasena,
      });
      toast.success("Contraseña actualizada. Iniciá sesión nuevamente.");
      onSuccess();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "No se pudo cambiar la contraseña";
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3">
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
          Contraseña actual
        </label>
        <input
          type="password"
          {...register("contrasenaActual", { required: "Requerido" })}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-color-principal/30 focus:border-color-principal"
          autoFocus
        />
        {errors.contrasenaActual && (
          <p className="text-xs text-red-500 mt-1">{errors.contrasenaActual.message}</p>
        )}
      </div>

      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
          Nueva contraseña
        </label>
        <input
          type="password"
          {...register("nuevaContrasena", {
            required: "Requerido",
            minLength: { value: 6, message: "Mínimo 6 caracteres" },
          })}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-color-principal/30 focus:border-color-principal"
        />
        {errors.nuevaContrasena && (
          <p className="text-xs text-red-500 mt-1">{errors.nuevaContrasena.message}</p>
        )}
      </div>

      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
          Confirmar nueva contraseña
        </label>
        <input
          type="password"
          {...register("confirmarContrasena", {
            required: "Requerido",
            validate: (v) => v === nuevaContrasena || "Las contraseñas no coinciden",
          })}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-color-principal/30 focus:border-color-principal"
        />
        {errors.confirmarContrasena && (
          <p className="text-xs text-red-500 mt-1">{errors.confirmarContrasena.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="rounded-full gap-2 text-gray-500"
          onClick={onClose}
          disabled={isSubmitting}
        >
          <X size={14} /> Cancelar
        </Button>
        <Button
          type="submit"
          size="sm"
          className="rounded-full bg-color-principal text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <><Loader2 size={14} className="animate-spin mr-1" /> Guardando...</>
          ) : (
            "Guardar"
          )}
        </Button>
      </div>
    </form>
  );
}

function SettingRow({
  label,
  description,
  soon = false,
}: {
  label: string;
  description: string;
  soon?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-t border-gray-50">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-700">{label}</p>
          {soon && (
            <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase tracking-wide">
              Próximamente
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
    </div>
  );
}
