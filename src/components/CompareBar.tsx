import { useCompare } from "@/context/CompareContext";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

const MAX_COMPARE = 3;

export default function CompareBar() {
  const { compareList, clearCompare, setModoComparacion } = useCompare();
  const router = useRouter();

  if (compareList.length === 0) return null;

  const count = compareList.length;
  const canCompare = count >= 2;

  const cancelarSeleccion = () => {
    clearCompare();
    setModoComparacion(false);
  };

  return (
    <div
      className={`
        fixed inset-x-0 bottom-0 z-50
        md:left-1/2 md:inset-x-auto md:-translate-x-1/2
        bg-white shadow-xl
        rounded-t-2xl md:rounded-full
        px-4 py-3 md:px-6
        flex items-center gap-3
      `}
      style={{
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)",
        maxWidth: "min(720px, 92vw)", // límite lindo en desktop
      }}
    >
      {/* Izquierda: badge + texto corto en mobile */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="inline-flex items-center justify-center w-7 h-7 text-sm font-semibold bg-gray-100 text-gray-900 rounded-full">
          {count}
        </span>
        <div className="flex flex-col leading-tight min-w-0">
          <span className="text-sm text-[#333] truncate">
            Seleccionando modelos
          </span>

          {/* Mensajes contextuales */}
          {count === 1 && (
            <span className="text-xs text-red-600">Mínimo 2 para comparar</span>
          )}
          {count === MAX_COMPARE && (
            <span className="text-xs text-neutral-600">
              Máximo {MAX_COMPARE} modelos
            </span>
          )}
        </div>
      </div>

      {/* Centro: CTA (full-width en mobile, inline en md+) */}
      <div className="flex-1 md:flex-none">
        <button
          onClick={() => canCompare && router.push("/compare")}
          disabled={!canCompare}
          className={`
            w-full md:w-auto
            px-4 py-2 rounded-xl
            font-medium
            transition
            ${
              canCompare
                ? "bg-[#05467D] text-white hover:bg-[#0F3C64]"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          Ver comparación
        </button>
      </div>

      {/* Derecha: cancelar */}
      <button
        onClick={cancelarSeleccion}
        className="text-red-600 hover:text-red-800 transition text-sm flex items-center gap-1 shrink-0"
        title="Cancelar selección"
      >
        <X size={18} />
        <span className="hidden xs:inline">Cancelar</span>
      </button>
    </div>
  );
}
