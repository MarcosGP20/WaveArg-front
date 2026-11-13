"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useProductosHome } from "@/hooks/useProductosHome";
import { textoCuotas } from "@/lib/cuotas";
import { resumenDeOpciones, tarjetasDeModelos, type FiltroEstado } from "@/lib/home";
import { formatearPrecio } from "@/lib/precio";
import { botonPrincipal, enlace, seccion, tituloSeccion } from "./estilos";

const MAXIMO = 6;

const FILTROS: { valor: FiltroEstado; texto: string }[] = [
  { valor: "todos", texto: "Todo" },
  { valor: "nuevos", texto: "Nuevos" },
  { valor: "usados", texto: "Usados" },
];

// El parte de stock (DESIGN.md, "Parte de olas"): qué hay hoy, con la hora en que se leyó. Una
// tarjeta por modelo con su precio más bajo, las cuotas y las unidades que quedan; cada una lleva
// a la ficha con esa variante elegida. Los datos son los del back, nada escrito a mano.
export default function ParteDeStock() {
  const { productos, cargando, error, leidoA } = useProductosHome();
  const [filtro, setFiltro] = useState<FiltroEstado>("todos");

  const todas = tarjetasDeModelos(productos ?? []);
  const tarjetas = tarjetasDeModelos(productos ?? [], filtro);
  const cuenta = (f: FiltroEstado) => tarjetasDeModelos(productos ?? [], f).length;
  // Los filtros sólo aparecen si hay de los dos estados: con uno solo no filtran nada.
  const hayDosEstados = cuenta("nuevos") > 0 && cuenta("usados") > 0;
  const unidades = todas.reduce((s, t) => s + t.unidades, 0);

  return (
    <section aria-labelledby="stock">
      <div className={seccion}>
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
          <div>
            <h2 id="stock" className={tituloSeccion}>
              En stock hoy
            </h2>
            <p className="mt-3 max-w-xl body-7 text-pretty text-tinta-suave">
              iPhones originales, nuevos sellados y usados revisados, listos para despachar.
            </p>
          </div>
          {leidoA && todas.length > 0 && (
            <p className="flex items-center gap-2 caption-1 tabular-nums text-tinta-suave">
              <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-exito" />
              {todas.length} {todas.length === 1 ? "modelo" : "modelos"}, {unidades}{" "}
              {unidades === 1 ? "unidad" : "unidades"}. Leído a las {leidoA}
            </p>
          )}
        </div>

        {hayDosEstados && (
          <div role="group" aria-label="Filtrar por estado" className="mt-8 flex flex-wrap gap-2">
            {FILTROS.map(({ valor, texto }) => {
              const activo = filtro === valor;
              return (
                <button
                  key={valor}
                  type="button"
                  onClick={() => setFiltro(valor)}
                  aria-pressed={activo}
                  className={`rounded-full px-4 py-3 caption-1 tabular-nums ring-inset transition-shadow duration-300 ease-ola ${
                    activo ? "text-color-principal ring-2 ring-color-principal" : "text-tinta ring-1 ring-borde-fuerte hover:ring-tinta-suave"
                  }`}
                >
                  {texto} <span className="text-tinta-suave">{cuenta(valor)}</span>
                </button>
              );
            })}
          </div>
        )}

        {cargando && (
          <ul aria-hidden="true" className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
            {[0, 1, 2].map((i) => (
              <li key={i} className={`rounded-panel bg-superficie p-3 md:p-6 ${i === 2 ? "hidden md:block" : ""}`}>
                <div className="aspect-square animate-pulse rounded-lg bg-borde motion-reduce:animate-none md:aspect-[4/3]" />
                <div className="mt-4 h-6 w-3/4 animate-pulse rounded-lg bg-borde motion-reduce:animate-none" />
                <div className="mt-2 h-5 w-1/2 animate-pulse rounded-lg bg-borde motion-reduce:animate-none" />
                <div className="mt-8 h-8 w-2/3 animate-pulse rounded-lg bg-borde motion-reduce:animate-none" />
                <div className="mt-4 h-12 animate-pulse rounded-lg bg-borde motion-reduce:animate-none" />
              </li>
            ))}
          </ul>
        )}

        {error && (
          <p className="mt-8 body-7 text-tinta">
            No pudimos leer el stock ahora.{" "}
            <Link href="/products" className={enlace}>
              Ver el catálogo
            </Link>
          </p>
        )}

        {!cargando && !error && todas.length === 0 && (
          <div className="mt-8 rounded-panel bg-superficie p-6 md:p-8">
            <p className="title-1 text-tinta">Hoy no hay iPhones en stock.</p>
            <p className="mt-2 body-3 text-tinta-suave">Dejanos tu contacto y te escribimos cuando entren.</p>
            <a href="#avisos" className={`${botonPrincipal} mt-6`}>
              Avisame cuando entren
            </a>
          </div>
        )}

        {tarjetas.length > 0 && (
          <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
            {tarjetas.slice(0, MAXIMO).map(({ producto, desde, unidades: quedan, estado, capacidades, colores }) => (
              <li key={producto.id}>
                <Link
                  href={`/products/${producto.id}?v=${desde.id}`}
                  className="group flex h-full flex-col rounded-panel bg-superficie p-3 transition-colors duration-300 ease-ola hover:bg-borde md:p-6"
                >
                  <div className="relative aspect-square md:aspect-[4/3]">
                    {/* mix-blend-multiply: el fondo blanco de las fotos se funde con el panel gris. */}
                    <Image
                      src={desde.imagenes?.[0] ?? producto.imagenes?.[0] ?? "/placeholder.png"}
                      alt=""
                      fill
                      sizes="(min-width: 1152px) 352px, (min-width: 768px) 33vw, 50vw"
                      className="object-contain p-2 mix-blend-multiply transition-transform duration-500 ease-ola group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span
                      className={`rounded-lg px-2 py-1 caption-1 ${
                        estado === "Usado" ? "bg-white text-tinta" : "bg-principal-suave text-color-principal"
                      }`}
                    >
                      {estado}
                    </span>
                    {quedan <= 3 && (
                      <span className="rounded-lg bg-white px-2 py-1 caption-1 tabular-nums text-tinta">
                        {quedan === 1 ? "Queda 1" : `Quedan ${quedan}`}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 body-1 text-tinta md:heading-6">{producto.nombre}</h3>
                  <p className="mt-1 caption-2 text-tinta-suave">{resumenDeOpciones(capacidades, colores)}</p>
                  <p className="mt-auto pt-4 caption-2 text-tinta-suave">Desde</p>
                  <p className="heading-6 tabular-nums text-tinta md:heading-5">{formatearPrecio(desde.precio)}</p>
                  <p className="mt-1 caption-2 text-tinta-suave">{textoCuotas(desde.precio)}</p>
                  {/* Toda la tarjeta es el link: el botón es su parte visible. */}
                  <span className="mt-4 rounded-lg bg-white px-3 py-3 text-center button-sm text-tinta ring-1 ring-inset ring-borde-fuerte transition-colors duration-300 ease-ola group-hover:bg-color-principal group-hover:text-white group-hover:ring-color-principal md:rounded-control md:button-md">
                    Comprar
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {todas.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link href="/products" className={`${botonPrincipal} w-full sm:w-auto`}>
              {todas.length > MAXIMO ? `Ver los ${todas.length} modelos` : "Ver todo el catálogo"}
            </Link>
            <Link href="/accesorios" className={`body-2 ${enlace}`}>
              Ver accesorios
            </Link>
            <Link href="/compare" className={`body-2 ${enlace}`}>
              Comparar modelos
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
