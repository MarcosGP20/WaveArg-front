import { UserCircle, ShoppingBag, Settings } from "lucide-react";
import Link from "next/link";

// El acceso (sin sesión → /login, admin → /admin) lo resuelve account/layout.tsx en el servidor.
export default function AccountPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Mi cuenta</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tarjeta 1: Información personal */}
        <Link
          href="/account/profile"
          className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer block group"
        >
          <UserCircle className="w-8 h-8 text-blue-600 mb-3 group-hover:text-blue-700 transition-colors" />
          <h2 className="text-lg font-medium mb-1">Información personal</h2>
          <p className="text-sm text-gray-500">
            Editá tu nombre, email o contraseña.
          </p>
        </Link>

        {/* Tarjeta 2: Historial de compras */}
        <Link
          href="/account/orders"
          className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer block group"
        >
          <ShoppingBag className="w-8 h-8 text-green-600 mb-3 group-hover:text-green-700 transition-colors" />
          <h2 className="text-lg font-medium mb-1">Historial de compras</h2>
          <p className="text-sm text-gray-500">
            Revisá tus pedidos anteriores y su estado.
          </p>
        </Link>

        {/* Tarjeta 3: Ajustes */}
        <Link
          href="/account/settings"
          className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer block group"
        >
          <Settings className="w-8 h-8 text-gray-700 mb-3 group-hover:text-gray-900 transition-colors" />
          <h2 className="text-lg font-medium mb-1">Ajustes</h2>
          <p className="text-sm text-gray-500">
            Configurá notificaciones y preferencias.
          </p>
        </Link>
      </div>
    </div>
  );
}
