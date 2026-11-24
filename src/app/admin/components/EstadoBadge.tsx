import { estadoClase, estadoLabel } from "@/lib/pedidos";

// Estado de un pedido como etiqueta. Colores y textos salen de lib/pedidos.ts, así que el
// admin y las pantallas del cliente muestran siempre lo mismo.
export default function EstadoBadge({ estado }: { estado: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${estadoClase(estado)}`}
    >
      {estadoLabel(estado)}
    </span>
  );
}
