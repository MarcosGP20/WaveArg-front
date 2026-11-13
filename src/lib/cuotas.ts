import { formatearPrecio } from "@/lib/precio";

/**
 * Cuotas sin interés que Wave ofrece con Mercado Pago. PENDIENTE del cliente (DESIGN.md): hasta
 * que confirme el número queda en null y el sitio no promete ninguna cifra. Con un número (por
 * ejemplo 6), las tarjetas de la home muestran el valor de cada cuota calculado sobre el precio real.
 */
export const CUOTAS_SIN_INTERES: number | null = null;

/** La línea de cuotas que va debajo del precio. */
export function textoCuotas(precio: number, cuotas: number | null = CUOTAS_SIN_INTERES): string {
  if (!cuotas || cuotas < 2 || precio <= 0) return "En cuotas con Mercado Pago";
  return `${cuotas} cuotas sin interés de ${formatearPrecio(Math.round(precio / cuotas))}`;
}
