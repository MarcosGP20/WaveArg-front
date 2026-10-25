// Precio en pesos con el formato que se ve en el sitio: "$1.200.000".
export function formatearPrecio(valor: number): string {
  return `$${valor.toLocaleString("es-AR")}`;
}
