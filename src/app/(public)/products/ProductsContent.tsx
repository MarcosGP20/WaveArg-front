"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { getProductos, AccesoriosService } from "@/lib/api";
import { Producto } from "@/interfaces/producto";
import { Accesorio, CATEGORIA_LABELS, CategoriaAccesorio } from "@/interfaces/accesorio";
import ProductCard from "@/components/ProductCards";
import AccesorioCard from "@/components/AccesorioCard";
import FilterSidebar from "@/components/FilterSide";
import { SlidersHorizontal, X, Package, Smartphone } from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const cardGrid = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

// ─── helpers ──────────────────────────────────────────────────────────────────

function toSlug(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function normalizeMemoria(mem: string): string {
  return mem.toLowerCase().replace(/\s/g, "");
}

// ─── componente ───────────────────────────────────────────────────────────────

export default function ProductsContent() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Producto[]>([]);
  const [accesorios, setAccesorios] = useState<Accesorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [featuredId, setFeaturedId] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("wave-featured-product-id");
    if (stored) setFeaturedId(Number(stored));
  }, []);

  // Filtro de categoría para accesorios (en la URL como ?cat=0,1,2)
  const catParam = searchParams.get("cat");
  const categoriasActivas: number[] = catParam
    ? catParam.split(",").map(Number).filter((n) => !isNaN(n))
    : [];

  // Rango de precios derivado de los productos cargados
  const priceRange = useMemo(() => {
    const all = products.flatMap(
      (p) => p.variantes?.map((v) => v.precio).filter((p) => p > 0) ?? []
    );
    if (all.length === 0) return undefined;
    return { min: Math.min(...all), max: Math.max(...all) };
  }, [products]);

  // Badge de filtros activos
  const activeFilterCount = useMemo(() => {
    let count = 0;
    for (const key of ["estado", "memoria", "modelo", "familia", "cat", "precioMin", "precioMax"]) {
      if (searchParams.get(key)) count++;
    }
    return count;
  }, [searchParams]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productosData, accesoriosData] = await Promise.allSettled([
          getProductos(),
          AccesoriosService.getAll(true),
        ]);
        if (productosData.status === "fulfilled") setProducts(productosData.value);
        if (accesoriosData.status === "fulfilled") setAccesorios(accesoriosData.value);
      } catch (err) {
        setError("No se pudo cargar el catálogo.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filtros para iPhones
  const filteredProducts = useMemo(() => {
    const estado = searchParams.get("estado")?.split(",").filter(Boolean) ?? [];
    const memoria = searchParams.get("memoria")?.split(",").map((m) => m.trim().toLowerCase()).filter(Boolean) ?? [];
    const modelo = searchParams.get("modelo")?.split(",").map((m) => m.trim().toLowerCase()).filter(Boolean) ?? [];
    const familia = searchParams.get("familia")?.trim().toLowerCase();
    const precioMin = searchParams.get("precioMin") ? Number(searchParams.get("precioMin")) : null;
    const precioMax = searchParams.get("precioMax") ? Number(searchParams.get("precioMax")) : null;

    return products.filter((product) => {
      const slug = toSlug(product.nombre);
      if (familia && !slug.startsWith(familia)) return false;
      if (modelo.length > 0) {
        const matchModelo = modelo.some((m) => slug === m || (familia && slug === `${familia}-${m}`));
        if (!matchModelo) return false;
      }
      if (estado.length > 0) {
        const matchEstado = product.variantes?.some((v) => {
          if (estado.includes("usado") && v.esUsado) return true;
          if (estado.includes("nuevo") && !v.esUsado) return true;
          return false;
        });
        if (!matchEstado) return false;
      }
      if (memoria.length > 0) {
        const matchMemoria = product.variantes?.some((v) => memoria.includes(normalizeMemoria(v.memoria)));
        if (!matchMemoria) return false;
      }
      if (precioMin !== null || precioMax !== null) {
        const matchPrecio = product.variantes?.some((v) => {
          if (precioMin !== null && v.precio < precioMin) return false;
          if (precioMax !== null && v.precio > precioMax) return false;
          return true;
        });
        if (!matchPrecio) return false;
      }
      return true;
    });
  }, [products, searchParams]);

  // Filtros para accesorios (solo por categoría)
  const filteredAccesorios = useMemo(() => {
    if (categoriasActivas.length === 0) return accesorios;
    return accesorios.filter((a) => categoriasActivas.includes(a.categoria));
  }, [accesorios, categoriasActivas]);

  if (loading)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-4 w-32 bg-gray-100 rounded-full animate-pulse" />
          </div>
          <div className="h-9 w-28 bg-gray-200 rounded-full animate-pulse lg:hidden" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar skeleton */}
          <div className="hidden lg:flex flex-col gap-3 w-64 flex-shrink-0">
            <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse" />
            {[75, 60, 80, 55, 70, 65].map((w, i) => (
              <div key={i} className="h-4 bg-gray-100 rounded-full animate-pulse" style={{ width: `${w}%` }} />
            ))}
            <div className="h-px bg-gray-100 my-2" />
            <div className="h-5 w-24 bg-gray-200 rounded-full animate-pulse" />
            {[65, 50, 72, 58].map((w, i) => (
              <div key={i} className="h-4 bg-gray-100 rounded-full animate-pulse" style={{ width: `${w}%` }} />
            ))}
          </div>

          {/* Cards skeleton */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 flex flex-col animate-pulse">
                <div className="h-52 bg-gray-200" />
                <div className="p-5 flex flex-col gap-3">
                  <div className="h-4 bg-gray-200 rounded-full w-2/3 mx-auto" />
                  <div className="h-3 bg-gray-100 rounded-full w-1/3 mx-auto" />
                  <div className="flex justify-center gap-2">
                    {[0, 1, 2].map((j) => (
                      <div key={j} className="w-6 h-6 rounded-full bg-gray-200" />
                    ))}
                  </div>
                  <div className="h-7 bg-gray-200 rounded-full w-1/3 mx-auto" />
                  <div className="h-10 bg-gray-200 rounded-full mt-1" />
                  <div className="h-10 bg-gray-100 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  if (error)
    return <div className="p-20 text-center text-red-500">{error}</div>;

  const hayFiltrosDeProducto = !!(
    searchParams.get("estado") ||
    searchParams.get("memoria") ||
    searchParams.get("modelo") ||
    searchParams.get("familia")
  );

  return (
    <div className="container mx-auto px-4 py-8 pb-32">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <motion.h1
            className="text-3xl font-bold text-color-principal"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            Nuestro Catálogo
          </motion.h1>
          <motion.p
            className="text-gray-500 text-sm mt-1"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {filteredProducts.length} iPhone{filteredProducts.length !== 1 ? "s" : ""} ·{" "}
            {filteredAccesorios.length} accesorio{filteredAccesorios.length !== 1 ? "s" : ""}
          </motion.p>
        </div>

        <button
          onClick={() => setShowFilters((v) => !v)}
          className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm text-sm font-medium text-gray-700 hover:border-color-principal hover:text-color-principal transition-colors"
          aria-expanded={showFilters}
          aria-controls="filter-sidebar"
        >
          {showFilters ? <X size={16} /> : <SlidersHorizontal size={16} />}
          Filtros
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-color-principal text-white text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Layout principal ─────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar — solo desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar priceRange={priceRange} />
        </aside>

        {/* Bottom sheet — solo mobile */}
        {showFilters && (
          <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowFilters(false)}
            />
            <div className="relative bg-white rounded-t-3xl max-h-[88vh] flex flex-col animate-slideUp">
              {/* Handle + header */}
              <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-gray-100 shrink-0">
                <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-10 h-1 bg-gray-200 rounded-full" />
                <span className="font-bold text-lg text-gray-900 mt-1">Filtros</span>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              {/* Scroll area */}
              <div className="overflow-y-auto flex-1 px-5 py-4">
                <FilterSidebar priceRange={priceRange} flat />
              </div>
              {/* CTA */}
              <div className="px-5 py-4 border-t border-gray-100 shrink-0">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-color-principal text-white py-3 rounded-full font-semibold text-sm hover:bg-color-principal-oscuro transition-colors"
                >
                  {activeFilterCount > 0
                    ? `Aplicar filtros (${activeFilterCount})`
                    : "Aplicar filtros"}
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 space-y-12">
          {/* ── SECCIÓN IPHONES ─────────────────────────────────────────── */}
          {!hayFiltrosDeProducto || filteredProducts.length > 0 ? (
            <section>
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-xl font-bold text-gray-800">iPhones</h2>
                <span className="text-xs bg-color-principal/10 text-color-principal font-semibold px-2.5 py-1 rounded-full">
                  {filteredProducts.length} disponibles
                </span>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 gap-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <Smartphone size={44} className="text-gray-200" />
                  <div className="text-center text-gray-500">
                    <p className="font-medium mb-1">Ningún iPhone coincide con los filtros</p>
                    <p className="text-sm">Probá cambiar o limpiar los filtros.</p>
                  </div>
                  <Link
                    href="/products"
                    className="px-5 py-2 bg-color-principal text-white text-sm font-medium rounded-full hover:bg-color-principal-oscuro transition-colors"
                  >
                    Limpiar filtros
                  </Link>
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                  variants={cardGrid}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredProducts.map((product) => (
                    <motion.div key={product.id} variants={fadeUp}>
                      <ProductCard product={product} featured={featuredId === product.id} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </section>
          ) : null}

          {/* ── SECCIÓN ACCESORIOS ──────────────────────────────────────── */}
          {accesorios.length > 0 && (
            <section>
              {/* Header de sección + filtros por categoría */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <div className="flex items-center gap-2">
                  <Package size={20} className="text-gray-600" />
                  <h2 className="text-xl font-bold text-gray-800">Accesorios</h2>
                  <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2.5 py-1 rounded-full">
                    {filteredAccesorios.length} disponibles
                  </span>
                </div>

                {/* Pills de categoría */}
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(CATEGORIA_LABELS).map(([val, label]) => {
                    const numVal = Number(val);
                    const isActive = categoriasActivas.includes(numVal);
                    const tieneItems = accesorios.some((a) => a.categoria === numVal);
                    if (!tieneItems) return null;

                    const buildHref = () => {
                      const params = new URLSearchParams(searchParams.toString());
                      if (isActive) {
                        const nextCats = categoriasActivas.filter((c) => c !== numVal);
                        nextCats.length > 0
                          ? params.set("cat", nextCats.join(","))
                          : params.delete("cat");
                      } else {
                        params.set("cat", [...categoriasActivas, numVal].join(","));
                      }
                      return `/products?${params.toString()}`;
                    };

                    return (
                      <a
                        key={val}
                        href={buildHref()}
                        className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${
                          isActive
                            ? "bg-color-principal text-white border-color-principal"
                            : "bg-white text-gray-600 border-gray-200 hover:border-color-principal hover:text-color-principal"
                        }`}
                      >
                        {label}
                      </a>
                    );
                  })}
                </div>
              </div>

              {filteredAccesorios.length === 0 ? (
                <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="font-medium">No hay accesorios en esa categoría</p>
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                  variants={cardGrid}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredAccesorios.map((acc) => (
                    <motion.div key={acc.id} variants={fadeUp}>
                      <AccesorioCard accesorio={acc} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
