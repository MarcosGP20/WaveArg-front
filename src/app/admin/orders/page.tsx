"use client";

import { useEffect, useState } from "react";
import { PedidosService, Pedido, PedidoItem } from "@/lib/api";
import {
  Package,
  AlertCircle,
  ChevronDown,
  Loader2,
  RefreshCw,
} from "lucide-react";

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

// Estado → colores (fallback genérico para estados desconocidos)
function estadoStyle(estado: string): string {
  const map: Record<string, string> = {
    procesando: "bg-yellow-100 text-yellow-800",
    pendiente: "bg-yellow-100 text-yellow-800",
    enviado: "bg-blue-100 text-blue-800",
    entregado: "bg-green-100 text-green-800",
    cancelado: "bg-red-100 text-red-800",
  };
  return map[estado.toLowerCase()] ?? "bg-gray-100 text-gray-700";
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
// SKELETON
// ================================================================
function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-2 mt-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-12 bg-gray-100 rounded-lg" />
      ))}
    </div>
  );
}

// ================================================================
// SELECTOR DE ESTADO (dropdown inline con PATCH)
// ================================================================
const ESTADOS_OPCIONES = [
  "procesando",
  "enviado",
  "entregado",
  "cancelado",
];

function EstadoSelector({
  pedidoId,
  estadoActual,
  onUpdated,
}: {
  pedidoId: number;
  estadoActual: string;
  onUpdated: (id: number, nuevoEstado: string) => void;
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
      onUpdated(pedidoId, nuevoEstado);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al actualizar");
    } finally {
      setLoading(false);
    }
  }

  // Si el estado actual no está en la lista, lo añadimos dinámicamente
  const opciones = ESTADOS_OPCIONES.includes(estadoActual.toLowerCase())
    ? ESTADOS_OPCIONES
    : [estadoActual, ...ESTADOS_OPCIONES];

  return (
    <div className="flex flex-col gap-1">
      <div className="relative flex items-center">
        {loading ? (
          <Loader2 size={16} className="animate-spin text-blue-500" />
        ) : (
          <>
            <select
              value={estadoActual}
              onChange={handleChange}
              className={`appearance-none pr-7 pl-2 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300 capitalize ${estadoStyle(estadoActual)}`}
            >
              {opciones.map((e) => (
                <option key={e} value={e}>
                  {e.charAt(0).toUpperCase() + e.slice(1)}
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
        <p className="text-[10px] text-red-500 max-w-[140px]">{error}</p>
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

  function cargarPedidos(estado?: string) {
    setLoading(true);
    setError(null);
    PedidosService.getAll(estado)
      .then((data) => {
        if (data.length > 0) {
          console.log("[Pedidos] Primer registro:", data[0]);
          console.log("[Pedidos] Items del primer pedido:", data[0].items);
          if (data[0].items?.length > 0) {
            console.log("[Pedidos] Primer item:", data[0].items[0]);
          }
        }
        setPedidos(data);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    cargarPedidos(filtroEstado || undefined);
  }, [filtroEstado]);

  // Actualización optimista
  function handleEstadoUpdated(id: number, nuevoEstado: string) {
    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p))
    );
  }

  return (
    <div className="my-8 px-2 md:px-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#05467d]">Pedidos</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {loading
              ? "Cargando..."
              : `${pedidos.length} pedido${pedidos.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 capitalize"
          >
            <option value="">Todos los estados</option>
            {ESTADOS_OPCIONES.map((e) => (
              <option key={e} value={e}>
                {e.charAt(0).toUpperCase() + e.slice(1)}
              </option>
            ))}
          </select>

          <button
            onClick={() => cargarPedidos(filtroEstado || undefined)}
            disabled={loading}
            title="Actualizar"
            className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center h-48 gap-3 text-red-500">
          <AlertCircle size={36} />
          <p className="text-sm font-medium text-center max-w-xs">{error}</p>
          <button
            onClick={() => cargarPedidos(filtroEstado || undefined)}
            className="text-xs underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* SKELETON */}
      {loading && <TableSkeleton />}

      {/* EMPTY */}
      {!loading && !error && pedidos.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
          <Package size={40} className="text-gray-300" />
          <p className="text-sm">
            {filtroEstado
              ? `No hay pedidos con estado "${filtroEstado}"`
              : "No hay pedidos todavía"}
          </p>
        </div>
      )}

      {/* TABLA */}
      {!loading && !error && pedidos.length > 0 && (
        <div className="bg-white shadow-sm rounded-xl overflow-x-auto border border-gray-100">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 uppercase text-xs leading-normal border-b border-gray-100">
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Cliente</th>
                <th className="py-3 px-4 text-left">Producto</th>
                <th className="py-3 px-4 text-left">Total</th>
                <th className="py-3 px-4 text-left">Dirección</th>
                <th className="py-3 px-4 text-left">Fecha</th>
                <th className="py-3 px-4 text-left">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pedidos.map((pedido) => (
                <tr key={pedido.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-gray-400">
                    #{pedido.id}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-800">
                      {pedido.usuario?.nombre ?? "—"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {pedido.usuario?.email ?? "—"}
                    </p>
                  </td>
                  <td className="py-3 px-4 text-gray-600 max-w-[200px] truncate">
                    {resumeItems(pedido.items)}
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-800">
                    {formatMonto(pedido.total)}
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">
                    {pedido.direccionEnvio ?? "—"}
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">
                    {formatFecha(pedido.fecha)}
                  </td>
                  <td className="py-3 px-4">
                    <EstadoSelector
                      pedidoId={pedido.id}
                      estadoActual={pedido.estado}
                      onUpdated={handleEstadoUpdated}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
