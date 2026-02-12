"use client";

import { useEffect, useState } from "react";
import { ProductService, Producto } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { Plus, Settings2, Image as ImageIcon } from "lucide-react";

export default function InventarioPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ProductService.getAll()
      .then(setProductos)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500 font-medium">
        Cargando inventario...
      </div>
    );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#05467d]">
          Inventario de Productos
        </h1>
        <Link
          href="/admin/productos/nuevo"
          className="bg-[#05467d] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#043a68] transition-all shadow-sm"
        >
          <Plus size={20} /> Nuevo Producto
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-[#05467d] uppercase text-xs font-semibold">
            {/* Sin espacios entre etiquetas para evitar errores de hidratación */}
            <tr>
              <th className="px-6 py-4 w-20 text-center">Foto</th>
              <th className="px-6 py-4">Producto</th>
              <th className="px-6 py-4">Modelo</th>
              <th className="px-6 py-4">Stock Total</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {productos.map((p) => {
              // EL CÁLCULO VA AQUÍ ADENTRO
              const stockCalculado =
                p.variantes?.reduce((acc, v) => acc + v.stock, 0) || 0;

              return (
                <tr
                  key={p.id}
                  className="hover:bg-blue-50/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center shadow-sm">
                      {p.imagenes && p.imagenes.length > 0 ? (
                        <Image
                          src={p.imagenes[0]}
                          alt={p.nombre}
                          fill
                          className="object-cover"
                          unoptimized={true}
                        />
                      ) : (
                        <ImageIcon className="text-gray-300" size={20} />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {p.nombre}
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {p.modelo}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        stockCalculado > 0
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-red-100 text-red-700 border-red-200"
                      }`}
                    >
                      {stockCalculado} unidades
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <Link
                        href={`/admin/productos/${p.id}/variantes`}
                        className="flex items-center gap-1 text-sm text-[#05467d] hover:text-blue-800 font-bold transition-colors"
                      >
                        + Variante
                      </Link>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Settings2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
