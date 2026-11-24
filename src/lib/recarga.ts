// Las pantallas del admin muestran lo que trajeron al cargar. Si el admin deja la pestaña y vuelve
// después de un rato, recargan solas para no mostrar pedidos, pagos o stock viejos.
export const MINUTOS_PARA_RECARGAR = 5;

export function tocaRecargar(ultimaCarga: number, ahora: number): boolean {
  return ahora - ultimaCarga >= MINUTOS_PARA_RECARGAR * 60_000;
}
