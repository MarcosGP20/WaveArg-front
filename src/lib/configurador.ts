import type { Variante } from "@/interfaces/producto";

// Lógica del configurador de la ficha: estado → color → capacidad. Las combinaciones sin stock se
// muestran deshabilitadas en vez de ocultarse, así el cliente ve qué existe y qué falta.

export type Eleccion = { esUsado: boolean; color: string; memoria: string };

/** "128 GB" → 128, "1 TB" → 1024. Sirve para ordenar capacidades. */
export function memoriaEnGB(memoria: string): number {
  const texto = memoria.toLowerCase().trim();
  const numero = parseFloat(texto);
  if (isNaN(numero)) return 0;
  return texto.includes("tb") ? numero * 1024 : numero;
}

const conStockPrimero = (a: Variante, b: Variante) => Number(b.stock > 0) - Number(a.stock > 0);

/**
 * La variante que mejor cumple lo pedido. El estado se respeta siempre; después intenta color y
 * capacidad, después sólo color y, si no, cualquiera de ese estado. En cada nivel prefiere una
 * con stock (en usados puede haber varias unidades de la misma combinación).
 */
export function resolverVariante(variantes: Variante[], deseo: Eleccion): Variante | undefined {
  const delEstado = variantes.filter((v) => v.esUsado === deseo.esUsado).sort(conStockPrimero);
  return (
    delEstado.find((v) => v.color === deseo.color && v.memoria === deseo.memoria) ??
    delEstado.find((v) => v.color === deseo.color) ??
    delEstado[0]
  );
}

/** Estados que tiene el producto, con el precio más bajo de cada uno ("desde"). */
export function estadosDisponibles(variantes: Variante[]) {
  return [false, true].flatMap((esUsado) => {
    const delEstado = variantes.filter((v) => v.esUsado === esUsado);
    if (delEstado.length === 0) return [];
    const conStock = delEstado.filter((v) => v.stock > 0);
    const base = conStock.length > 0 ? conStock : delEstado;
    return [{ esUsado, desde: Math.min(...base.map((v) => v.precio)), hayStock: conStock.length > 0 }];
  });
}

/** Colores del estado elegido, en el orden en que los cargó el admin. */
export function coloresDelEstado(variantes: Variante[], esUsado: boolean) {
  const colores = new Map<string, boolean>();
  for (const v of variantes) {
    if (v.esUsado !== esUsado) continue;
    colores.set(v.color, (colores.get(v.color) ?? false) || v.stock > 0);
  }
  return [...colores].map(([color, hayStock]) => ({ color, hayStock }));
}

/**
 * Todas las capacidades del estado elegido (no sólo las del color), ordenadas de menor a mayor.
 * `variante` es la de ese color y capacidad; si no existe o no tiene stock, la opción va
 * deshabilitada.
 */
export function capacidadesDelColor(variantes: Variante[], esUsado: boolean, color: string) {
  const memorias = [...new Set(variantes.filter((v) => v.esUsado === esUsado).map((v) => v.memoria))];
  return memorias
    .sort((a, b) => memoriaEnGB(a) - memoriaEnGB(b))
    .map((memoria) => {
      const variante = resolverVariante(variantes, { esUsado, color, memoria });
      const exacta = variante && variante.color === color && variante.memoria === memoria ? variante : undefined;
      return { memoria, variante: exacta, disponible: !!exacta && exacta.stock > 0 };
    });
}

/** Variante inicial: la del link (?v=) si existe; si no, la primera nueva con stock. */
export function varianteInicial(variantes: Variante[], idDelLink?: string): Variante | undefined {
  const delLink = idDelLink ? variantes.find((v) => String(v.id) === idDelLink) : undefined;
  if (delLink) return delLink;
  const ordenadas = [...variantes].sort(conStockPrimero);
  return ordenadas.find((v) => !v.esUsado) ?? ordenadas[0];
}
