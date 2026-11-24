"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { SlidersHorizontal, X } from "lucide-react";

// Botón "Filtros" + panel inferior de filtros en mobile (catálogo y accesorios). Es un Radix
// Dialog (front#13): tiene nombre, cierra con Escape, con click afuera o con los botones,
// atrapa el foco y al cerrar lo devuelve al botón. Al pasar a desktop (lg) se cierra: oculto con
// lg:hidden seguiría siendo modal y dejaría la página bloqueada.
export default function FiltrosMovil({
  activeFilterCount,
  resultados,
  children,
}: {
  activeFilterCount: number;
  /** Cuántos resultados hay con los filtros puestos: se dice en el botón que cierra el panel. */
  resultados?: number;
  children: React.ReactNode;
}) {
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    if (!abierto) return;
    const desktop = matchMedia("(min-width: 1024px)");
    const cerrarEnDesktop = () => desktop.matches && setAbierto(false);
    cerrarEnDesktop();
    desktop.addEventListener("change", cerrarEnDesktop);
    return () => desktop.removeEventListener("change", cerrarEnDesktop);
  }, [abierto]);

  return (
    <Dialog.Root open={abierto} onOpenChange={setAbierto}>
      <Dialog.Trigger className="inline-flex items-center gap-2 rounded-control border border-borde-fuerte bg-white px-4 py-3 body-5 text-tinta transition-colors duration-300 hover:border-tinta-suave lg:hidden">
        <SlidersHorizontal size={16} strokeWidth={1.75} aria-hidden="true" />
        Filtros
        {activeFilterCount > 0 && (
          <span className="inline-flex size-5 items-center justify-center rounded-full bg-color-principal text-xs font-semibold tabular-nums text-white">
            {activeFilterCount}
            <span className="sr-only"> {activeFilterCount === 1 ? "activo" : "activos"}</span>
          </span>
        )}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl max-h-[88dvh] flex flex-col animate-slideUp motion-reduce:animate-none focus:outline-none"
        >
          {/* Handle + header */}
          {/* El título visible es el "Filtros" del contenido: acá sólo va para el lector de pantalla. */}
          <div className="relative flex shrink-0 items-center justify-end border-b border-borde px-2 py-1">
            <div aria-hidden="true" className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-borde-fuerte" />
            <Dialog.Title className="sr-only">Filtros</Dialog.Title>
            <Dialog.Close
              aria-label="Cerrar filtros"
              className="grid size-11 place-items-center rounded-full text-tinta-suave transition-colors duration-300 hover:text-tinta"
            >
              <X size={20} strokeWidth={1.75} aria-hidden="true" />
            </Dialog.Close>
          </div>
          {/* Scroll area */}
          <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
          {/* Los filtros se aplican al tocarlos; el botón sólo cierra el panel y muestra el resultado. */}
          <div className="shrink-0 border-t border-borde px-4 py-4">
            <Dialog.Close className="w-full rounded-control bg-color-principal px-8 py-4 button-md text-white transition-colors duration-300 hover:bg-color-principal-oscuro">
              {resultados === undefined ? "Ver resultados" : resultados === 1 ? "Ver 1 resultado" : `Ver ${resultados} resultados`}
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
