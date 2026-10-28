"use client";

import { useRef } from "react";
import { m, useScroll, useTransform } from "framer-motion";

// Escala y opacidad atadas al scroll. El contenido llega como children, renderizado en el
// servidor. Con reduced-motion se muestra quieto: MotionConfig no frena los valores atados al
// scroll, así que lo corta una media query. Tiene que ser CSS y no useReducedMotion: el servidor
// no conoce la preferencia, renderiza opacity 0, y si el cliente cambia el style React no lo
// corrige al hidratar (la sección quedaba invisible).
export default function ParallaxReveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className={className}>
      <m.div style={{ scale, opacity }} className="relative w-full motion-reduce:opacity-100! motion-reduce:[transform:none]!">
        {children}
      </m.div>
    </section>
  );
}
