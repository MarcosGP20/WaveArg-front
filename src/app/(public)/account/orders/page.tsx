"use client";

import { useEffect, useState } from "react";
import { PedidosService, Pedido, PedidoItem } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  AlertCircle,
  ArrowLeft,
  Package,
} from "lucide-react";
import Link from "next/link";

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
  if (n == null) return "—";
  return `$${n.toLocaleString("es-AR")}`;
}

function resumeItems(items: PedidoItem[]): string {
  if (!items || items.length === 0) return "—";
  const first = items[0];
  const variante = [first.color, first.memoria].filter(Boolean).join(" ");
  const label = variante
    ? `${first.nombreProducto} — ${variante}`
    : first.nombreProducto;
  const extra = items.length > 1 ? ` (+${items.length - 1} más)` : "";
  return `${label} x${first.cantidad}${extra}`;
}

function EstadoBadge({ estado }: { estado: string }) {
  const map: Record<string, string> = {
    procesando: "bg-yellow-100 text-yellow-800",
    pendiente: "bg-yellow-100 text-yellow-800",
    enviado: "bg-blue-100 text-blue-800",
    entregado: "bg-green-100 text-green-800",
    cancelado: "bg-red-100 text-red-800",
  };
  const style = map[estado.toLowerCase()] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${style}`}>
      {estado}
    </span>
  );
}

// ================================================================
// SKELETON
// ================================================================
function CardSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-24 bg-gray-100 rounded-2xl" />
      ))}
    </div>
  );
}

// ================================================================
// PÁGINA
// ================================================================
export default function MisPedidosPage() {
  const { token, user } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!token || !user) {
      router.replace("/login");
      return;
    }
    PedidosService.getMisPedidos()
      .then(setPedidos)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [mounted, token, user, router]);

  if (!mounted || !token || !user) return null;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* BACK */}
      <Link
        href="/account"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition mb-6"
      >
        <ArrowLeft size={16} />
        Volver a mi cuenta
      </Link>

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-50 rounded-xl">
          <ShoppingBag className="text-green-600" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis pedidos</h1>
          {!loading && !error && (
            <p className="text-sm text-gray-500">
              {pedidos.length} pedido{pedidos.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      {/* SKELETON */}
      {loading && <CardSkeleton />}

      {/* ERROR */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center h-48 gap-3 text-red-500">
          <AlertCircle size={36} />
          <p className="text-sm font-medium text-center max-w-xs">{error}</p>
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && pedidos.length === 0 && (
        <div className="flex flex-col items-center justify-center h-56 gap-4 text-gray-400">
          <Package size={48} className="text-gray-200" />
          <div className="text-center">
            <p className="font-medium text-gray-600">Todavía no tenés pedidos</p>
            <p className="text-sm mt-1">Cuando realices una compra, la verás acá.</p>
          </div>
          <Link
            href="/products"
            className="mt-2 px-5 py-2 bg-color-principal text-white text-sm font-medium rounded-full hover:bg-[#043a6a] transition"
          >
            Ver productos
          </Link>
        </div>
      )}

      {/* LISTA DE PEDIDOS */}
      {!loading && !error && pedidos.length > 0 && (
        <div className="space-y-3">
          {pedidos.map((pedido) => (
            <div
              key={pedido.id}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Info principal */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-gray-400">
                      #{pedido.id}
                    </span>
                    <EstadoBadge estado={pedido.estado} />
                  </div>
                  <p className="font-medium text-gray-800 truncate">
                    {resumeItems(pedido.items)}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatFecha(pedido.fecha)}
                    {pedido.direccionEnvio && ` · ${pedido.direccionEnvio}`}
                  </p>
                </div>

                {/* Monto */}
                <div className="shrink-0 text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {formatMonto(pedido.total)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {pedido.items?.length ?? 0} producto
                    {(pedido.items?.length ?? 0) !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
