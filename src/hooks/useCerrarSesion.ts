import { useCallback } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { guardarAviso, type AvisoPendiente } from "@/lib/aviso-pendiente";

/**
 * Cierra sesión y navega a `destino`.
 * Navegación dura a propósito: `router.refresh()` solo limpia la caché del cliente de la ruta
 * actual, y con Atrás Next reusaría el payload RSC de las rutas ya visitadas (con la cuenta).
 * Una carga completa descarta toda la caché del router.
 * Un toast disparado antes se perdería con la recarga: `aviso` se guarda en sessionStorage y lo
 * muestra <AvisoPendiente /> en la página de destino.
 */
export function useCerrarSesion() {
  return useCallback(async (destino: string, aviso?: AvisoPendiente) => {
    if (aviso) {
      try {
        guardarAviso(window.sessionStorage, aviso);
      } catch {
        // sessionStorage bloqueado: se cierra sesión igual, sin aviso.
      }
    }
    await useAuthStore.getState().logout();
    window.location.assign(destino);
  }, []);
}
