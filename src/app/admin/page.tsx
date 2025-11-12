"use client";

import {
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { useEffect, useState } from "react";
import Dashboard from "@/components/admin/Dashboard";

const statsData = [
  {
    icon: <DollarSign className="text-green-600" />,
    label: "Ingresos",
    value: 125000,
    prefix: "$",
    color: "bg-green-50",
    trend: "+12%",
    trendColor: "text-green-600",
    desc: "vs mes anterior",
  },
  {
    icon: <ShoppingCart className="text-blue-600" />,
    label: "Pedidos",
    value: 143,
    color: "bg-blue-50",
    trend: "+8%",
    trendColor: "text-blue-600",
    desc: "vs mes anterior",
  },
  {
    icon: <Package className="text-yellow-600" />,
    label: "Productos",
    value: 42,
    color: "bg-yellow-50",
    trend: "+2",
    trendColor: "text-yellow-600",
    desc: "nuevos este mes",
  },
  {
    icon: <Users className="text-purple-600" />,
    label: "Usuarios",
    value: 58,
    color: "bg-purple-50",
    trend: "+5",
    trendColor: "text-purple-600",
    desc: "nuevos este mes",
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
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {" "}
        Admin Dashboard{" "}
      </h1>
      <Dashboard />
    </div>
  );
}
