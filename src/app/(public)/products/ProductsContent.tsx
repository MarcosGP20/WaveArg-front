"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Plus } from "lucide-react";
import AccesorioCard from "@/components/AccesorioCard";
import FilterSidebar from "@/components/FilterSide";
import FiltrosMovil from "@/components/FiltrosMovil";
import TarjetaDeModelo from "@/components/TarjetaDeModelo";
import { botonPrincipal, enlace } from "@/components/home/estilos";
import { useCompare } from "@/context/CompareContext";
import { Accesorio, CATEGORIA_LABELS } from "@/interfaces/accesorio";
import { Producto } from "@/interfaces/producto";
import { AccesoriosService, getProductos } from "@/lib/api";
import { leerFiltros, opcionesDeFiltro, tarjetasDelCatalogo, type Orden } from "@/lib/catalogo";
import CatalogoEsqueleto from "./CatalogoEsqueleto";

const MAXIMO_A_COMPARAR = 3;
const CLAVE_DESTACADO = "wave-featured-product-id";

const ORDENES: { valor: Orden; texto: string }[] = [
  { valor: "predeterminado", texto: "Predeterminado" },
  { valor: "precio-asc", texto: "Menor precio" },
  { valor: "precio-desc", texto: "Mayor precio" },
];

// El destacado lo elige el admin y queda en su navegador (ver CLAUDE.md): sólo lo ve él.
function useDestacado(): number | null {
  const valor = useSyncExternalStore(
    () => () => {},
    () => {
      try {
        return localStorage.getItem(CLAVE_DESTACADO);
      } catch {
        return null;
      }
    },
    () => null,
  );
  return valor ? Number(valor) : null;
}

// Catálogo: una tarjeta por modelo con el precio de lo que se filtró. Filtros y orden viven en la
// URL (lib/catalogo.ts), así se pueden compartir y el botón Atrás los deshace.
export default function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toggleCompare, compareList } = useCompare();
  const destacadoId = useDestacado();

  const [products, setProducts] = useState<Producto[]>([]);
  const [accesorios, setAccesorios] = useState<Accesorio[]>([]);
  const [estado, setEstado] = useState<"cargando" | "listo" | "error">("cargando");

  const cargar = useCallback(async () => {
    setEstado("cargando");
    const [productosData, accesoriosData] = await Promise.allSettled([getProductos(), AccesoriosService.getAll(true)]);
    // Sin iPhones no hay catálogo; sin accesorios, la página sigue sin esa sección.
    if (productosData.status === "rejected") {
      setEstado("error");
      return;
    }
    setProducts(productosData.value);
    setAccesorios(accesoriosData.status === "fulfilled" ? accesoriosData.value : []);
    setEstado("listo");
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos
    cargar();
  }, [cargar]);

  const filtros = useMemo(() => leerFiltros(searchParams), [searchParams]);
  const tarjetas = useMemo(() => tarjetasDelCatalogo(products, filtros), [products, filtros]);
  const opciones = useMemo(() => opcionesDeFiltro(products), [products]);

  // Filtro de categoría para accesorios (en la URL como ?cat=0,1,2)
  const categoriasActivas = useMemo(
    () => (searchParams.get("cat")?.split(",").map(Number).filter((n) => !isNaN(n)) ?? []),
    [searchParams],
  );
  const accesoriosFiltrados = useMemo(
    () => (categoriasActivas.length === 0 ? accesorios : accesorios.filter((a) => categoriasActivas.includes(a.categoria))),
    [accesorios, categoriasActivas],
  );

  const filtrosActivos = ["estado", "memoria", "modelo", "familia", "cat", "precioMin", "precioMax"].filter((clave) =>
    searchParams.get(clave),
  ).length;
  const hayFiltrosDeIphone = ["estado", "memoria", "modelo", "familia", "precioMin", "precioMax"].some((clave) =>
    searchParams.get(clave),
  );

  const conParametro = (clave: string, valor: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (valor) params.set(clave, valor);
    else params.delete(clave);
    const query = params.toString();
    return query ? `/products?${query}` : "/products";
  };

  if (estado === "cargando") return <CatalogoEsqueleto />;

  if (estado === "error")
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <h1 className="heading-4 text-tinta md:heading-3">No pudimos cargar el catálogo</h1>
        <p className="mt-3 body-7 text-tinta-suave">Puede ser la conexión. Probá de nuevo en un momento.</p>
        <button type="button" onClick={cargar} className={`${botonPrincipal} mt-8`}>
          Reintentar
        </button>
      </div>
    );

  const filtrosDeIphone = (
    <FilterSidebar priceRange={opciones.precio} memorias={opciones.memorias} modelos={opciones.modelos} flat />
  );

  return (
    // pb-32: lugar para la barra de comparación, que es fija abajo.
    <div className="mx-auto max-w-6xl px-4 py-8 pb-32 text-tinta md:py-12 md:pb-32">
      {/* ── Encabezado ── */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="heading-4 md:heading-3">Catálogo</h1>
          <p className="mt-2 body-3 text-tinta-suave" role="status">
            {tarjetas.length} {tarjetas.length === 1 ? "modelo de iPhone" : "modelos de iPhone"}
            {accesoriosFiltrados.length > 0 &&
              ` y ${accesoriosFiltrados.length} ${accesoriosFiltrados.length === 1 ? "accesorio" : "accesorios"}`}{" "}
            en stock
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <FiltrosMovil activeFilterCount={filtrosActivos} resultados={tarjetas.length}>
            {filtrosDeIphone}
          </FiltrosMovil>
          <label className="flex items-center gap-2 body-5 text-tinta-suave">
            Ordenar
            <select
              value={filtros.orden}
              onChange={(e) =>
                router.replace(conParametro("orden", e.target.value === "predeterminado" ? null : e.target.value), { scroll: false })
              }
              className="rounded-control border border-borde-fuerte bg-white py-3 pl-3 pr-8 body-5 text-tinta transition-colors duration-300 hover:border-tinta-suave"
            >
              {ORDENES.map(({ valor, texto }) => (
                <option key={valor} value={valor}>
                  {texto}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* ── Filtros y resultados ── */}
      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <div className="hidden w-64 flex-shrink-0 lg:block">
          <FilterSidebar priceRange={opciones.precio} memorias={opciones.memorias} modelos={opciones.modelos} />
        </div>

        <div className="min-w-0 flex-1 space-y-16">
          <section aria-labelledby="catalogo-iphones">
            <h2 id="catalogo-iphones" className="heading-6 md:heading-5">
              iPhone
            </h2>

            {tarjetas.length === 0 ? (
              <div className="mt-4 rounded-panel bg-superficie p-6 md:p-8">
                <p className="title-1">
                  {hayFiltrosDeIphone ? "Ningún iPhone coincide con los filtros." : "Hoy no hay iPhones en stock."}
                </p>
                <p className="mt-2 body-3 text-tinta-suave">
                  {hayFiltrosDeIphone
                    ? "Probá sacando alguno, o dejanos tu contacto y te avisamos cuando entre."
                    : "Dejanos tu contacto y te escribimos cuando entren."}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
                  {hayFiltrosDeIphone ? (
                    <Link href="/products" scroll={false} className={botonPrincipal}>
                      Limpiar filtros
                    </Link>
                  ) : null}
                  <Link href="/#avisos" className={hayFiltrosDeIphone ? `body-2 ${enlace}` : botonPrincipal}>
                    Avisame cuando entre
                  </Link>
                </div>
              </div>
            ) : (
              <ul className="mt-4 grid grid-cols-2 gap-3 md:gap-6 xl:grid-cols-3">
                {tarjetas.map((tarjeta) => {
                  const { producto } = tarjeta;
                  const elegido = compareList.some((p) => p.id === producto.id);
                  const lleno = !elegido && compareList.length >= MAXIMO_A_COMPARAR;
                  return (
                    <li key={producto.id}>
                      <TarjetaDeModelo tarjeta={tarjeta} destacado={destacadoId === producto.id}>
                        <button
                          type="button"
                          onClick={() => toggleCompare(producto)}
                          disabled={lleno}
                          aria-pressed={elegido}
                          aria-label={`Comparar ${producto.nombre}`}
                          className={`flex w-full items-center justify-center gap-2 rounded-lg py-3 caption-1 transition-colors duration-300 disabled:cursor-not-allowed disabled:text-tinta-suave md:rounded-control ${
                            elegido ? "text-color-principal" : "text-tinta-suave enabled:hover:text-tinta"
                          }`}
                        >
                          {elegido ? (
                            <Check size={16} strokeWidth={1.75} aria-hidden="true" />
                          ) : (
                            <Plus size={16} strokeWidth={1.75} aria-hidden="true" />
                          )}
                          {elegido ? "En comparación" : lleno ? `Máximo ${MAXIMO_A_COMPARAR}` : "Comparar"}
                        </button>
                      </TarjetaDeModelo>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {accesorios.length > 0 && (
            <section aria-labelledby="catalogo-accesorios">
              <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
                <h2 id="catalogo-accesorios" className="heading-6 md:heading-5">
                  Accesorios
                </h2>
                <Link href="/accesorios" className={`body-5 ${enlace}`}>
                  Ver todos los accesorios
                </Link>
              </div>

              {/* Categorías: sólo las que tienen algo */}
              <div role="group" aria-label="Filtrar accesorios por categoría" className="mt-4 flex flex-wrap gap-2">
                {Object.entries(CATEGORIA_LABELS).map(([val, label]) => {
                  const numVal = Number(val);
                  if (!accesorios.some((a) => a.categoria === numVal)) return null;
                  const activa = categoriasActivas.includes(numVal);
                  const siguientes = activa ? categoriasActivas.filter((c) => c !== numVal) : [...categoriasActivas, numVal];
                  return (
                    <Link
                      key={val}
                      href={conParametro("cat", siguientes.join(",") || null)}
                      scroll={false}
                      aria-current={activa ? "true" : undefined}
                      className={`rounded-full px-4 py-3 caption-1 ring-inset transition-shadow duration-300 ease-ola ${
                        activa ? "text-color-principal ring-2 ring-color-principal" : "text-tinta ring-1 ring-borde-fuerte hover:ring-tinta-suave"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>

              {accesoriosFiltrados.length === 0 ? (
                <p className="mt-4 rounded-panel bg-superficie p-6 body-3 text-tinta-suave">No hay accesorios en esa categoría.</p>
              ) : (
                <ul className="mt-4 grid grid-cols-2 gap-3 md:gap-6 xl:grid-cols-3">
                  {accesoriosFiltrados.map((acc) => (
                    <li key={acc.id}>
                      <AccesorioCard accesorio={acc} titulo="h3" />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
