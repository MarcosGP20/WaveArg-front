"use client";

import { useEffect, useState } from "react";
import { useRecargarAlVolver } from "@/hooks/useRecargarAlVolver";
import MetricCard from "./MetricCard";
import DataGrid, { type Column } from "./DataGrid";
import EstadoBadge from "./EstadoBadge";
import { AdminService, DashboardMetrics, PedidosService } from "@/lib/api";
import { formatearPrecio } from "@/lib/precio";
import { DollarSign, ShoppingCart, Users, Package, AlertCircle } from "lucide-react";

type PedidoRow = {
  id: string;
  cliente: string;
  producto: string;
  total: number;
  estado: string;
  fecha: string;
};

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function resumeItems(items: { nombreProducto: string; color: string; memoria: string; cantidad: number }[]) {
  if (!items?.length) return "—";
  const { nombreProducto, color, memoria, cantidad } = items[0];
  const variante = [color, memoria].filter(Boolean).join(" ");
  const label = variante ? `${nombreProducto} — ${variante}` : nombreProducto;
  const extra = items.length > 1 ? ` (+${items.length - 1} más)` : "";
  return `${label} x${cantidad}${extra}`;
}

// ============================================================
// SKELETON — se muestra mientras carga la API
// ============================================================
function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-36 rounded-panel bg-superficie" />
        ))}
      </div>
      <div className="h-64 rounded-panel bg-superficie" />
    </div>
  );
}

// ============================================================
// DASHBOARD PRINCIPAL
// ============================================================
export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [pedidosRows, setPedidosRows] = useState<PedidoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // El estado arranca en loading: la carga inicial no vuelve a prenderlo (setState en el efecto).
  function traer() {
    Promise.allSettled([
      AdminService.getDashboard(),
      PedidosService.getAll(),
    ]).then(([metricsResult, pedidosResult]) => {
      if (metricsResult.status === "fulfilled") {
        setMetrics(metricsResult.value);
      } else {
        const err = metricsResult.reason;
        setError(err instanceof Error ? err.message : String(err));
      }

      if (pedidosResult.status === "fulfilled") {
        const rows = [...pedidosResult.value]
          .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
          .slice(0, 8)
          .map((p) => ({
            id: `#${p.id}`,
            cliente: p.usuario.nombre ?? p.usuario.email,
            producto: resumeItems(p.items),
            total: p.total,
            estado: p.estado,
            fecha: formatFecha(p.fecha),
          }));
        setPedidosRows(rows);
      }

      setLoading(false);
    });
  }

  useEffect(() => {
    traer();
  }, []);

  useRecargarAlVolver(() => {
    setError(null);
    traer();
  });

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-3 text-destructive">
        <AlertCircle size={36} />
        <p className="text-sm font-medium text-center max-w-xs">{error}</p>
      </div>
    );
  }

  const orderColumns: Column<PedidoRow>[] = [
    { key: "id", label: "#" },
    { key: "cliente", label: "Cliente" },
    { key: "producto", label: "Producto" },
    {
      key: "total",
      label: "Total",
      align: "right",
      render: (value: number) => formatearPrecio(value),
    },
    {
      key: "estado",
      label: "Estado",
      render: (value: string) => <EstadoBadge estado={value} />,
    },
    { key: "fecha", label: "Fecha" },
  ];

  return (
    <div className="space-y-6">
      {/* ========== MÉTRICAS REALES ========== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Ventas Totales"
          value={formatearPrecio(metrics!.totalVentas)}
          icon={<DollarSign className="size-5" strokeWidth={1.75} />}
        />
        <MetricCard
          title="Pedidos Nuevos"
          value={metrics!.pedidosNuevos}
          icon={<ShoppingCart className="size-5" strokeWidth={1.75} />}
        />
        <MetricCard
          title="Usuarios Registrados"
          value={metrics!.usuariosRegistrados.toLocaleString("es-AR")}
          icon={<Users className="size-5" strokeWidth={1.75} />}
        />
        <MetricCard
          title="Stock Total"
          value={metrics!.stockTotal}
          icon={<Package className="size-5" strokeWidth={1.75} />}
        />
      </div>

      <DataGrid
        title="Pedidos Recientes"
        columns={orderColumns}
        data={pedidosRows}
        emptyMessage="Todavía no hay pedidos."
      />
    </div>
  );
}
