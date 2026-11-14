// Datos del parte de stock de la home (identidad "Parte de olas", DESIGN.md).
import type { Producto, Variante } from "@/interfaces/producto";
import { memoriaEnGB } from "@/lib/configurador";

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

export type FilaDelParte = { producto: Producto; variante: Variante };
export type FiltroEstado = "todos" | "nuevos" | "usados";

/**
 * Una fila por cada variante con stock: el parte dice qué equipo concreto hay (color, capacidad
 * y estado), no sólo el modelo. Nuevos antes que usados y, dentro de cada modelo, del más barato
 * al más caro. El modelo conserva el orden del back.
 */
export function filasDelParte(productos: Producto[], filtro: FiltroEstado = "todos"): FilaDelParte[] {
  return productos.flatMap((producto) =>
    (producto.variantes ?? [])
      .filter((v) => v.stock > 0)
      .filter((v) => filtro === "todos" || v.esUsado === (filtro === "usados"))
      .sort((a, b) => Number(a.esUsado) - Number(b.esUsado) || a.precio - b.precio)
      .map((variante) => ({ producto, variante })),
  );
}

export type TarjetaDeModelo = {
  producto: Producto;
  /** La variante más barata con stock: es el "desde" y la que abre la ficha. */
  desde: Variante;
  unidades: number;
  estado: string;
  capacidades: string[];
  colores: string[];
};

/**
 * La tarjeta de un modelo armada con las variantes que se le pasan, que ya vienen filtradas (con
 * stock, y lo que haya elegido la persona): el precio más bajo, cuántas unidades quedan y en qué
 * capacidades y colores. null si no queda ninguna.
 */
export function tarjetaDeModelo(producto: Producto, variantes: Variante[]): TarjetaDeModelo | null {
  if (variantes.length === 0) return null;
  const nuevos = variantes.some((v) => !v.esUsado);
  const usados = variantes.some((v) => v.esUsado);
  return {
    producto,
    desde: variantes.reduce((min, v) => (v.precio < min.precio ? v : min)),
    unidades: variantes.reduce((s, v) => s + v.stock, 0),
    estado: nuevos && usados ? "Nuevo y usado" : usados ? "Usado" : "Nuevo sellado",
    capacidades: [...new Set(variantes.map((v) => v.memoria))].sort((a, b) => memoriaEnGB(a) - memoriaEnGB(b)),
    colores: [...new Set(variantes.map((v) => v.color))],
  };
}

/**
 * Una tarjeta por modelo con stock, para comprar desde la home. Sólo cuenta las variantes con
 * stock (y del estado filtrado). El modelo conserva el orden del back.
 */
export function tarjetasDeModelos(productos: Producto[], filtro: FiltroEstado = "todos"): TarjetaDeModelo[] {
  return productos.flatMap((producto) => {
    const variantes = (producto.variantes ?? [])
      .filter((v) => v.stock > 0)
      .filter((v) => filtro === "todos" || v.esUsado === (filtro === "usados"));
    return tarjetaDeModelo(producto, variantes) ?? [];
  });
}

/** "128GB y 256GB en 3 colores" o "64GB en azul": las opciones de un modelo, como se dicen. */
export function resumenDeOpciones(capacidades: string[], colores: string[]): string {
  const lista =
    capacidades.length <= 1
      ? (capacidades[0] ?? "")
      : `${capacidades.slice(0, -1).join(", ")} y ${capacidades[capacidades.length - 1]}`;
  const color = colores.length === 1 ? colores[0].toLowerCase() : `${colores.length} colores`;
  if (colores.length === 0) return lista;
  return lista ? `${lista} en ${color}` : color;
}

/** "Nuevo sellado" o "Usado, batería 91%": el estado tal como lo cargó el admin. */
export function estadoDeLaVariante(v: Variante): string {
  if (!v.esUsado) return "Nuevo sellado";
  const detalle = v.detalleEstado?.trim();
  return detalle ? `Usado, ${detalle.charAt(0).toLowerCase()}${detalle.slice(1)}` : "Usado";
}

/** La hora de una lectura del stock, como la dice un parte: "14:32". */
export function horaDeLectura(fecha: Date): string {
  return fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
}
