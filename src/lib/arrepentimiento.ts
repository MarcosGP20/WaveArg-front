// Botón de arrepentimiento (Res. 424/2020): registra la solicitud en el back, que devuelve el
// código que la identifica (y se lo manda por mail a la persona).
import { fetchFromApi } from "@/lib/api";
import type { ArrepentimientoFormValues } from "@/schemas/arrepentimiento.schema";

export async function solicitarArrepentimiento(valores: ArrepentimientoFormValues): Promise<string> {
  const { codigo } = await fetchFromApi<{ codigo: string }>("/Arrepentimientos", {
    method: "POST",
    body: JSON.stringify({
      nombre: valores.nombre.trim(),
      email: valores.email.trim(),
      numeroPedido: valores.numeroPedido.trim() || null,
      detalle: valores.detalle.trim() || null,
    }),
  });
  return codigo;
}
