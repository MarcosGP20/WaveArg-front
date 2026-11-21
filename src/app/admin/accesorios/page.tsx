"use client";

import { Fragment, useEffect, useState, useCallback } from "react";
import { AccesoriosService, Accesorio } from "@/lib/api";
import { agruparPorModelo } from "@/lib/inventario";
import Link from "next/link";
import Image from "next/image";
import { Plus, Trash2, Edit3, Image as ImageIcon, Headphones } from "lucide-react";
import { toast } from "sonner";
import { useRecargarAlVolver } from "@/hooks/useRecargarAlVolver";
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

export default function InventarioPage() {
  const [accesorios, setAccesorios] = useState<Accesorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // El estado arranca en loading: la carga inicial no vuelve a prenderlo (setState en el efecto).
  const traerAccesorios = useCallback(
    () =>
      AccesoriosService.getAll()
        .then(setAccesorios)
        .catch((err: unknown) =>
          setError(err instanceof Error ? err.message : String(err) ?? "No se pudo cargar el inventario."),
        )
        .finally(() => setLoading(false)),
    [],
  );

  const cargarAccesorios = useCallback(async () => {
    setLoading(true);
    setError(null);
    await traerAccesorios();
  }, [traerAccesorios]);

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    try {
      await AccesoriosService.delete(id);
      toast.success("Accesorio eliminado correctamente");
      setDeletingId(null);
      await cargarAccesorios();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : String(err) ?? "Error al eliminar el accesorio");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    traerAccesorios();
  }, [traerAccesorios]);

  useRecargarAlVolver(() => {
    setError(null);
    traerAccesorios();
  });

  const accesoriosAgrupados = agruparPorModelo(accesorios);

  return (
    <div>
      <CabeceraPagina
        titulo="Accesorios"
        subtitulo={
          loading || error
            ? undefined
            : `${accesoriosAgrupados.length} ${accesoriosAgrupados.length === 1 ? "accesorio" : "accesorios"}`
        }
      >
        <Link href="/admin/accesorios/nuevo" className={botonPrimario}>
          <Plus size={16} strokeWidth={1.75} />
          Nuevo accesorio
        </Link>
      </CabeceraPagina>

      {loading && <TablaSkeleton />}

      {error && !loading && (
        <EstadoError mensaje={`No se pudo cargar el inventario. ${error}`} onReintentar={cargarAccesorios} />
      )}

      {!loading && !error && accesoriosAgrupados.length === 0 && (
        <EstadoVacio icono={<Headphones size={40} strokeWidth={1.75} />} mensaje="Todavía no cargaste accesorios.">
          <Link href="/admin/accesorios/nuevo" className={botonPrimario}>
            <Plus size={16} strokeWidth={1.75} />
            Nuevo accesorio
          </Link>
        </EstadoVacio>
      )}

      {!loading && !error && accesoriosAgrupados.length > 0 && (
        <div className={panel}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-tinta">
              <thead>
                <tr className={encabezadoTabla}>
                  <th scope="col" className={`${th} w-20`}>Foto</th>
                  <th scope="col" className={th}>Accesorio</th>
                  <th scope="col" className={th}>Modelo</th>
                  <th scope="col" className={th}>Stock</th>
                  <th scope="col" className={`${th} text-right`}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {accesoriosAgrupados.map((p) => {
                  const stockCalculado = p.variantes?.reduce((acc, v) => acc + v.stock, 0) || 0;

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
                        <td className={td}>
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/admin/accesorios/${p.id}/variantes`}
                              className={`${botonTexto} !text-color-principal`}
                            >
                              Variantes
                            </Link>
                            <Link
                              href={`/admin/accesorios/${p.id}/editar`}
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
                          tipo="accesorio"
                          cantidadVariantes={p.variantes?.length ?? 0}
                          hrefVariantes={`/admin/accesorios/${p.id}/variantes`}
                          colSpan={5}
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
