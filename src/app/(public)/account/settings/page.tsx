"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Shield, Trash2, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function SettingsPage() {
  const { token, user, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

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
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/account" className="hover:text-[#05467D] transition-colors">
          Mi cuenta
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-600 font-medium">Ajustes</span>
      </nav>

      <h1 className="text-3xl font-bold text-[#05467D] mb-8">Ajustes</h1>

      <div className="space-y-4">
        {/* Sección: Notificaciones */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-xl">
              <Bell className="text-[#05467D]" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              Notificaciones
            </h2>
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

        {/* Sección: Seguridad */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-50 rounded-xl">
              <Shield className="text-green-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Seguridad</h2>
          </div>

          <div className="space-y-4">
            <SettingRow
              label="Cambiar contraseña"
              description="Actualizá tu contraseña periódicamente para mayor seguridad."
              soon
            />
          </div>
        </div>

        {/* Sección: Zona de peligro */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-50 rounded-xl">
              <Trash2 className="text-red-500" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              Zona de peligro
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-medium text-gray-700 text-sm">
                Eliminar cuenta
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Esta acción es permanente e irreversible.
              </p>
            </div>
            <Button
              variant="outline"
              className="border-red-300 text-red-500 hover:bg-red-50 hover:border-red-400 rounded-xl shrink-0"
              onClick={handleDeleteAccount}
            >
              <Trash2 size={14} className="mr-2" />
              Eliminar cuenta
            </Button>
          </div>
        </div>
      </div>

      {/* Volver al perfil */}
      <div className="mt-8">
        <Link
          href="/account/profile"
          className="text-sm text-gray-400 hover:text-[#05467D] transition-colors"
        >
          ← Volver a mi perfil
        </Link>
      </div>
    </div>
  );
}

// Componente auxiliar para filas de ajuste con badge "Próximamente"
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
