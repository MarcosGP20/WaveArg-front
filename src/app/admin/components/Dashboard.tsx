"use client";

import { useEffect, useState } from "react";
import MetricCard from "./MetridCard";
import DataGrid from "./DataGrid";
import { AdminService, DashboardMetrics } from "@/lib/api";
import { DollarSign, ShoppingCart, Users, Package, AlertCircle } from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AdminService.getDashboard()
      .then(setMetrics)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
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

  // ============================================================
  // CONFIGURACIÓN DE COLUMNAS (sin datos reales aún — se conecta en la Orders page)
  // ============================================================
  const orderColumns = [
    { key: "id", label: "ID" },
    { key: "clienteNombre", label: "Cliente" },
    { key: "productoDescripcion", label: "Producto" },
    {
      key: "monto",
      label: "Monto",
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: "estado",
      label: "Estado",
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === "Entregado"
              ? "bg-green-100 text-green-800"
              : value === "Enviado"
              ? "bg-blue-100 text-blue-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {value}
        </span>
      ),
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

      {/* ========== TABLA (se conectará con GET /Pedidos en el próximo paso) ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataGrid
          title="Pedidos Recientes"
          columns={orderColumns}
          data={[]}
        />
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center text-gray-400 gap-2 min-h-[12rem]">
          <Package size={32} className="text-gray-300" />
          <p className="text-sm">Próximamente: Productos más vendidos</p>
        </div>
      </div>
    </div>
  );
}
