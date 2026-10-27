// Nombre accesible del botón del carrito, que visualmente es un ícono con un badge.
export function etiquetaBotonCarrito(cantidad: number): string {
  if (cantidad === 0) return "Abrir carrito, vacío";
  return `Abrir carrito, ${cantidad} ${cantidad === 1 ? "producto" : "productos"}`;
}
