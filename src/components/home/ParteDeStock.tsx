"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useProductosHome } from "@/hooks/useProductosHome";
import { estadoDeLaVariante, filasDelParte, type FiltroEstado } from "@/lib/home";
import { formatearPrecio } from "@/lib/precio";
import { linkWhatsApp } from "@/lib/whatsapp";
import LineaOla from "./LineaOla";

const MAXIMO_FILAS = 6;

const FILTROS: { valor: FiltroEstado; texto: string }[] = [
  { valor: "todos", texto: "Todo" },
  { valor: "nuevos", texto: "Nuevos" },
  { valor: "usados", texto: "Usados" },
];

// El parte de stock es lo central de la home (DESIGN.md, "Parte de olas"): como el parte del mar,
// dice qué hay, en qué estado, cuánto queda y a qué precio, con la hora en que se leyó. Una fila
// por equipo concreto; cada una lleva a la ficha con esa variante elegida.
export default function ParteDeStock() {
  const { productos, cargando, error, leidoA } = useProductosHome();
  const [filtro, setFiltro] = useState<FiltroEstado>("todos");

  const todas = filasDelParte(productos ?? []);
  const filas = filasDelParte(productos ?? [], filtro);
  const cuenta = (f: FiltroEstado) => filasDelParte(productos ?? [], f).length;
  // Los filtros sólo aparecen si hay de los dos estados: con uno solo no filtran nada.
  const hayDosEstados = cuenta("nuevos") > 0 && cuenta("usados") > 0;
  const unidades = todas.reduce((s, f) => s + f.variante.stock, 0);

  return (
    <section aria-labelledby="parte" className="bg-atlantico text-espuma">
      <div className="mx-auto max-w-6xl px-4 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
          <h2
            id="parte"
            className="font-display font-extrabold text-white leading-[0.88] tracking-[-0.03em] text-[clamp(52px,9vw,128px)] [font-variation-settings:'wdth'_118]"
          >
            Parte de stock
          </h2>
          <div className="pb-2 text-[15px] text-espuma/80">
            {leidoA && (
              <p className="flex items-center gap-2">
                <span aria-hidden="true" className="size-2 rounded-full bg-guardavidas" />
                <span className="text-guardavidas tabular-nums">Leído a las {leidoA}</span>
              </p>
            )}
            {todas.length > 0 && (
              <p className="mt-1 tabular-nums">
                {todas.length} {todas.length === 1 ? "equipo" : "equipos"}, {unidades}{" "}
                {unidades === 1 ? "unidad" : "unidades"} para enviar hoy
              </p>
            )}
          </div>
        </div>

        <p className="mt-6 max-w-[52ch] text-lg text-espuma/80">
          iPhones originales, nuevos y usados, con 3 meses de garantía. Despachamos a todo el país desde
          Necochea y Mar del Plata.
        </p>

        {hayDosEstados && (
          <div role="group" aria-label="Filtrar por estado" className="mt-10 flex flex-wrap gap-2">
            {FILTROS.map(({ valor, texto }) => {
              const activo = filtro === valor;
              return (
                <button
                  key={valor}
                  type="button"
                  onClick={() => setFiltro(valor)}
                  aria-pressed={activo}
                  className={`min-h-11 rounded-full px-5 text-[15px] font-medium tabular-nums transition-colors ${
                    activo ? "bg-espuma text-atlantico" : "border border-espuma/30 text-espuma hover:border-espuma/70"
                  }`}
                >
                  {texto} <span className={activo ? "text-atlantico/60" : "text-espuma/60"}>{cuenta(valor)}</span>
                </button>
              );
            })}
          </div>
        )}

        <LineaOla className="mt-8 text-espuma/30" />

        {cargando && (
          <div aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="py-6">
                <div className="h-12 rounded-md bg-espuma/5 animate-pulse motion-reduce:animate-none" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="py-8 text-lg text-espuma/85">
            No pudimos leer el stock ahora.{" "}
            <Link href="/products" className="font-semibold text-white underline underline-offset-4">
              Ver el catálogo
            </Link>
          </p>
        )}

        {!cargando && !error && todas.length === 0 && (
          <p className="py-8 text-lg text-espuma/85">
            Hoy no hay iPhones en stock.{" "}
            <a
              href={linkWhatsApp("Hola, quiero que me avisen cuando entren iPhones.")}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white underline underline-offset-4"
            >
              Escribinos y te avisamos cuando entren
            </a>
          </p>
        )}

        <ul>
          {filas.slice(0, MAXIMO_FILAS).map(({ producto, variante }) => {
            const pocas = variante.stock <= 3;
            return (
              <li key={variante.id} className="border-b border-espuma/12">
                <Link
                  href={`/products/${producto.id}?v=${variante.id}`}
                  className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1.5 py-6 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_7.5rem_10.5rem_1.5rem] md:items-center md:py-7"
                >
                  <span className="font-display font-bold text-white leading-none tracking-[-0.02em] text-[clamp(24px,2.8vw,36px)] [font-variation-settings:'wdth'_108] group-hover:underline decoration-2 underline-offset-[6px]">
                    {producto.nombre}
                  </span>
                  <span className="order-3 col-span-2 text-[15px] text-espuma/80 md:order-none md:col-span-1 md:text-base">
                    {variante.memoria}, {variante.color.toLowerCase()}
                    <span className="block text-espuma/65">{estadoDeLaVariante(variante)}</span>
                  </span>
                  <span className={`order-4 col-span-2 text-[15px] tabular-nums md:order-none md:col-span-1 md:text-base ${pocas ? "text-guardavidas" : "text-espuma/80"}`}>
                    {pocas ? (variante.stock === 1 ? "Queda 1" : `Quedan ${variante.stock}`) : `${variante.stock} unidades`}
                  </span>
                  <span className="order-2 text-right text-[clamp(20px,2.2vw,28px)] font-semibold tabular-nums text-white md:order-none">
                    {formatearPrecio(variante.precio)}
                  </span>
                  <ChevronRight
                    size={22}
                    strokeWidth={1.75}
                    aria-hidden="true"
                    className="hidden text-espuma/50 transition-transform group-hover:translate-x-1 group-hover:text-white motion-reduce:transition-none md:block"
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {todas.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link
              href="/products"
              className="inline-flex min-h-14 items-center rounded-control bg-white px-7 font-semibold text-atlantico transition-colors hover:bg-espuma"
            >
              {filas.length > MAXIMO_FILAS ? `Ver los ${filas.length} equipos` : "Ver el catálogo"}
            </Link>
            <Link href="/accesorios" className="font-medium text-white underline decoration-espuma/40 underline-offset-[6px] hover:decoration-white">
              Ver accesorios
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
