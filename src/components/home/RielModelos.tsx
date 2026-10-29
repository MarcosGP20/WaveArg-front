"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useProductosHome } from "@/hooks/useProductosHome";
import { varianteMasBarata } from "@/lib/home";
import { formatearPrecio } from "@/lib/precio";

// Riel horizontal de modelos: scroll nativo con snap (se arrastra con el dedo o el trackpad) y
// flechas que avanzan de a una tarjeta. Primero los que tienen stock.
export default function RielModelos() {
  const { productos, cargando, error } = useProductosHome();
  const riel = useRef<HTMLUListElement>(null);

  const mover = (sentido: 1 | -1) => {
    const el = riel.current;
    if (!el) return;
    const tarjeta = el.querySelector("li");
    const paso = tarjeta ? tarjeta.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: paso * sentido, behavior: reducido ? "auto" : "smooth" });
  };

  const lista = (productos ?? [])
    .map((p) => ({ p, v: varianteMasBarata(p) }))
    .filter((x) => x.v !== null)
    .sort((a, b) => b.p.stockTotal - a.p.stockTotal);

  const tarjeta = "w-[82vw] max-w-[440px] flex-shrink-0 snap-start";

  return (
    <section aria-labelledby="modelos" className="pt-32 md:pt-36">
      <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-4 pb-7">
        <h2 id="modelos" className="revelar text-5xl md:text-7xl font-semibold tracking-[-0.045em] leading-[0.98]">Modelos</h2>
        <div className="flex gap-2">
          <button type="button" onClick={() => mover(-1)} aria-label="Modelos anteriores" className="grid size-12 place-items-center rounded-full border border-borde-fuerte bg-white text-tinta transition-colors hover:border-tinta-suave">
            <ArrowLeft size={18} strokeWidth={1.75} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => mover(1)} aria-label="Modelos siguientes" className="grid size-12 place-items-center rounded-full bg-tinta text-white transition-colors hover:bg-black">
            <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </div>

      <ul
        ref={riel}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-[max(1rem,calc((100%-72rem)/2+1rem))] pl-[max(1rem,calc((100%-72rem)/2+1rem))] pr-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cargando &&
          [0, 1, 2].map((i) => (
            <li key={i} className={tarjeta} aria-hidden="true">
              <div className="h-[520px] rounded-[32px] bg-superficie animate-pulse motion-reduce:animate-none" />
            </li>
          ))}

        {lista.map(({ p, v }, i) => (
          <li key={p.id} className={tarjeta}>
            <Link
              href={`/products/${p.id}`}
              className="group flex h-full flex-col gap-5 rounded-[32px] bg-superficie p-7 md:p-8 transition-colors hover:bg-borde"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-[15px] tabular-nums text-tinta-suave">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[13px] font-semibold text-color-principal">
                  {p.variantes.some((x) => x.esUsado && x.stock > 0) && p.variantes.some((x) => !x.esUsado && x.stock > 0)
                    ? "Nuevo y usado"
                    : v!.esUsado ? "Usado" : "Nuevo sellado"}
                </span>
              </div>
              <div className="relative aspect-[4/5]">
                {(v!.imagenes?.[0] ?? p.imagenes?.[0]) && (
                  <Image
                    src={v!.imagenes?.[0] ?? p.imagenes[0]}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 440px, 82vw"
                    className="object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                )}
              </div>
              <div className="mt-auto flex items-end justify-between gap-3">
                <div>
                  <p className="text-3xl font-semibold tracking-tight">{p.nombre}</p>
                  <p className="mt-0.5 text-tinta-suave">Desde {formatearPrecio(v!.precio)}</p>
                </div>
                <span aria-hidden="true" className="grid size-12 flex-shrink-0 place-items-center rounded-full bg-tinta text-white transition-transform group-hover:-rotate-45 motion-reduce:transition-none">
                  <ArrowRight size={20} strokeWidth={1.75} />
                </span>
              </div>
            </Link>
          </li>
        ))}

        {!cargando && (
          <li className={tarjeta}>
            <Link
              href="/products"
              className="flex h-full min-h-[320px] flex-col justify-between rounded-[32px] bg-tinta p-7 md:p-8 text-white transition-colors hover:bg-black"
            >
              <span className="text-[15px] text-niebla">{error ? "No pudimos cargar los modelos" : "Catálogo"}</span>
              <span className="flex items-end justify-between gap-3">
                <span className="text-3xl font-semibold tracking-tight">Ver todos los iPhone</span>
                <ArrowUpRight size={28} strokeWidth={1.75} aria-hidden="true" />
              </span>
            </Link>
          </li>
        )}
      </ul>
    </section>
  );
}
