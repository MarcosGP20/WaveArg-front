// Datos de la home "Pulso": qué iPhone va en el hero y cómo se muestra sobre fondo oscuro.
import type { Producto, Variante } from "@/interfaces/producto";

/** La variante más barata con stock, o null si no queda ninguna. */
export function varianteMasBarata(producto: Producto): Variante | null {
  const conStock = producto.variantes?.filter((v) => v.stock > 0) ?? [];
  if (conStock.length === 0) return null;
  return conStock.reduce((min, v) => (v.precio < min.precio ? v : min));
}

/**
 * El iPhone del hero: el destacado desde el admin si tiene stock; si no, el de más stock (lo que
 * más se puede vender hoy). Null si no hay ninguno con stock.
 */
export function elegirDestacado(productos: Producto[], destacadoId: number | null): Producto | null {
  const conStock = productos.filter((p) => varianteMasBarata(p) !== null);
  if (conStock.length === 0) return null;
  const destacado = conStock.find((p) => p.id === destacadoId);
  if (destacado) return destacado;
  return conStock.reduce((max, p) => (p.stockTotal > max.stockTotal ? p : max));
}

const CDN_APPLE = "store.storeimages.cdn-apple.com";
// 1040px alcanza para el hero en pantallas 2x; más grande, el CDN tarda y el optimizador de
// next/image corta por timeout.
const ANCHO_MAXIMO = 1040;

/**
 * Las fotos del CDN de Apple vienen en JPG con fondo blanco, que sobre el hero negro queda como
 * un rectángulo. Ese CDN sirve la misma foto con transparencia (fmt=png-alpha); de paso se limita
 * el ancho, porque algunas piden 5120px. Otras URLs vuelven tal cual (y `sinFondo` en false).
 */
export function imagenSinFondo(url: string): { src: string; sinFondo: boolean } {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { src: url, sinFondo: false };
  }
  if (parsed.hostname !== CDN_APPLE) return { src: url, sinFondo: false };

  const wid = Number(parsed.searchParams.get("wid"));
  const hei = Number(parsed.searchParams.get("hei"));
  if (wid > ANCHO_MAXIMO) {
    parsed.searchParams.set("wid", String(ANCHO_MAXIMO));
    if (hei > 0) parsed.searchParams.set("hei", String(Math.round((hei * ANCHO_MAXIMO) / wid)));
  }
  parsed.searchParams.set("fmt", "png-alpha");
  return { src: parsed.toString(), sinFondo: true };
}
