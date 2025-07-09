import { useCompare } from "@/context/CompareContext";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export default function CompareBar() {
  const { compareList, clearCompare, setModoComparacion } = useCompare();
  const router = useRouter();

  if (compareList.length === 0) return null;

  const cancelarSeleccion = () => {
    clearCompare();
    setModoComparacion(false);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white shadow-xl px-6 py-3 rounded-full z-50 flex items-center gap-4">
      <span className="text-sm text-[#333]">
        Seleccionando modelos ({compareList.length})
      </span>

      {compareList.length >= 2 && (
        <button
          onClick={() => router.push("/compare")}
          className="bg-[#05467D] text-white px-4 py-2 rounded hover:bg-[#0F3C64] transition"
        >
          Ver comparación
        </button>
      )}

      <button
        onClick={cancelarSeleccion}
        className="text-red-600 hover:text-red-800 transition text-sm flex items-center gap-1"
        title="Cancelar selección"
      >
        <X size={18} />
        Cancelar selección
      </button>
    </div>
  );
}
