// Inventario del admin (productos y accesorios): el back puede tener varios registros del mismo
// modelo; el listado muestra una fila por modelo con todas sus variantes e imágenes.

interface Agrupable<V> {
  nombre: string;
  modelo: string;
  variantes: V[];
  imagenes: string[];
}

export function agruparPorModelo<V, T extends Agrupable<V>>(items: T[]): T[] {
  const grupos = new Map<string, T>();
  for (const item of items) {
    const clave = `${item.nombre}-${item.modelo}`.toLowerCase();
    const existente = grupos.get(clave);
    if (existente) {
      existente.variantes = [...(existente.variantes ?? []), ...(item.variantes ?? [])];
      existente.imagenes = [...(existente.imagenes ?? []), ...(item.imagenes ?? [])];
    } else {
      grupos.set(clave, { ...item });
    }
  }
  return [...grupos.values()];
}

// El destacado lo elige el admin y queda en su navegador (ver CLAUDE.md): sólo lo ve él. Cuando
// pase al back, esta es la única clave que hay que reemplazar.
export const CLAVE_DESTACADO = "wave-featured-product-id";
