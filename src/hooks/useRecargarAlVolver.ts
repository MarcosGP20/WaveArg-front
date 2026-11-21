import { useEffect, useRef } from "react";
import { tocaRecargar } from "@/lib/recarga";

// Llama a recargar cuando la pestaña vuelve a estar visible y pasaron MINUTOS_PARA_RECARGAR desde
// la última vez (lib/recarga.ts). Pensado para recargar sin skeleton: la tabla queda en pantalla
// y se cambian los datos.
export function useRecargarAlVolver(recargar: () => void) {
  const recargarActual = useRef(recargar);
  useEffect(() => {
    recargarActual.current = recargar;
  });

  useEffect(() => {
    let ultimaCarga = Date.now();
    function alCambiarVisibilidad() {
      if (document.visibilityState !== "visible") return;
      const ahora = Date.now();
      if (!tocaRecargar(ultimaCarga, ahora)) return;
      ultimaCarga = ahora;
      recargarActual.current();
    }
    document.addEventListener("visibilitychange", alCambiarVisibilidad);
    return () => document.removeEventListener("visibilitychange", alCambiarVisibilidad);
  }, []);
}
