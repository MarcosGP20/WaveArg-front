"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, User, Mail, Shield } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Espera a que el estado se hidrate desde localStorage
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (!token || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No hay sesión activa</p>
          <Button onClick={() => router.push("/login")}>Ir a Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 border border-[#e3f0fa]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#05467D] rounded-full mb-4">
            <User className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-[#05467D]">Mi Perfil</h1>
          <p className="text-sm text-gray-500 mt-2">Información de tu cuenta</p>
        </div>

        <div className="space-y-6">
          {/* Email */}
          <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <Mail className="text-[#05467D] flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Email
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {user.email}
              </p>
            </div>
          </div>

          {/* Rol */}
          <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-100">
            <Shield className="text-green-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Rol
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {user.rol || "Usuario"}
              </p>
            </div>
          </div>

          {/* ID */}
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <User className="text-gray-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                ID
              </p>
              <p className="text-xs font-mono text-gray-700 break-all">
                {user.id}
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleLogout}
          className="w-full mt-8 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Cerrar Sesión
        </Button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Token: {token.substring(0, 20)}...
        </p>
      </div>
    </div>
  );
}
