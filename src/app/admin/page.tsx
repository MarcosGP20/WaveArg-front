"use client"

import { ShoppingCart, Users, Package, TrendingUp, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";


const statsData = [
  {
    icon: <DollarSign className="text-green-600" />, label: "Ingresos", value: 125000, prefix: "$", color: "bg-green-50", trend: "+12%", trendColor: "text-green-600", desc: "vs mes anterior"
  },
  {
    icon: <ShoppingCart className="text-blue-600" />, label: "Pedidos", value: 143, color: "bg-blue-50", trend: "+8%", trendColor: "text-blue-600", desc: "vs mes anterior"
  },
  {
    icon: <Package className="text-yellow-600" />, label: "Productos", value: 42, color: "bg-yellow-50", trend: "+2", trendColor: "text-yellow-600", desc: "nuevos este mes"
  },
  {
    icon: <Users className="text-purple-600" />, label: "Usuarios", value: 58, color: "bg-purple-50", trend: "+5", trendColor: "text-purple-600", desc: "nuevos este mes"
  },
];

function useCountUp(target: number, duration = 1000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    let raf: number;
    function animate() {
      start += increment;
      if (start < target) {
        setCount(Math.floor(start));
        raf = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    }
    animate();
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return count;
}

export default function AdminPage() {
  return (
    <div className="my-12 px-2 md:px-8">
      <h1 className="text-4xl font-extrabold mb-10 tracking-tight text-gray-900">Dashboard de Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {statsData.map((stat, i) => {
          const count = useCountUp(stat.value, 900 + i * 200);
          return (
            <div
              key={stat.label}
              className={`relative bg-gradient-to-br from-white to-gray-50 p-7 rounded-2xl border border-gray-100 shadow-xl hover:scale-[1.03] hover:shadow-2xl transition-all flex flex-col gap-3 group overflow-hidden min-h-[160px]`}
            >
              <div className={`absolute right-2 top-2 opacity-10 text-8xl pointer-events-none select-none`}> <TrendingUp className="w-24 h-24" /> </div>
              <div className={`w-fit ${stat.color} p-3 rounded-full mb-2 shadow-sm`}>{stat.icon}</div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">{stat.label}</p>
              <div className="flex items-end gap-2">
                <p className="text-4xl font-extrabold text-gray-900 drop-shadow-sm">
                  {stat.prefix || ''}{count.toLocaleString()}
                </p>
                <span className={`text-xs font-bold ${stat.trendColor}`}>{stat.trend}</span>
              </div>
              <p className="text-xs text-gray-400 font-medium">{stat.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Ejemplo de gráfico de barras (mock) */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-10">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Ventas del último mes</h2>
        <div className="flex items-end gap-2 h-32">
          {[12, 18, 10, 22, 30, 25, 28, 20, 15, 18, 24, 32, 29, 27, 22, 19, 15, 20, 23, 28, 30, 32, 29, 25, 20, 18, 15, 12, 10, 8].map((v, idx) => (
            <div key={idx} className="flex flex-col items-center justify-end">
              <div className="w-2 md:w-3 rounded bg-blue-500" style={{ height: `${v * 3}px` }}></div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>1</span>
          <span>15</span>
          <span>30</span>
        </div>
      </div>

      {/* Ejemplo de tabla de últimas transacciones (mock) */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Últimas transacciones</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 text-xs uppercase border-b">
              <th className="py-2">ID</th>
              <th className="py-2">Cliente</th>
              <th className="py-2">Monto</th>
              <th className="py-2">Estado</th>
              <th className="py-2">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: "#1001", cliente: "Juan Pérez", monto: "$1,200", estado: "Pagado", fecha: "01/07/2025" },
              { id: "#1000", cliente: "Ana López", monto: "$900", estado: "Pendiente", fecha: "30/06/2025" },
              { id: "#0999", cliente: "Carlos Ruiz", monto: "$1,500", estado: "Pagado", fecha: "29/06/2025" },
              { id: "#0998", cliente: "María Gómez", monto: "$800", estado: "Cancelado", fecha: "28/06/2025" },
            ].map((row) => (
              <tr key={row.id} className="border-b last:border-0">
                <td className="py-2 font-mono text-xs">{row.id}</td>
                <td className="py-2">{row.cliente}</td>
                <td className="py-2">{row.monto}</td>
                <td className="py-2">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${row.estado === "Pagado" ? "bg-green-100 text-green-700" : row.estado === "Pendiente" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{row.estado}</span>
                </td>
                <td className="py-2 text-xs text-gray-500">{row.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
