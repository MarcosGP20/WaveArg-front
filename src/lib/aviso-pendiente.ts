/**
 * Aviso que sobrevive a una navegación dura (p. ej. el cierre de sesión): se guarda antes de
 * navegar y la página de destino lo consume al montar. Funciones puras sobre un storage mínimo.
 */
export type TipoAviso = "success" | "error" | "info";

export interface AvisoPendiente {
  tipo: TipoAviso;
  mensaje: string;
}

export interface StorageMinimo {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const CLAVE_AVISO_PENDIENTE = "wave-aviso-pendiente";

const TIPOS: readonly string[] = ["success", "error", "info"];

export function guardarAviso(storage: StorageMinimo | null | undefined, aviso: AvisoPendiente): void {
  try {
    storage?.setItem(CLAVE_AVISO_PENDIENTE, JSON.stringify(aviso));
  } catch {
    // Storage no disponible: el aviso se pierde, no rompe el flujo.
  }
}

/** Lee el aviso, lo borra y lo devuelve. Null si no hay, está corrupto o el storage falla. */
export function consumirAviso(storage: StorageMinimo | null | undefined): AvisoPendiente | null {
  try {
    if (!storage) return null;
    const crudo = storage.getItem(CLAVE_AVISO_PENDIENTE);
    if (crudo === null) return null;
    storage.removeItem(CLAVE_AVISO_PENDIENTE);
    const dato: unknown = JSON.parse(crudo);
    if (
      typeof dato === "object" && dato !== null &&
      typeof (dato as AvisoPendiente).mensaje === "string" &&
      TIPOS.includes((dato as AvisoPendiente).tipo)
    ) {
      const { tipo, mensaje } = dato as AvisoPendiente;
      return { tipo, mensaje };
    }
    return null;
  } catch {
    return null;
  }
}
