"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, UserCircle, ShoppingBag, Settings } from "lucide-react";

export default function AccountPage() {
  const { token, user } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!token || !user) {
      router.replace("/login");
      return;
    }
    // Admins van al panel; el hub de cuenta es para usuarios
    if (user.rol === "Admin") {
      router.replace("/admin");
    }
  }, [mounted, token, user, router]);

  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin w-6 h-6 mr-2 text-gray-600" />
        <span className="text-gray-600">Cargando...</span>
      </div>
    );
  }

  if (!token || !user) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin w-6 h-6 mr-2 text-gray-600" />
        <span className="text-gray-600">Redirigiendo al login...</span>
      </div>
    );
  }

  if (user.rol === "Admin") {
    return null; // redirect en efecto
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Mi cuenta</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition cursor-pointer">
          <UserCircle className="w-8 h-8 text-blue-600 mb-3" />
          <h2 className="text-lg font-medium mb-1">Información personal</h2>
          <p className="text-sm text-gray-500">
            Editá tu nombre, email o contraseña.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition cursor-pointer">
          <ShoppingBag className="w-8 h-8 text-green-600 mb-3" />
          <h2 className="text-lg font-medium mb-1">Historial de compras</h2>
          <p className="text-sm text-gray-500">
            Revisá tus pedidos anteriores y su estado.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition cursor-pointer">
          <Settings className="w-8 h-8 text-gray-700 mb-3" />
          <h2 className="text-lg font-medium mb-1">Ajustes</h2>
          <p className="text-sm text-gray-500">
            Configurá notificaciones y preferencias.
          </p>
        </div>
      </div>
    </div>
  );
}
