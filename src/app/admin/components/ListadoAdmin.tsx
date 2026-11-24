"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useRecargarAlVolver } from "@/hooks/useRecargarAlVolver";
import { CabeceraPagina, EstadoError, EstadoVacio, TablaSkeleton } from "./PaginaAdmin";
import { botonIcono, encabezadoTabla, filaTabla, panel, th } from "./estilos";

// Pantalla de solo lectura del admin: trae una lista del back y la muestra en una tabla, con
// carga, error con reintento, vacío y botón de actualizar. Cada pantalla pone sus columnas.
export function ListadoAdmin<T extends { id: number }>({
  titulo,
  cargar,
  contar,
  etiquetaActualizar,
  vacio,
  columnas,
  celdas,
}: {
  titulo: string;
  /** Estable (definida fuera del componente): si cambia, vuelve a cargar. */
  cargar: () => Promise<T[]>;
  contar: (cantidad: number) => string;
  etiquetaActualizar: string;
  vacio: { icono: React.ReactNode; mensaje: string };
  columnas: string[];
  celdas: (item: T) => React.ReactNode;
}) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // El estado arranca en loading: la carga inicial no vuelve a prenderlo (setState en el efecto).
  const traer = useCallback(
    () =>
      cargar()
        .then(setItems)
        .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
        .finally(() => setLoading(false)),
    [cargar],
  );

  function recargar() {
    setLoading(true);
    setError(null);
    traer();
  }

  useEffect(() => {
    traer();
  }, [traer]);

  useRecargarAlVolver(() => {
    setError(null);
    traer();
  });

  return (
    <div>
      <CabeceraPagina titulo={titulo} subtitulo={loading ? "Cargando…" : contar(items.length)}>
        <button onClick={recargar} disabled={loading} aria-label={etiquetaActualizar} className={botonIcono}>
          <RefreshCw size={16} strokeWidth={1.75} className={loading ? "animate-spin" : ""} />
        </button>
      </CabeceraPagina>

      {loading && <TablaSkeleton />}

      {error && !loading && <EstadoError mensaje={error} onReintentar={recargar} />}

      {!loading && !error && items.length === 0 && <EstadoVacio icono={vacio.icono} mensaje={vacio.mensaje} />}

      {!loading && !error && items.length > 0 && (
        <div className={panel}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-tinta">
              <thead>
                <tr className={encabezadoTabla}>
                  {columnas.map((columna) => (
                    <th key={columna} scope="col" className={th}>
                      {columna}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className={filaTabla}>
                    {celdas(item)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
