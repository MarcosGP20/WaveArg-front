// Filtros y orden del catálogo (/products). Los filtros viven en la URL, así se pueden compartir.
import type { Producto, Variante } from "@/interfaces/producto";
import { memoriaEnGB } from "@/lib/configurador";
import { tarjetaDeModelo, type TarjetaDeModelo } from "@/lib/home";

export type Orden = "predeterminado" | "precio-asc" | "precio-desc";

export interface FiltrosCatalogo {
  /** "nuevo" y/o "usado". Vacío = los dos. */
  estados: string[];
  /** Capacidades normalizadas ("128gb"). */
  memorias: string[];
  /** Slugs de modelo ("iphone-15-pro"). */
  modelos: string[];
  /** Prefijo de slug ("iphone-15" trae también el Pro). */
  familia: string | null;
  precioMin: number | null;
  precioMax: number | null;
  orden: Orden;
}

/** Lo que hace falta de URLSearchParams: sirve el de Next y el del navegador. */
type Parametros = { get(nombre: string): string | null };

/** "iPhone 15 Pro" → "iphone-15-pro" */
export function slugDeModelo(nombre: string): string {
  return nombre.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

/** "128 GB" → "128gb" */
export function normalizarMemoria(memoria: string): string {
  return memoria.toLowerCase().replace(/\s/g, "");
}

const lista = (valor: string | null) => valor?.split(",").map((v) => v.trim().toLowerCase()).filter(Boolean) ?? [];
const numero = (valor: string | null) => (valor && !Number.isNaN(Number(valor)) ? Number(valor) : null);

export function leerFiltros(params: Parametros): FiltrosCatalogo {
  const orden = params.get("orden");
  return {
    estados: lista(params.get("estado")),
    memorias: lista(params.get("memoria")).map(normalizarMemoria),
    modelos: lista(params.get("modelo")),
    familia: params.get("familia")?.trim().toLowerCase() || null,
    precioMin: numero(params.get("precioMin")),
    precioMax: numero(params.get("precioMax")),
    orden: orden === "precio-asc" || orden === "precio-desc" ? orden : "predeterminado",
  };
}

/**
 * Las variantes de un modelo que se pueden comprar y cumplen todo lo filtrado a la vez. Antes el
 * catálogo aceptaba un modelo si una variante cumplía el estado y otra la capacidad, y la tarjeta
 * mostraba un precio que no era el de lo que se había pedido.
 */
export function variantesQueCumplen(producto: Producto, filtros: FiltrosCatalogo): Variante[] {
  return (producto.variantes ?? []).filter((v) => {
    if (v.stock <= 0) return false;
    if (filtros.estados.length > 0 && !filtros.estados.includes(v.esUsado ? "usado" : "nuevo")) return false;
    if (filtros.memorias.length > 0 && !filtros.memorias.includes(normalizarMemoria(v.memoria))) return false;
    if (filtros.precioMin !== null && v.precio < filtros.precioMin) return false;
    if (filtros.precioMax !== null && v.precio > filtros.precioMax) return false;
    return true;
  });
}

function esDelModelo(producto: Producto, filtros: FiltrosCatalogo): boolean {
  const slug = slugDeModelo(producto.nombre);
  if (filtros.familia && !slug.startsWith(filtros.familia)) return false;
  if (filtros.modelos.length === 0) return true;
  return filtros.modelos.some((m) => slug === m || (filtros.familia !== null && slug === `${filtros.familia}-${m}`));
}

/** Las tarjetas del catálogo: una por modelo que tenga algo de lo pedido, con su precio "desde". */
export function tarjetasDelCatalogo(productos: Producto[], filtros: FiltrosCatalogo): TarjetaDeModelo[] {
  const tarjetas = productos
    .filter((p) => esDelModelo(p, filtros))
    .flatMap((p) => tarjetaDeModelo(p, variantesQueCumplen(p, filtros)) ?? []);
  if (filtros.orden === "predeterminado") return tarjetas;
  const sentido = filtros.orden === "precio-asc" ? 1 : -1;
  return tarjetas.sort((a, b) => sentido * (a.desde.precio - b.desde.precio));
}

/** Las opciones de los filtros salen de lo que hay en stock, no de una lista escrita a mano. */
export function opcionesDeFiltro(productos: Producto[]) {
  const conStock = productos.flatMap((p) => (p.variantes ?? []).filter((v) => v.stock > 0));
  const precios = conStock.map((v) => v.precio).filter((precio) => precio > 0);
  const memorias = new Map(conStock.map((v) => [normalizarMemoria(v.memoria), v.memoria]));
  return {
    memorias: [...memorias]
      .sort(([, a], [, b]) => memoriaEnGB(a) - memoriaEnGB(b))
      .map(([valor, texto]) => ({ valor, texto })),
    modelos: productos
      .filter((p) => (p.variantes ?? []).some((v) => v.stock > 0))
      .map((p) => ({ valor: slugDeModelo(p.nombre), texto: p.nombre })),
    precio: precios.length > 0 ? { min: Math.min(...precios), max: Math.max(...precios) } : undefined,
  };
}
