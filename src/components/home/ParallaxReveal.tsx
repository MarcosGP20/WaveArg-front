"use client";

import { useRef } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";

// Escala y opacidad atadas al scroll. El contenido llega como children, renderizado en el
// servidor. Con reduced-motion se muestra quieto: MotionConfig no frena los valores atados al
// scroll, así que se corta acá.
export default function ParallaxReveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reducido = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className={className}>
      <m.div style={reducido ? undefined : { scale, opacity }} className="relative w-full">
        {children}
      </m.div>
    </section>
  );
}
