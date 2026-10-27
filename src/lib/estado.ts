// Interruptores de operación del back (GET /api/estado): mantenimiento, checkout y login con
// Google se apagan con variables de entorno en Render, sin redeployar.
import { BACKEND_API_BASE } from "@/lib/backend";

export interface EstadoSitio {
  mantenimiento: boolean;
  checkoutHabilitado: boolean;
  googleHabilitado: boolean;
}

// Si no se puede consultar el estado, el sitio sigue funcionando: el back igual rechaza lo que
// esté apagado con un 503 y su mensaje.
export const ESTADO_POR_DEFECTO: EstadoSitio = {
  mantenimiento: false,
  checkoutHabilitado: true,
  googleHabilitado: true,
};

// Cada cuánto el servidor de Next vuelve a consultar el estado.
const REVALIDAR_SEGUNDOS = 30;

export function leerEstado(data: unknown): EstadoSitio {
  if (typeof data !== "object" || data === null) return ESTADO_POR_DEFECTO;
  const d = data as Record<string, unknown>;
  const bool = (v: unknown, porDefecto: boolean) => (typeof v === "boolean" ? v : porDefecto);
  return {
    mantenimiento: bool(d.mantenimiento, ESTADO_POR_DEFECTO.mantenimiento),
    checkoutHabilitado: bool(d.checkoutHabilitado, ESTADO_POR_DEFECTO.checkoutHabilitado),
    googleHabilitado: bool(d.googleHabilitado, ESTADO_POR_DEFECTO.googleHabilitado),
  };
}

/** Sólo en el servidor (layout raíz). */
export async function obtenerEstado(): Promise<EstadoSitio> {
  try {
    const res = await fetch(`${BACKEND_API_BASE}/estado`, {
      next: { revalidate: REVALIDAR_SEGUNDOS },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return ESTADO_POR_DEFECTO;
    return leerEstado(await res.json());
  } catch {
    return ESTADO_POR_DEFECTO;
  }
}
