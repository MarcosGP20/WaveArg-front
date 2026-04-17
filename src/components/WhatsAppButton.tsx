"use client";

import { useState, useEffect } from "react";
import { X, MessageCircle } from "lucide-react";

const WA_URL = "https://wa.me/5492262586880?text=Hola%2C%20me%20interesa%20saber%20m%C3%A1s%20sobre%20los%20productos%20de%20Wave%20Arg.";

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  // Mostrar el tooltip automáticamente a los 4 segundos
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Tooltip */}
      {showTooltip && (
        <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 max-w-[220px] animate-fadeup">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            <X size={14} />
          </button>
          <p className="text-sm font-semibold text-gray-800 pr-4">
            ¿Necesitás ayuda?
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Escribinos por WhatsApp y te respondemos al instante.
          </p>
        </div>
      )}

      {/* Botón flotante */}
      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setShowTooltip(false)}
        aria-label="Contactar por WhatsApp"
        className="
          w-14 h-14 rounded-full
          bg-color-principal hover:bg-color-principal-oscuro
          flex items-center justify-center
          shadow-lg hover:shadow-xl
          transition-all duration-200
          active:scale-95
        "
      >
        {/* SVG oficial de WhatsApp */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          className="w-7 h-7"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.11 1.52 5.83L.057 23.196a.75.75 0 0 0 .926.899l5.489-1.437A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.71 9.71 0 0 1-4.951-1.355l-.355-.21-3.683.964.983-3.595-.23-.37A9.713 9.713 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
        </svg>
      </a>
    </div>
  );
}
