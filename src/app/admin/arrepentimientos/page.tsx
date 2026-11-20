"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Undo2 } from "lucide-react";
import { ArrepentimientosService, type ArrepentimientoAdmin } from "@/lib/api";
import { CabeceraPagina, EstadoError, EstadoVacio, TablaSkeleton } from "../components/PaginaAdmin";
import { botonIcono, encabezadoTabla, filaTabla, panel, td, th } from "../components/estilos";

function formatFecha(iso: string) {
  return new Date(iso).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Solicitudes del botón de arrepentimiento (POST /Arrepentimientos). Cada una llega también por
// mail (Alertas__EmailAdmin); acá quedan aunque el mail no haya salido.
export default function ArrepentimientosPage() {
  const [solicitudes, setSolicitudes] = useState<ArrepentimientoAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // El estado arranca en loading: la carga inicial no vuelve a prenderlo (setState en el efecto).
  function traer() {
    ArrepentimientosService.getAll()
      .then(setSolicitudes)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }

  function recargar() {
    setLoading(true);
    setError(null);
    traer();
  }

  useEffect(() => {
    traer();
  }, []);

  return (
    <div>
      <CabeceraPagina
        titulo="Arrepentimientos"
        subtitulo={
          loading ? "Cargando…" : `${solicitudes.length} ${solicitudes.length === 1 ? "solicitud" : "solicitudes"}`
        }
      >
        <button onClick={recargar} disabled={loading} aria-label="Actualizar solicitudes" className={botonIcono}>
          <RefreshCw size={16} strokeWidth={1.75} className={loading ? "animate-spin" : ""} />
        </button>
      </CabeceraPagina>

      {loading && <TablaSkeleton />}

      {error && !loading && <EstadoError mensaje={error} onReintentar={recargar} />}

      {!loading && !error && solicitudes.length === 0 && (
        <EstadoVacio icono={<Undo2 size={40} strokeWidth={1.75} />} mensaje="No hay solicitudes de arrepentimiento." />
      )}

      {!loading && !error && solicitudes.length > 0 && (
        <div className={panel}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-tinta">
              <thead>
                <tr className={encabezadoTabla}>
                  <th scope="col" className={th}>Código</th>
                  <th scope="col" className={th}>Cliente</th>
                  <th scope="col" className={th}>Pedido</th>
                  <th scope="col" className={th}>Detalle</th>
                  <th scope="col" className={th}>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((s) => (
                  <tr key={s.id} className={filaTabla}>
                    <td className={`${td} font-mono`}>{s.codigo}</td>
                    <td className={td}>
                      <p className="font-medium">{s.nombre}</p>
                      <a href={`mailto:${s.email}?subject=${encodeURIComponent(`Tu arrepentimiento ${s.codigo}`)}`} className="text-xs text-tinta-suave underline underline-offset-4">
                        {s.email}
                      </a>
                    </td>
                    <td className={`${td} font-mono text-tinta-suave`}>{s.numeroPedido ?? "—"}</td>
                    <td className={`${td} max-w-xs text-tinta-suave`}>{s.detalle ?? "—"}</td>
                    <td className={`${td} whitespace-nowrap text-tinta-suave`}>{formatFecha(s.creadoEn)}</td>
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
