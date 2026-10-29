"use client";

import Link from "next/link";
import { useProductosHome } from "@/hooks/useProductosHome";
import { estadoDelModelo, unidadesEnStock, varianteMasBarata } from "@/lib/home";
import { formatearPrecio } from "@/lib/precio";

const MAXIMO_FILAS = 4;

// El stock del hero, como un parte de olas: qué hay, en qué estado, cuánto queda y desde qué
// precio, con la hora en que se leyó. Datos reales del back, no adjetivos (DESIGN.md).
export default function ParteDeStock() {
  const { productos, cargando, error, leidoA } = useProductosHome();

  const filas = (productos ?? [])
    .map((p) => ({ p, v: varianteMasBarata(p), unidades: unidadesEnStock(p) }))
    .filter((x): x is typeof x & { v: NonNullable<(typeof x)["v"]> } => x.v !== null)
    .sort((a, b) => b.unidades - a.unidades);

  const fila = "grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.9fr)_auto] md:gap-6";

  return (
    <section aria-labelledby="parte" className="border-t border-espuma/15 pt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="parte" className="font-display text-xl font-bold tracking-tight [font-variation-settings:'wdth'_112]">
          Parte de stock
        </h2>
        {leidoA && (
          <p className="flex items-center gap-2 text-sm text-espuma/75">
            <span aria-hidden="true" className="size-2 rounded-full bg-guardavidas animate-pulse motion-reduce:animate-none" />
            Actualizado a las {leidoA}
          </p>
        )}
      </div>

      <div className="mt-2 hidden md:grid md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.9fr)_auto] md:gap-6 border-b border-espuma/15 pb-2 text-[13px] text-espuma/70" aria-hidden="true">
        <span>Modelo</span>
        <span>Estado</span>
        <span>Stock</span>
        <span>Precio</span>
        <span className="w-[88px]" />
      </div>

      {cargando && (
        <div aria-hidden="true" className="divide-y divide-espuma/10">
          {[0, 1].map((i) => (
            <div key={i} className="h-[68px] py-4">
              <div className="h-full rounded-md bg-espuma/5 animate-pulse motion-reduce:animate-none" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="py-5 text-espuma/80">
          No pudimos leer el stock ahora.{" "}
          <Link href="/products" className="font-semibold text-white underline underline-offset-4">Ver el catálogo</Link>
        </p>
      )}

      {!cargando && !error && filas.length === 0 && (
        <p className="py-5 text-espuma/80">
          Hoy no hay iPhones en stock. Escribinos y te avisamos cuando entren.
        </p>
      )}

      <ul className="divide-y divide-espuma/10">
        {filas.slice(0, MAXIMO_FILAS).map(({ p, v, unidades }) => (
          <li key={p.id} className={fila}>
            <Link href={`/products/${p.id}`} className="font-display text-lg font-bold tracking-tight [font-variation-settings:'wdth'_106] text-white hover:underline underline-offset-4 md:text-xl">
              {p.nombre}
            </Link>
            <span className="order-3 md:order-none text-espuma/80 text-sm md:text-base">{estadoDelModelo(p)}</span>
            <span className={`order-4 md:order-none text-sm md:text-base tabular-nums ${unidades <= 3 ? "text-guardavidas" : "text-espuma/80"}`}>
              {unidades <= 3 ? `Quedan ${unidades}` : `${unidades} unidades`}
            </span>
            <span className="order-2 md:order-none text-right md:text-left text-lg md:text-xl font-semibold tabular-nums text-white">
              <span className="text-sm font-normal text-espuma/70">desde </span>
              {formatearPrecio(v.precio)}
            </span>
            <Link
              href={`/products/${p.id}`}
              aria-label={`Elegir color y capacidad del ${p.nombre}`}
              className="order-5 md:order-none hidden md:inline-flex min-h-11 w-[88px] items-center justify-center rounded-control bg-white text-[15px] font-semibold text-atlantico transition-colors hover:bg-espuma"
            >
              Elegir
            </Link>
          </li>
        ))}
      </ul>

      {filas.length > MAXIMO_FILAS && (
        <Link href="/products" className="mt-3 inline-block text-[15px] font-semibold text-white underline underline-offset-4">
          Ver los {filas.length} modelos en stock
        </Link>
      )}
    </section>
  );
}
