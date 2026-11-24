"use client";

import { useProductosHome } from "@/hooks/useProductosHome";
import { filasDelParte } from "@/lib/home";

// La prueba del hero es un dato, no un adjetivo: cuántos equipos hay para despachar y a qué hora
// se leyó el stock. Si el stock no llega o no hay nada, la línea queda vacía (con su alto reservado).
export default function ParteEnVivo() {
  const { productos, leidoA } = useProductosHome();
  const equipos = filasDelParte(productos ?? []).length;

  return (
    <p className="mt-8 flex min-h-6 items-center gap-2 caption-1 tabular-nums text-guardavidas">
      {leidoA && equipos > 0 && (
        <>
          <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-guardavidas" />
          {equipos} {equipos === 1 ? "equipo" : "equipos"} en stock, leído a las {leidoA}
        </>
      )}
    </p>
  );
}
