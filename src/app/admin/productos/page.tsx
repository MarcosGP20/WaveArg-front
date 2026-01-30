"use client";

import { useEffect, useState } from "react";
import { ProductService, Producto } from "@/lib/api";
import Link from "next/link";
import { Plus, Settings2 } from "lucide-react";

export default function InventarioPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ProductService.getAll()
      .then(setProductos)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#05467d]">
          Inventario de Productos
        </h1>
        <Link
          href="/admin/productos/nuevo"
          className="bg-[#05467d] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#043a68] transition-all"
        >
          <Plus size={20} /> Nuevo Producto
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-[#05467d] uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Producto</th>
              <th className="px-6 py-4">Modelo</th>
              <th className="px-6 py-4">Stock Total</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {productos.map((p) => (
              <tr key={p.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {p.nombre}
                </td>
                <td className="px-6 py-4 text-gray-600">{p.modelo}</td>
                <td className="px-6 py-4 text-gray-600">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      p.stockTotal > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {p.stockTotal} unidades
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-3">
                    <Link
                      href={`/admin/productos/${p.id}/variantes`}
                      className="flex items-center gap-1 text-sm text-[#05467d] hover:underline font-semibold"
                      title="Gestionar Variantes"
                    >
                      <i data-lucide="layers-plus"></i> + Variante
                    </Link>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Settings2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
