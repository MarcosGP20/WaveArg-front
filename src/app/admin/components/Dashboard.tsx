"use client";

import { useEffect, useState } from "react";
import MetricCard from "./MetridCard";
import DataGrid from "./DataGrid";
import { AdminService, DashboardMetrics, PedidosService } from "@/lib/api";
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
          <div key={i} className="bg-white rounded-lg shadow p-6 h-28" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow h-48" />
        <div className="bg-white rounded-lg shadow h-48" />
      </div>
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

  useEffect(() => {
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
  }, []);

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-3 text-red-600">
        <AlertCircle size={36} />
        <p className="text-sm font-medium text-center max-w-xs">{error}</p>
      </div>
    );
  }

  const orderColumns = [
    { key: "id", label: "#" },
    { key: "cliente", label: "Cliente" },
    { key: "producto", label: "Producto" },
    {
      key: "total",
      label: "Total",
      render: (value: number) => `$${value.toLocaleString("es-AR")}`,
    },
    {
      key: "estado",
      label: "Estado",
      render: (value: string) => {
        const map: Record<string, string> = {
          entregado: "bg-green-100 text-green-800",
          enviado: "bg-blue-100 text-blue-800",
          cancelado: "bg-red-100 text-red-800",
        };
        const style = map[value?.toLowerCase()] ?? "bg-yellow-100 text-yellow-800";
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${style}`}>
            {value}
          </span>
        );
      },
    },
    { key: "fecha", label: "Fecha" },
  ];

  return (
    <div className="space-y-6">
      {/* ========== MÉTRICAS REALES ========== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Ventas Totales"
          value={`$${metrics!.totalVentas.toLocaleString()}`}
          icon={<DollarSign className="w-6 h-6 text-blue-600" />}
        />
        <MetricCard
          title="Pedidos Nuevos"
          value={metrics!.pedidosNuevos}
          icon={<ShoppingCart className="w-6 h-6 text-blue-600" />}
        />
        <MetricCard
          title="Usuarios Registrados"
          value={metrics!.usuariosRegistrados.toLocaleString()}
          icon={<Users className="w-6 h-6 text-blue-600" />}
        />
        <MetricCard
          title="Stock Total"
          value={metrics!.stockTotal}
          icon={<Package className="w-6 h-6 text-blue-600" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataGrid
          title="Pedidos Recientes"
          columns={orderColumns}
          data={pedidosRows}
        />
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center text-gray-500 gap-2 min-h-[12rem]">
          <Package size={32} className="text-gray-300" />
          <p className="text-sm">Próximamente: Productos más vendidos</p>
        </div>
      </div>
    </div>
  );
}
