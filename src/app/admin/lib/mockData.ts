// Estas son las 4 métricas principales que pediste
export const dashboardMetrics = {
  totalSales: 145230, // Total de ventas en $
  newOrders: 23, // Pedidos nuevos
  registeredUsers: 1547, // Usuarios registrados
  totalStock: 342, // Stock total de productos
};

// Pedidos recientes para mostrar en tabla
export const recentOrders = [
  {
    id: "ORD-001",
    customer: "Juan Pérez",
    product: "iPhone 15 Pro Max",
    amount: 1299,
    status: "Pendiente",
    date: "2024-11-10",
  },
  // ... más pedidos
];

export const topProducts = [
  {
    id: "PROD-001",
    name: "iPhone 15 Pro Max",
    category: "Smartphones",
    sales: 320,
    revenue: 415680,
    stock: 25,
  },
  // ... más productos
];
