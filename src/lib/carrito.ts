// Nombre accesible del botón del carrito, que visualmente es un ícono con un badge.
export function etiquetaBotonCarrito(cantidad: number): string {
  if (cantidad === 0) return "Abrir carrito, vacío";
  return `Abrir carrito, ${cantidad} ${cantidad === 1 ? "producto" : "productos"}`;
}

export type ItemCarrito = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock?: number;
  image?: string;
  type?: "producto" | "accesorio";
};

const CLAVE_CARRITO = "cart";
const VACIO: ItemCarrito[] = [];

function esItemCarrito(valor: unknown): valor is ItemCarrito {
  if (typeof valor !== "object" || valor === null) return false;
  const v = valor as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.name === "string" &&
    typeof v.price === "number" &&
    typeof v.quantity === "number"
  );
}

// null = lo guardado está corrupto (JSON roto o no es una lista); [] = no había nada.
export function parsearCarrito(raw: string | null): ItemCarrito[] | null {
  if (!raw) return [];
  try {
    const datos: unknown = JSON.parse(raw);
    return Array.isArray(datos) ? datos.filter(esItemCarrito) : null;
  } catch {
    return null;
  }
}

type StorageCarrito = Pick<Storage, "getItem" | "setItem" | "removeItem">;

// Almacén del carrito para useSyncExternalStore: el estado vive afuera de React, así el
// provider no tiene que hidratarlo con un setState dentro de un efecto.
export function crearAlmacenCarrito(storage: StorageCarrito) {
  const suscriptos = new Set<() => void>();
  let ultimoRaw: string | null | undefined;
  let items: ItemCarrito[] = VACIO;
  let storageRoto = false;

  function leer(): ItemCarrito[] {
    if (storageRoto) return items;
    let raw: string | null;
    try {
      raw = storage.getItem(CLAVE_CARRITO);
    } catch {
      return items;
    }
    if (raw === ultimoRaw) return items;
    ultimoRaw = raw;
    const parseado = parsearCarrito(raw);
    if (parseado === null) {
      storage.removeItem(CLAVE_CARRITO);
      ultimoRaw = null;
      items = VACIO;
    } else {
      items = parseado.length ? parseado : VACIO;
    }
    return items;
  }

  function notificar() {
    suscriptos.forEach((aviso) => aviso());
  }

  return {
    getSnapshot: leer,
    getServerSnapshot: (): ItemCarrito[] => VACIO,
    subscribe(aviso: () => void) {
      suscriptos.add(aviso);
      return () => void suscriptos.delete(aviso);
    },
    actualizar(fn: (prev: ItemCarrito[]) => ItemCarrito[]) {
      const siguiente = fn(leer());
      const raw = JSON.stringify(siguiente);
      try {
        storage.setItem(CLAVE_CARRITO, raw);
        ultimoRaw = raw;
      } catch {
        storageRoto = true;
      }
      items = siguiente.length ? siguiente : VACIO;
      notificar();
    },
    notificar,
  };
}
