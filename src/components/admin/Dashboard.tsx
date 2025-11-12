import MetricCard from "./MetridCard";
import DataGrid from "./DataGrid";
import {
  dashboardMetrics,
  topProducts,
  recentOrders,
} from "../../app/admin/lib/mockData";
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";
export default function Dashboard() {
  // ============================================
  // CONFIGURACIÓN DE COLUMNAS PARA PEDIDOS
  // ============================================
  const orderColumns = [
    { key: "id", label: "ID" },
    { key: "customer", label: "Cliente" },
    { key: "product", label: "Producto" },
    {
      key: "amount",
      label: "Monto",
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: "status",
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
    { key: "date", label: "Fecha" },
  ];

  // ============================================
  // CONFIGURACIÓN DE COLUMNAS PARA PRODUCTOS
  // ============================================
  const productColumns = [
    { key: "name", label: "Producto" },
    { key: "sales", label: "Ventas" },
    {
      key: "revenue",
      label: "Ingresos",
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    { key: "stock", label: "Stock" },
  ];

  // ============================================
  // RENDER DEL DASHBOARD
  // ============================================
  return (
    <div className="space-y-6">
      {/* ========== SECCIÓN 1: MÉTRICAS ========== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Ventas Totales"
          value={`$${dashboardMetrics.totalSales.toLocaleString()}`}
          icon={<DollarSign className="w-6 h-6 text-blue-600" />}
          change={12.5}
          changeType="increase"
        />
        <MetricCard
          title="Pedidos Nuevos"
          value={dashboardMetrics.newOrders}
          icon={<ShoppingCart className="w-6 h-6 text-blue-600" />}
          change={8.2}
          changeType="increase"
        />
        <MetricCard
          title="Usuarios Registrados"
          value={dashboardMetrics.registeredUsers.toLocaleString()}
          icon={<Users className="w-6 h-6 text-blue-600" />}
          change={15.3}
          changeType="increase"
        />
        <MetricCard
          title="Stock Total"
          value={dashboardMetrics.totalStock}
          icon={<Package className="w-6 h-6 text-blue-600" />}
          change={3.1}
          changeType="decrease"
        />
      </div>

      {/* ========== SECCIÓN 2: TABLAS ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataGrid
          title="Pedidos Recientes"
          columns={orderColumns}
          data={recentOrders}
        />
        <DataGrid
          title="Productos Más Vendidos"
          columns={productColumns}
          data={topProducts}
        />
      </div>
    </div>
  );
}
