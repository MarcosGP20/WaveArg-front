"use client";

import { useEffect, useRef } from "react";

// La frase de marca de la home: en grande, y las palabras se encienden de a una, en orden de
// lectura, mientras el bloque sube por la pantalla. El texto llega entero en el HTML; el efecto
// lo agrega el JS y no corre con prefers-reduced-motion.
const INICIO = 0.85; // la primera palabra se enciende cuando el bloque llega a esta altura de la pantalla
const FIN = 0.45; // y la última, cuando llega a esta

export default function FraseDeMarca({ texto, className = "" }: { texto: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const palabras = texto.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const spans = el.querySelectorAll<HTMLElement>(".palabra");
    let encendidas = 0;
    let cuadro = 0;

    const medir = () => {
      cuadro = 0;
      const alto = window.innerHeight;
      const avance = (alto * INICIO - el.getBoundingClientRect().top) / (alto * (INICIO - FIN));
      const hasta = Math.ceil(Math.min(1, Math.max(0, avance)) * spans.length);
      // Sólo avanza: lo que ya se leyó no se vuelve a apagar al subir.
      for (; encendidas < hasta; encendidas++) spans[encendidas].dataset.activa = "";
      if (encendidas === spans.length) window.removeEventListener("scroll", alScrollear);
    };
    const alScrollear = () => {
      if (!cuadro) cuadro = requestAnimationFrame(medir);
    };

    el.classList.add("frase-viva");
    medir();
    window.addEventListener("scroll", alScrollear, { passive: true });
    return () => {
      window.removeEventListener("scroll", alScrollear);
      cancelAnimationFrame(cuadro);
      el.classList.remove("frase-viva");
      spans.forEach((span) => delete span.dataset.activa);
    };
  }, []);

  return (
    <p ref={ref} className={className}>
      {palabras.map((palabra, i) => (
        <span key={i}>
          <span className="palabra">{palabra}</span>
          {i < palabras.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
