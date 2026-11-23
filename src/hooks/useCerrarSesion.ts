import { useCallback } from "react";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Cierra sesión y navega a `destino`.
 * Navegación dura a propósito: `router.refresh()` solo limpia la caché del cliente de la ruta
 * actual, y con Atrás Next reusaría el payload RSC de las rutas ya visitadas (con la cuenta).
 * Una carga completa descarta toda la caché del router.
 */
export function useCerrarSesion() {
  return useCallback(async (destino: string) => {
    await useAuthStore.getState().logout();
    window.location.assign(destino);
  }, []);
}
