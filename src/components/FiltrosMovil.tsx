"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { SlidersHorizontal, X } from "lucide-react";

// Botón "Filtros" + panel inferior de filtros en mobile (catálogo y accesorios). Es un Radix
// Dialog (front#13): tiene nombre, cierra con Escape, con click afuera o con los botones,
// atrapa el foco y al cerrar lo devuelve al botón.
export default function FiltrosMovil({
  activeFilterCount,
  children,
}: {
  activeFilterCount: number;
  children: React.ReactNode;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm text-sm font-medium text-gray-700 hover:border-color-principal hover:text-color-principal transition-colors">
        <SlidersHorizontal size={16} aria-hidden="true" />
        Filtros
        {activeFilterCount > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-color-principal text-white text-[10px] font-bold">
            {activeFilterCount}
            <span className="sr-only"> {activeFilterCount === 1 ? "activo" : "activos"}</span>
          </span>
        )}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl max-h-[88vh] flex flex-col animate-slideUp motion-reduce:animate-none focus:outline-none"
        >
          {/* Handle + header */}
          <div className="relative px-5 pt-4 pb-3 flex items-center justify-between border-b border-gray-100 shrink-0">
            <div aria-hidden="true" className="absolute left-1/2 -translate-x-1/2 top-2.5 w-10 h-1 bg-gray-200 rounded-full" />
            <Dialog.Title className="font-bold text-lg text-gray-900 mt-1">Filtros</Dialog.Title>
            <Dialog.Close
              aria-label="Cerrar filtros"
              className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={20} aria-hidden="true" />
            </Dialog.Close>
          </div>
          {/* Scroll area */}
          <div className="overflow-y-auto flex-1 px-5 py-4">{children}</div>
          {/* CTA: los filtros se aplican al tocarlos; el botón solo cierra el panel. */}
          <div className="px-5 py-4 border-t border-gray-100 shrink-0">
            <Dialog.Close className="w-full bg-color-principal text-white py-3 rounded-full font-semibold text-sm hover:bg-color-principal-oscuro transition-colors">
              {activeFilterCount > 0 ? `Aplicar filtros (${activeFilterCount})` : "Aplicar filtros"}
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
