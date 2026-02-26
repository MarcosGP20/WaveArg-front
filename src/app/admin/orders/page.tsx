import { Package } from "lucide-react";

export default function OrdersPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center gap-4">
      <div className="p-5 bg-blue-50 rounded-2xl">
        <Package size={48} className="text-[#05467d]" />
      </div>
      <h1 className="text-2xl font-bold text-gray-800">Pedidos</h1>
      <p className="text-gray-500 max-w-sm">
        Este módulo está en construcción. Próximamente podrás gestionar todos
        los pedidos desde acá.
      </p>
      <span className="text-xs font-semibold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
        Próximamente
      </span>
    </div>
  );
}
