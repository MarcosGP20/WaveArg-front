// Botón de arrepentimiento (Res. 424/2020): registra la solicitud en el back, que devuelve el
// código que la identifica (y se lo manda por mail a la persona).
import { fetchFromApi } from "@/lib/api";
import type { ArrepentimientoFormValues } from "@/schemas/arrepentimiento.schema";

/** Lo que se le manda al back. */
export interface ArrepentimientoDTO {
  nombre: string;
  email: string;
  numeroPedido: string | null;
  detalle: string | null;
}

export function arrepentimientoDesdeFormulario(valores: ArrepentimientoFormValues): ArrepentimientoDTO {
  return {
    nombre: valores.nombre.trim(),
    email: valores.email.trim(),
    numeroPedido: valores.numeroPedido.trim() || null,
    detalle: valores.detalle.trim() || null,
  };
}

export async function solicitarArrepentimiento(valores: ArrepentimientoFormValues): Promise<string> {
  const { codigo } = await fetchFromApi<{ codigo: string }>("/Arrepentimientos", {
    method: "POST",
    body: JSON.stringify(arrepentimientoDesdeFormulario(valores)),
  });
  return codigo;
}
