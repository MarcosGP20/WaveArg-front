"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// El teléfono 3D del hero. three.js se carga recién acá, con import dinámico: no entra en el
// bundle inicial ni frena el primer pintado. Sin WebGL (o si algo falla) queda una foto quieta.
export default function TelefonoOla() {
  const host = useRef<HTMLDivElement>(null);
  const [estado, setEstado] = useState<"cargando" | "listo" | "sin-webgl">("cargando");

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let desmontar: (() => void) | null = null;
    let cancelado = false;

    const prueba = document.createElement("canvas");
    if (!prueba.getContext("webgl2") && !prueba.getContext("webgl")) {
      setEstado("sin-webgl");
      return;
    }

    import("@/lib/telefono3d")
      .then(({ montarTelefono }) => {
        if (cancelado) return;
        desmontar = montarTelefono(el, {
          color: "#DADDE1",
          reducido: matchMedia("(prefers-reduced-motion: reduce)").matches,
          seccion: el.closest("section"),
          onListo: () => setEstado("listo"),
        });
      })
      .catch(() => setEstado("sin-webgl"));

    return () => {
      cancelado = true;
      desmontar?.();
    };
  }, []);

  return (
    <div className="relative h-[min(44svh,400px)] w-full md:h-[min(60svh,540px)]">
      {/* El canvas aparece con un fundido cuando dibujó su primer cuadro. */}
      <div
        ref={host}
        className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${estado === "listo" ? "opacity-100" : "opacity-0"}`}
      />
      {estado === "sin-webgl" && (
        <Image
          src="/iphone-div-landing.jpg"
          alt=""
          fill
          sizes="(min-width: 768px) 45vw, 100vw"
          className="rounded-[28px] object-cover"
        />
      )}
    </div>
  );
}
