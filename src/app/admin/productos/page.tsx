"use client";

import { Fragment, useEffect, useState, useCallback } from "react";
import { ProductService, Producto } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { Plus, Trash2, Edit3, Image as ImageIcon, Smartphone, Star } from "lucide-react";
import { toast } from "sonner";
import { CabeceraPagina, EstadoError, EstadoVacio, TablaSkeleton } from "../components/PaginaAdmin";
import { FilaConfirmarBorrado, StockBadge } from "../components/InventarioFilas";
import {
  botonPrimario,
  botonTexto,
  encabezadoTabla,
  enlaceAccion,
  filaTabla,
  panel,
  td,
  th,
} from "../components/estilos";

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

  // El estado arranca en loading: la carga inicial no vuelve a prenderlo (setState en el efecto).
  const traerProductos = useCallback(
    () =>
      ProductService.getAll()
        .then(setProductos)
        .catch((err: unknown) =>
          setError(err instanceof Error ? err.message : String(err) ?? "No se pudo cargar el inventario."),
        )
        .finally(() => setLoading(false)),
    [],
  );

  const cargarProductos = useCallback(async () => {
    setLoading(true);
    setError(null);
    await traerProductos();
  }, [traerProductos]);

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
    traerProductos();
  }, [traerProductos]);

  // Lógica de agrupación
  const productosAgrupados = productos.reduce((acc: Producto[], current) => {
    const key = `${current.nombre}-${current.modelo}`.toLowerCase();

    const existente = acc.find((p) => `${p.nombre}-${p.modelo}`.toLowerCase() === key);

    if (existente) {
      existente.variantes = [...(existente.variantes || []), ...(current.variantes || [])];
      existente.imagenes = [...(existente.imagenes || []), ...(current.imagenes || [])];
    } else {
      acc.push({ ...current });
    }
    return acc;
  }, []);

  return (
    <div>
      <CabeceraPagina
        titulo="Productos"
        subtitulo={
          loading || error
            ? undefined
            : `${productosAgrupados.length} ${productosAgrupados.length === 1 ? "producto" : "productos"}`
        }
      >
        <Link href="/admin/productos/nuevo" className={botonPrimario}>
          <Plus size={16} strokeWidth={1.75} />
          Nuevo producto
        </Link>
      </CabeceraPagina>

      {loading && <TablaSkeleton />}

      {error && !loading && (
        <EstadoError mensaje={`No se pudo cargar el inventario. ${error}`} onReintentar={cargarProductos} />
      )}

      {!loading && !error && productosAgrupados.length === 0 && (
        <EstadoVacio icono={<Smartphone size={40} strokeWidth={1.75} />} mensaje="Todavía no cargaste productos.">
          <Link href="/admin/productos/nuevo" className={botonPrimario}>
            <Plus size={16} strokeWidth={1.75} />
            Nuevo producto
          </Link>
        </EstadoVacio>
      )}

      {!loading && !error && productosAgrupados.length > 0 && (
        <div className={panel}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-tinta">
              <thead>
                <tr className={encabezadoTabla}>
                  <th scope="col" className={`${th} w-20`}>Foto</th>
                  <th scope="col" className={th}>Producto</th>
                  <th scope="col" className={th}>Modelo</th>
                  <th scope="col" className={th}>Stock</th>
                  <th scope="col" className={`${th} text-center`}>Destacado</th>
                  <th scope="col" className={`${th} text-right`}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosAgrupados.map((p) => {
                  const stockCalculado = p.variantes?.reduce((acc, v) => acc + v.stock, 0) || 0;
                  const destacado = featuredId === p.id;

                  return (
                    <Fragment key={p.id}>
                      <tr className={filaTabla}>
                        <td className={td}>
                          <div className="relative flex size-12 items-center justify-center overflow-hidden rounded-control bg-white">
                            {p.imagenes && p.imagenes.length > 0 ? (
                              <Image
                                src={p.imagenes[0]}
                                alt={p.nombre}
                                fill
                                className="object-cover"
                                unoptimized={true}
                              />
                            ) : (
                              <ImageIcon className="text-tinta-suave" size={20} strokeWidth={1.75} aria-label="Sin foto" />
                            )}
                          </div>
                        </td>
                        <td className={`${td} font-semibold`}>{p.nombre}</td>
                        <td className={`${td} text-tinta-suave`}>{p.modelo}</td>
                        <td className={td}>
                          <StockBadge stock={stockCalculado} />
                        </td>
                        <td className={`${td} text-center`}>
                          <button
                            onClick={() => toggleFeatured(p.id)}
                            aria-pressed={destacado}
                            aria-label={destacado ? `Quitar ${p.nombre} de destacados` : `Marcar ${p.nombre} como destacado`}
                            className={`${enlaceAccion} ${destacado ? "text-amber-500" : ""}`}
                          >
                            <Star size={18} strokeWidth={1.75} fill={destacado ? "currentColor" : "none"} />
                          </button>
                        </td>
                        <td className={td}>
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/admin/productos/${p.id}/variantes`}
                              className={`${botonTexto} !text-color-principal`}
                            >
                              Variantes
                            </Link>
                            <Link
                              href={`/admin/productos/${p.id}/editar`}
                              className={enlaceAccion}
                              aria-label={`Editar ${p.nombre}`}
                            >
                              <Edit3 size={16} strokeWidth={1.75} />
                            </Link>
                            <button
                              onClick={() => setDeletingId(p.id)}
                              className={`${enlaceAccion} hover:!text-destructive`}
                              aria-label={`Eliminar ${p.nombre}`}
                            >
                              <Trash2 size={16} strokeWidth={1.75} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {deletingId === p.id && (
                        <FilaConfirmarBorrado
                          nombre={p.nombre}
                          tipo="producto"
                          cantidadVariantes={p.variantes?.length ?? 0}
                          hrefVariantes={`/admin/productos/${p.id}/variantes`}
                          colSpan={6}
                          borrando={isDeleting}
                          onConfirmar={() => handleDelete(p.id)}
                          onCancelar={() => setDeletingId(null)}
                        />
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
