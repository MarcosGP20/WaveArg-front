"use client";

import { useEffect, useState, useCallback } from "react";
import { ProductService, Producto } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { Plus, Settings2, Image as ImageIcon, RefreshCw, AlertTriangle } from "lucide-react";

export default function InventarioPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarProductos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ProductService.getAll();
      setProductos(data);
    } catch (err: any) {
      setError(err.message ?? "No se pudo cargar el inventario.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500 font-medium">
        Cargando inventario...
      </div>
    );

  if (error)
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center gap-4 bg-red-50 border border-red-200 rounded-2xl p-10 text-center">
          <AlertTriangle size={40} className="text-red-400" />
          <p className="text-red-700 font-semibold text-lg">Error al cargar el inventario</p>
          <p className="text-red-500 text-sm max-w-sm">{error}</p>
          <button
            onClick={cargarProductos}
            className="flex items-center gap-2 bg-[#05467d] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#043a68] transition-colors"
          >
            <RefreshCw size={15} />
            Reintentar
          </button>
        </div>
      </div>
    );

  // Lógica de agrupación
  const productosAgrupados = productos.reduce((acc: Producto[], current) => {
    const key = `${current.nombre}-${current.modelo}`.toLowerCase();

    const existente = acc.find(
      (p) => `${p.nombre}-${p.modelo}`.toLowerCase() === key, // Corregido p.p.modelo -> p.modelo
    );

    if (existente) {
      existente.variantes = [
        ...(existente.variantes || []),
        ...(current.variantes || []),
      ];
      existente.imagenes = [
        ...(existente.imagenes || []),
        ...(current.imagenes || []),
      ];
    } else {
      acc.push({ ...current });
    }
    return acc;
  }, []);

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
            <tr>
              <th className="px-6 py-4 w-20 text-center">Foto</th>
              <th className="px-6 py-4">Producto</th>
              <th className="px-6 py-4">Modelo</th>
              <th className="px-6 py-4">Stock Total</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* AQUÍ CAMBIAMOS productos por productosAgrupados */}
            {productosAgrupados.map((p) => {
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
