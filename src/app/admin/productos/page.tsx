"use client";

import { useEffect, useState, useCallback } from "react";
import { ProductService, Producto } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { Plus, Trash2, Edit3, Image as ImageIcon, RefreshCw, AlertTriangle, Loader2, ChevronLeft, Star } from "lucide-react";
import { toast } from "sonner";

const FEATURED_KEY = "wave-featured-product-id";

export default function InventarioPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [featuredId, setFeaturedId] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(FEATURED_KEY);
    if (stored) setFeaturedId(Number(stored));
  }, []);

  const toggleFeatured = (id: number) => {
    if (featuredId === id) {
      localStorage.removeItem(FEATURED_KEY);
      setFeaturedId(null);
      toast.success("Producto destacado removido");
    } else {
      localStorage.setItem(FEATURED_KEY, String(id));
      setFeaturedId(id);
      toast.success("Producto marcado como destacado");
    }
  };

  const cargarProductos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ProductService.getAll();
      setProductos(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err) ?? "No se pudo cargar el inventario.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    try {
      await ProductService.delete(id);
      toast.success("Producto eliminado correctamente");
      setDeletingId(null);
      await cargarProductos();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : String(err) ?? "Error al eliminar el producto");
    } finally {
      setIsDeleting(false);
    }
  };

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
            className="flex items-center gap-2 bg-color-principal text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-color-principal-oscuro transition-colors"
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
      {/* Breadcrumb / Volver */}
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-color-principal transition-colors mb-6 group"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Volver al Dashboard
      </Link>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-color-principal">
          Inventario de Productos
        </h1>
        <Link
          href="/admin/productos/nuevo"
          className="bg-color-principal text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-color-principal-oscuro transition-all shadow-sm"
        >
          <Plus size={20} /> Nuevo Producto
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-color-principal uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4 w-20 text-center">Foto</th>
              <th className="px-6 py-4">Producto</th>
              <th className="px-6 py-4">Modelo</th>
              <th className="px-6 py-4">Stock Total</th>
              <th className="px-6 py-4 text-center">Destacado</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* AQUÍ CAMBIAMOS productos por productosAgrupados */}
            {productosAgrupados.map((p) => {
              const stockCalculado =
                p.variantes?.reduce((acc, v) => acc + v.stock, 0) || 0;

              return (
                <>
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
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleFeatured(p.id)}
                      title={featuredId === p.id ? "Quitar destacado" : "Marcar como destacado"}
                      className={`p-1.5 rounded-full transition-colors ${
                        featuredId === p.id
                          ? "text-amber-400 hover:text-amber-500"
                          : "text-gray-300 hover:text-amber-400"
                      }`}
                    >
                      <Star
                        size={18}
                        strokeWidth={1.75}
                        fill={featuredId === p.id ? "currentColor" : "none"}
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <Link
                        href={`/admin/productos/${p.id}/variantes`}
                        className="flex items-center gap-1 text-sm text-color-principal hover:text-blue-800 font-bold transition-colors"
                      >
                        + Variante
                      </Link>
                      <Link
                        href={`/admin/productos/${p.id}/editar`}
                        className="p-1.5 text-gray-400 hover:text-color-principal transition-colors"
                        title="Editar producto"
                      >
                        <Edit3 size={16} />
                      </Link>
                      <button
                        onClick={() => setDeletingId(p.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                        title="Eliminar producto"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Fila de confirmación de eliminación inline */}
                {deletingId === p.id && (
                  <tr key={`delete-${p.id}`} className="bg-red-50/60">
                    <td colSpan={5} className="px-6 py-3">
                      {p.variantes && p.variantes.length > 0 ? (
                        // Tiene variantes → bloquear y guiar al admin
                        <div className="flex items-center gap-4">
                          <p className="text-sm font-medium text-orange-700">
                            ⚠️ <span className="font-bold">{p.nombre}</span> tiene{" "}
                            <span className="font-bold">{p.variantes.length} variante(s)</span>.
                            Eliminá primero las variantes para poder borrar el producto.
                          </p>
                          <Link
                            href={`/admin/productos/${p.id}/variantes`}
                            className="text-sm bg-orange-500 text-white px-4 py-1.5 rounded-lg font-medium hover:bg-orange-600 transition-colors whitespace-nowrap"
                          >
                            Ir a variantes
                          </Link>
                          <button
                            onClick={() => setDeletingId(null)}
                            className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        // Sin variantes → confirmar eliminación normal
                        <div className="flex items-center gap-4">
                          <p className="text-sm font-medium text-red-700">
                            ¿Eliminar <span className="font-bold">{p.nombre}</span>? Esta acción no se puede deshacer.
                          </p>
                          <button
                            onClick={() => handleDelete(p.id)}
                            disabled={isDeleting}
                            className="flex items-center gap-1.5 bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                          >
                            {isDeleting ? <Loader2 size={13} className="animate-spin" /> : null}
                            Sí, eliminar
                          </button>
                          <button
                            onClick={() => setDeletingId(null)}
                            disabled={isDeleting}
                            className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
