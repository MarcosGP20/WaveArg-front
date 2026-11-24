import { useEffect } from "react";
import { debeRecargar } from "@/lib/bfcache";

// Si Atrás restaura la página desde la bfcache (típico después de cerrar sesión), recarga para que
// el servidor vuelva a verificar la cookie y los layouts redirijan al login.
export function useRecargarSiVuelveDeBfcache() {
  useEffect(() => {
    function alMostrarPagina(evento: PageTransitionEvent) {
      if (debeRecargar(evento)) window.location.reload();
    }
    window.addEventListener("pageshow", alMostrarPagina);
    return () => window.removeEventListener("pageshow", alMostrarPagina);
  }, []);
}
