import Link from "next/link";
import { AlertTriangle, Loader2 } from "lucide-react";
import { botonPeligro, botonPrimario, botonTexto } from "./estilos";

// Etiqueta de stock de un producto o accesorio.
export function StockBadge({ stock }: { stock: number }) {
  const hay = stock > 0;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
        hay ? "bg-exito/10 text-exito" : "bg-destructive/10 text-destructive"
      }`}
    >
      {hay ? `${stock} unidades` : "Sin stock"}
    </span>
  );
}

// Fila que se abre debajo del ítem al tocar "eliminar": si tiene variantes guía al admin a
// borrarlas primero; si no, pide confirmar.
export function FilaConfirmarBorrado({
  nombre,
  tipo,
  cantidadVariantes,
  hrefVariantes,
  colSpan,
  borrando,
  onConfirmar,
  onCancelar,
}: {
  nombre: string;
  tipo: string;
  cantidadVariantes: number;
  hrefVariantes: string;
  colSpan: number;
  borrando: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}) {
  return (
    <tr className="border-t border-borde bg-white">
      <td colSpan={colSpan} className="px-4 py-3">
        {cantidadVariantes > 0 ? (
          <div className="flex flex-wrap items-center gap-3">
            <AlertTriangle size={16} strokeWidth={1.75} className="shrink-0 text-tinta-suave" />
            <p className="text-sm text-tinta">
              <span className="font-semibold">{nombre}</span> tiene {cantidadVariantes}{" "}
              {cantidadVariantes === 1 ? "variante" : "variantes"}. Eliminá primero las variantes
              para poder borrar el {tipo}.
            </p>
            <Link href={hrefVariantes} className={botonPrimario}>
              Ir a variantes
            </Link>
            <button onClick={onCancelar} className={botonTexto}>
              Cancelar
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-tinta">
              ¿Eliminar <span className="font-semibold">{nombre}</span>? Esta acción no se puede
              deshacer.
            </p>
            <button onClick={onConfirmar} disabled={borrando} className={botonPeligro}>
              {borrando && <Loader2 size={14} className="animate-spin" />}
              Sí, eliminar
            </button>
            <button onClick={onCancelar} disabled={borrando} className={botonTexto}>
              Cancelar
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
