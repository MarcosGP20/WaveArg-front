"use client";

import { useCallback, useLayoutEffect, useState } from "react";

const VIDEO_PATH = "/LOGO-WAVE-alfa.webm";
const MAX_MS = 5000;
export const CLAVE_VISITA = "hasVisited";

// Intro del logo sobre la home (front#15). Es una capa encima del contenido, que ya viene en el
// HTML: no bloquea el render y se puede saltear.
//
// El primer render es siempre el mismo ("visible") en servidor y cliente; leer sessionStorage
// durante el render era lo que causaba el React #418. En visitas siguientes la oculta antes de
// pintar el script del layout raíz (clase wave-sin-intro en <html>) y, con reduced-motion, el
// CSS; después de montar, el efecto la saca del árbol.
export default function HomeLoader() {
  const [visible, setVisible] = useState(true);

  const cerrar = useCallback(() => {
    try {
      sessionStorage.setItem(CLAVE_VISITA, "true");
    } catch {}
    setVisible(false);
  }, []);

  useLayoutEffect(() => {
    let yaVisto = false;
    try {
      yaVisto = sessionStorage.getItem(CLAVE_VISITA) !== null;
    } catch {}
    if (yaVisto || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      return;
    }
    const timeout = setTimeout(cerrar, MAX_MS);
    return () => clearTimeout(timeout);
  }, [cerrar]);

  if (!visible) return null;

  return (
    <div className="wave-loader fixed inset-0 z-50 flex items-center justify-center bg-white">
      <video
        playsInline
        autoPlay
        muted
        aria-hidden="true"
        onEnded={cerrar}
        onError={cerrar}
        className="h-full w-full object-contain"
      >
        <source src={VIDEO_PATH} type="video/webm" />
      </video>
      <button
        type="button"
        onClick={cerrar}
        className="absolute bottom-8 right-8 rounded-full border border-gray-300 bg-white/90 px-5 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#05467D] focus-visible:ring-offset-2"
      >
        Saltear intro
      </button>
    </div>
  );
}
