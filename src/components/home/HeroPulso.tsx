"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useProductosHome } from "@/hooks/useProductosHome";
import { imagenSinFondo, varianteMasBarata } from "@/lib/home";
import { formatearPrecio } from "@/lib/precio";

// Islas cliente del hero "Pulso" (front#15: el resto del hero se renderiza en el servidor). Las
// dos leen el mismo destacado: el elegido en el admin, o el iPhone con más stock.

export function HeroTelefono() {
  const { destacado } = useProductosHome();
  // Si la versión transparente falla (el CDN la genera al pedirla y la primera vez puede tardar
  // más que el timeout del optimizador), se usa la foto original en el panel claro.
  const [sinTransparencia, setSinTransparencia] = useState(false);
  const variante = destacado ? varianteMasBarata(destacado) : null;
  const original = variante?.imagenes?.[0] ?? destacado?.imagenes?.[0];
  if (!destacado || !original) return null;

  const transparente = imagenSinFondo(original);
  const sinFondo = transparente.sinFondo && !sinTransparencia;
  const src = sinFondo ? transparente.src : original;
  return (
    // Dos capas: la de afuera la mueve el scroll (hero-pulso-telefono), la de adentro hace la
    // entrada. Si fueran la misma, una animación pisaría el transform de la otra.
    <div className="hero-pulso-telefono">
      <div className="hero-pulso-entra">
        {sinFondo ? (
          <Image
            src={src}
            alt={`${destacado.nombre}${variante ? ` color ${variante.color}` : ""}`}
            width={1040}
            height={585}
            sizes="(min-width: 768px) 760px, 92vw"
            priority
            onError={() => setSinTransparencia(true)}
            className="w-[min(760px,92vw)] md:w-[min(760px,58vw)] h-auto -rotate-6 drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)]"
          />
        ) : (
          // Una foto con fondo propio va en un panel claro: sobre el negro quedaría un rectángulo.
          <div className="w-[min(460px,72vw)] aspect-square rounded-[32px] bg-superficie p-8">
            <div className="relative size-full">
              <Image src={src} alt={destacado.nombre} fill sizes="460px" priority className="object-contain mix-blend-multiply" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function HeroTarjeta() {
  const { destacado, cargando } = useProductosHome();
  const { addToCart, openCart } = useCart();
  const [agregado, setAgregado] = useState(false);

  const marco = "w-full md:w-80 rounded-3xl border border-noche-borde bg-noche-2/85 p-5 backdrop-blur-md";

  if (cargando) {
    return (
      <div className={`${marco} h-[176px] animate-pulse motion-reduce:animate-none`} aria-hidden="true" />
    );
  }

  const variante = destacado ? varianteMasBarata(destacado) : null;
  if (!destacado || !variante) {
    return (
      <div className={marco}>
        <p className="text-lg font-semibold">Todo el catálogo</p>
        <p className="mt-1 text-sm text-niebla">iPhones nuevos y usados con garantía.</p>
        <Link href="/products" className="mt-4 inline-flex min-h-11 items-center rounded-control bg-white px-5 font-semibold text-noche">
          Ver iPhone
        </Link>
      </div>
    );
  }

  const agregar = () => {
    addToCart({
      id: `${destacado.id}-${variante.id}`,
      name: `${destacado.nombre} (${variante.color}, ${variante.memoria})`,
      price: variante.precio,
      quantity: 1,
      stock: variante.stock,
      image: variante.imagenes?.[0] ?? destacado.imagenes?.[0],
      type: "producto",
    });
    openCart();
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1500);
  };

  return (
    <div className={marco}>
      <p className="flex items-center gap-2 text-[13px] text-[#7FD49B]">
        <span aria-hidden="true" className="size-[7px] rounded-full bg-[#34C759]" />
        En stock · {variante.stock} {variante.stock === 1 ? "unidad" : "unidades"}
      </p>
      <Link href={`/products/${destacado.id}`} className="mt-2.5 block text-[22px] font-semibold leading-tight text-white hover:underline underline-offset-4">
        {destacado.nombre}
      </Link>
      <p className="text-sm text-niebla">
        {variante.memoria} · {variante.color} · {variante.esUsado ? "Usado" : "Nuevo sellado"}
      </p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-[28px] font-semibold tracking-tight tabular-nums">{formatearPrecio(variante.precio)}</p>
        <button
          type="button"
          onClick={agregar}
          className={`min-h-11 rounded-control px-4 text-[15px] font-semibold text-white transition-colors ${
            agregado ? "bg-exito" : "bg-color-principal hover:bg-color-principal-oscuro"
          }`}
        >
          {agregado ? "Agregado" : "Agregar al carrito"}
        </button>
      </div>
      <p role="status" className="sr-only">{agregado ? `${destacado.nombre} agregado al carrito` : ""}</p>
    </div>
  );
}
