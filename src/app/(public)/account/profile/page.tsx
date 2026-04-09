"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PedidosService } from "@/lib/api";
import {
  LogOut,
  User,
  Mail,
  Shield,
  Settings,
  ShoppingBag,
  Bell,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [pedidosActivos, setPedidosActivos] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Carga el conteo de pedidos activos una vez que hay sesión
  useEffect(() => {
    if (!mounted || !token) return;
    PedidosService.getMisPedidos()
      .then((pedidos) => {
        const activos = pedidos.filter((p) =>
          ["procesando", "pendiente", "enviado"].includes(p.estado.toLowerCase())
        ).length;
        setPedidosActivos(activos);
      })
      .catch(() => setPedidosActivos(0));
  }, [mounted, token]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!mounted) return <ProfileSkeleton />;

  if (!token || !user) {
    // Redirección silenciosa o mensaje de error limpio
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 mb-4">Iniciá sesión para continuar</p>
        <Button
          onClick={() => router.push("/login")}
          className="bg-color-principal rounded-full p-6"
        >
          Login
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* ASIDE: PERFIL Y ACCIONES RÁPIDAS */}
        <aside className="w-full lg:w-1/3">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center sticky top-24 ">
            <div className="w-24 h-24 bg-color-principal rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User className="text-white" size={48} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-5">
              {user.email.split("@")[0]}
            </h2>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 rounded-xl"
                asChild
              >
                <Link href="/account/settings">
                  <Settings size={16} /> Ajustes
                </Link>
              </Button>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start gap-3 rounded-xl text-red-500 hover:bg-red-50"
              >
                <LogOut size={16} /> Salir
              </Button>
            </div>
          </div>
        </aside>

        {/* MAIN: INFORMACIÓN RELEVANTE */}
        <main className="flex-1 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-lg font-bold text-color-principal mb-6">
              Datos de contacto
            </h3>

            <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <Mail className="text-color-principal" size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Correo electrónico
                </p>
                <p className="font-semibold text-gray-800">{user.email}</p>
              </div>
            </div>
          </div>

          {/* DASHBOARD DE COMPRAS (PLACEHOLDER PROFESIONAL) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/account/orders"
              className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div className="p-3 bg-blue-50 text-color-principal rounded-2xl group-hover:bg-blue-100 transition-colors">
                <ShoppingBag size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {pedidosActivos === null ? (
                    <span className="inline-block w-6 h-6 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    pedidosActivos
                  )}
                </p>
                <p className="text-xs text-gray-500">Pedidos activos</p>
              </div>
            </Link>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-color-principal rounded-2xl">
                <Bell size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-gray-500">Notificaciones</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/3 h-64 bg-gray-200 rounded-3xl" />
        <div className="flex-1 h-96 bg-gray-100 rounded-3xl" />
      </div>
    </div>
  );
}
