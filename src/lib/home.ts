// Datos del parte de stock de la home (identidad "Parte de olas", DESIGN.md).
import type { Producto, Variante } from "@/interfaces/producto";

/** La variante más barata con stock, o null si no queda ninguna. */
export function varianteMasBarata(producto: Producto): Variante | null {
  const conStock = producto.variantes?.filter((v) => v.stock > 0) ?? [];
  if (conStock.length === 0) return null;
  return conStock.reduce((min, v) => (v.precio < min.precio ? v : min));
}

/**
 * Unidades que se pueden vender: la suma del stock de las variantes. No se usa stockTotal del
 * back porque puede no coincidir (un iPhone con 20 unidades en su variante venía con 0).
 */
export function unidadesEnStock(producto: Producto): number {
  return producto.variantes?.reduce((s, v) => s + Math.max(0, v.stock), 0) ?? 0;
}

/** Qué hay de un modelo, mirando sólo las variantes con stock. */
export function estadoDelModelo(producto: Producto): string {
  const conStock = producto.variantes?.filter((v) => v.stock > 0) ?? [];
  const nuevos = conStock.some((v) => !v.esUsado);
  const usados = conStock.some((v) => v.esUsado);
  if (nuevos && usados) return "Nuevo y usado";
  return usados ? "Usado" : "Nuevo sellado";
}

/** La hora de una lectura del stock, como la dice un parte: "14:32". */
export function horaDeLectura(fecha: Date): string {
  return fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
}
