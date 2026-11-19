"use client";

import { useEffect, useRef } from "react";

// Entrada de una sección al llegar con el scroll (CSS en globals.css, ".revelar"). Se oculta sólo
// lo que al montar todavía está debajo de la pantalla, así el contenido nunca depende del JS para
// verse, y se muestra una sola vez: no se repite al volver a subir.
export default function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.getBoundingClientRect().top < window.innerHeight) return;
    el.dataset.revelado = "no";
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        el.dataset.revelado = "si";
        observador.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return (
    <div ref={ref} className={`revelar ${className}`}>
      {children}
    </div>
  );
}
