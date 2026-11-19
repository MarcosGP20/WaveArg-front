"use client";

import { useEffect, useState } from "react";
import { PedidosService, Pedido, PedidoItem } from "@/lib/api";
import { ESTADOS_PEDIDO, estadoClase, estadoLabel, requiereAtencion } from "@/lib/pedidos";
import EstadoBadge from "../components/EstadoBadge";
import { CabeceraPagina, EstadoError, EstadoVacio, TablaSkeleton } from "../components/PaginaAdmin";
import { botonIcono, control, encabezadoTabla, filaTabla, panel, td, th } from "../components/estilos";
import { ClipboardList, ChevronDown, Loader2, RefreshCw } from "lucide-react";

// ================================================================
// HELPERS
// ================================================================
function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMonto(n: number | undefined | null) {
  if (n == null) return "-";
  return `$${n.toLocaleString("es-AR")}`;
}

// Extrae un resumen de los items del pedido
function resumeItems(items: PedidoItem[]): string {
  if (!items || items.length === 0) return "-";
  const first = items[0];
  // Filtramos color y memoria por si vienen null desde el backend
  const variante = [first.color, first.memoria].filter(Boolean).join(" ");
  const label = variante
    ? `${first.nombreProducto} — ${variante} x${first.cantidad}`
    : `${first.nombreProducto} x${first.cantidad}`;
  const extra = items.length > 1 ? ` (+${items.length - 1} más)` : "";
  return `${label}${extra}`;
}

// ================================================================
// SELECTOR DE ESTADO (dropdown inline con PATCH)
// Solo ofrece las transiciones que el backend permite para este pedido
// (ver WAVEARGDEFINITIVO/docs/pedidos-estados.md).
// ================================================================
function EstadoSelector({
  pedidoId,
  estadoActual,
  transiciones,
  onUpdated,
}: {
  pedidoId: number;
  estadoActual: string;
  transiciones: string[];
  onUpdated: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const nuevoEstado = e.target.value;
    if (nuevoEstado === estadoActual) return;
    setLoading(true);
    setError(null);
    try {
      await PedidosService.updateEstado(pedidoId, nuevoEstado);
      onUpdated();
    } catch (err: unknown) {
      setError(err instanceof Error ? err instanceof Error ? err.message : String(err) : "Error al actualizar");
    } finally {
      setLoading(false);
    }
  }

  // Sin transiciones manuales (p. ej. Vencido, Reembolsado): solo el badge.
  if (transiciones.length === 0) {
    return <EstadoBadge estado={estadoActual} />;
  }

  const opciones = [estadoActual, ...transiciones];

  return (
    <div className="flex flex-col gap-1">
      <div className="relative flex items-center">
        {loading ? (
          <Loader2 size={16} className="animate-spin text-color-principal" />
        ) : (
          <>
            <select
              value={estadoActual}
              onChange={handleChange}
              aria-label={`Estado del pedido ${pedidoId}`}
              className={`appearance-none pr-7 pl-2 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-color-principal/40 ${estadoClase(estadoActual)}`}
            >
              {opciones.map((e) => (
                <option key={e} value={e}>
                  {e === estadoActual ? estadoLabel(e) : `→ ${estadoLabel(e)}`}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-1.5 pointer-events-none opacity-60"
            />
          </>
        )}
      </div>
      {error && (
        <p className="max-w-[160px] text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}

// ================================================================
// PÁGINA PRINCIPAL
// ================================================================
export default function OrdersPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // El estado arranca en loading: la carga inicial no vuelve a prenderlo (setState en el efecto).
  function traerPedidos(estado?: string) {
    PedidosService.getAll(estado)
      .then((data) => {
        setPedidos(data);
      })
      .catch((err: Error) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }

  function cargarPedidos(estado?: string) {
    setLoading(true);
    setError(null);
    traerPedidos(estado);
  }

  useEffect(() => {
    traerPedidos(filtroEstado || undefined);
  }, [filtroEstado]);

  // Se recarga en vez de actualizar en el lugar: el cambio de estado modifica las
  // transiciones permitidas (y puede sacar el pedido del filtro actual).
  function handleEstadoUpdated() {
    cargarPedidos(filtroEstado || undefined);
  }

  const enRevision = pedidos.filter((p) => requiereAtencion(p.estado)).length;

  const recargar = () => cargarPedidos(filtroEstado || undefined);

  return (
    <div>
      <CabeceraPagina
        titulo="Pedidos"
        subtitulo={
          loading ? (
            "Cargando…"
          ) : (
            <>
              {pedidos.length} {pedidos.length === 1 ? "pedido" : "pedidos"}
              {enRevision > 0 && (
                <span className="ml-2 font-semibold text-orange-700">· {enRevision} para revisar</span>
              )}
            </>
          )
        }
      >
        <select
          value={filtroEstado}
          onChange={(e) => {
            setLoading(true);
            setError(null);
            setFiltroEstado(e.target.value);
          }}
          aria-label="Filtrar por estado"
          className={control}
        >
          <option value="">Todos los estados</option>
          {ESTADOS_PEDIDO.map((e) => (
            <option key={e} value={e}>
              {estadoLabel(e)}
            </option>
          ))}
        </select>

        <button onClick={recargar} disabled={loading} aria-label="Actualizar pedidos" className={botonIcono}>
          <RefreshCw size={16} strokeWidth={1.75} className={loading ? "animate-spin" : ""} />
        </button>
      </CabeceraPagina>

      {loading && <TablaSkeleton filas={6} />}

      {error && !loading && <EstadoError mensaje={error} onReintentar={recargar} />}

      {!loading && !error && pedidos.length === 0 && (
        <EstadoVacio
          icono={<ClipboardList size={40} strokeWidth={1.75} />}
          mensaje={
            filtroEstado
              ? `No hay pedidos con estado "${estadoLabel(filtroEstado)}".`
              : "Todavía no hay pedidos."
          }
        />
      )}

      {!loading && !error && pedidos.length > 0 && (
        <div className={panel}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-tinta">
              <thead>
                <tr className={encabezadoTabla}>
                  <th scope="col" className={th}>#</th>
                  <th scope="col" className={th}>Cliente</th>
                  <th scope="col" className={th}>Producto</th>
                  <th scope="col" className={`${th} text-right`}>Total</th>
                  <th scope="col" className={th}>Dirección</th>
                  <th scope="col" className={th}>Fecha</th>
                  <th scope="col" className={th}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr
                    key={pedido.id}
                    className={
                      requiereAtencion(pedido.estado)
                        ? "border-t border-borde bg-orange-50 transition-colors duration-300 ease-ola hover:bg-orange-100"
                        : filaTabla
                    }
                  >
                    <td className={`${td} font-mono text-tinta-suave`}>#{pedido.id}</td>
                    <td className={td}>
                      <p className="font-medium">{pedido.usuario?.nombre ?? "—"}</p>
                      <p className="text-xs text-tinta-suave">{pedido.usuario?.email ?? "—"}</p>
                    </td>
                    <td className={`${td} max-w-[220px] truncate text-tinta-suave`}>
                      {resumeItems(pedido.items)}
                    </td>
                    <td className={`${td} text-right font-semibold tabular-nums`}>
                      {formatMonto(pedido.total)}
                    </td>
                    <td className={`${td} text-tinta-suave`}>{pedido.direccionEnvio ?? "—"}</td>
                    <td className={`${td} whitespace-nowrap text-tinta-suave`}>{formatFecha(pedido.fecha)}</td>
                    <td className={td}>
                      <EstadoSelector
                        pedidoId={pedido.id}
                        estadoActual={pedido.estado}
                        transiciones={pedido.transicionesPermitidas ?? []}
                        onUpdated={handleEstadoUpdated}
                      />
                    </td>
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
