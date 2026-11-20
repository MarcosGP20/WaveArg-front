"use client";

import { useEffect, useState } from "react";
import { BellRing, RefreshCw } from "lucide-react";
import { LeadsService, type LeadAdmin } from "@/lib/api";
import { linkWhatsAppA } from "@/lib/whatsapp";
import { CabeceraPagina, EstadoError, EstadoVacio, TablaSkeleton } from "../components/PaginaAdmin";
import { botonIcono, encabezadoTabla, filaTabla, panel, td, th } from "../components/estilos";

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

// Avisos de stock que dejan en el formulario de la home (POST /Leads): a quién escribirle cuando
// entra el modelo que busca.
export default function AvisosPage() {
  const [avisos, setAvisos] = useState<LeadAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // El estado arranca en loading: la carga inicial no vuelve a prenderlo (setState en el efecto).
  function traer() {
    LeadsService.getAll()
      .then(setAvisos)
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
        titulo="Avisos de stock"
        subtitulo={loading ? "Cargando…" : `${avisos.length} ${avisos.length === 1 ? "contacto" : "contactos"}`}
      >
        <button onClick={recargar} disabled={loading} aria-label="Actualizar avisos" className={botonIcono}>
          <RefreshCw size={16} strokeWidth={1.75} className={loading ? "animate-spin" : ""} />
        </button>
      </CabeceraPagina>

      {loading && <TablaSkeleton />}

      {error && !loading && <EstadoError mensaje={error} onReintentar={recargar} />}

      {!loading && !error && avisos.length === 0 && (
        <EstadoVacio icono={<BellRing size={40} strokeWidth={1.75} />} mensaje="Todavía nadie pidió un aviso de stock." />
      )}

      {!loading && !error && avisos.length > 0 && (
        <div className={panel}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-tinta">
              <thead>
                <tr className={encabezadoTabla}>
                  <th scope="col" className={th}>Email</th>
                  <th scope="col" className={th}>Busca</th>
                  <th scope="col" className={th}>WhatsApp</th>
                  <th scope="col" className={th}>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {avisos.map((aviso) => (
                  <tr key={aviso.id} className={filaTabla}>
                    <td className={td}>
                      <a href={`mailto:${aviso.email}`} className="underline underline-offset-4">
                        {aviso.email}
                      </a>
                    </td>
                    <td className={td}>{aviso.modelo ?? "—"}</td>
                    <td className={`${td} text-tinta-suave`}>
                      {aviso.whatsapp ? (
                        <a href={linkWhatsAppA(aviso.whatsapp)} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                          {aviso.whatsapp}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className={`${td} whitespace-nowrap text-tinta-suave`}>{formatFecha(aviso.creadoEn)}</td>
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
