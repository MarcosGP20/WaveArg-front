"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AccesoriosService } from "@/lib/api";
import { Accesorio } from "@/interfaces/accesorio";
import AccesorioCard from "@/components/AccesorioCard";
import FilterSidebar from "@/components/FilterSide";
import { SlidersHorizontal, X, Package } from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const cardGrid = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function normalizeMemoria(mem: string): string {
  return mem.toLowerCase().replace(/\s/g, "");
}

export default function AccesoriosContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Accesorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Rango de precios derivado de los accesorios cargados
  const priceRange = useMemo(() => {
    const all = products.flatMap(
      (p) => p.variantes?.map((v) => v.precio).filter((p) => p > 0) ?? []
    );
    if (all.length === 0) return undefined;
    return { min: Math.min(...all), max: Math.max(...all) };
  }, [products]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    for (const key of ["estado", "memoria", "modelo", "familia", "precioMin", "precioMax"]) {
      if (searchParams.get(key)) count++;
    }
    return count;
  }, [searchParams]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await AccesoriosService.getAll(true);
        setProducts(data);
      } catch (err) {
        setError("No se pudieron obtener los productos de la base de datos.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    const estado = searchParams.get("estado")?.split(",").filter(Boolean) ?? [];
    const memoria =
      searchParams.get("memoria")?.split(",").map((m) => m.trim().toLowerCase()).filter(Boolean) ?? [];
    const modelo =
      searchParams.get("modelo")?.split(",").map((m) => m.trim().toLowerCase()).filter(Boolean) ?? [];
    const familia = searchParams.get("familia")?.trim().toLowerCase();

    return products.filter((product) => {
      const slug = toSlug(product.nombre);

      if (familia && !slug.startsWith(familia)) return false;

      if (modelo.length > 0) {
        const matchModelo = modelo.some(
          (m) => slug === m || (familia && slug === `${familia}-${m}`)
        );
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
        const matchMemoria = product.variantes?.some((v) =>
          memoria.includes(normalizeMemoria(v.especificacion))
        );
        if (!matchMemoria) return false;
      }

      const precioMin = searchParams.get("precioMin") ? Number(searchParams.get("precioMin")) : null;
      const precioMax = searchParams.get("precioMax") ? Number(searchParams.get("precioMax")) : null;
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
                  <div className="h-3 bg-gray-100 rounded-full w-1/2 mx-auto" />
                  <div className="h-3 bg-gray-100 rounded-full w-3/4 mx-auto" />
                  <div className="h-7 bg-gray-200 rounded-full w-1/3 mx-auto" />
                  <div className="h-10 bg-gray-200 rounded-full mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  if (error)
    return <div className="p-20 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 pb-32">
      {/* Cabecera: título + botón filtros (mobile) */}
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
            {filteredProducts.length === products.length
              ? `${products.length} accesorios disponibles`
              : `${filteredProducts.length} de ${products.length} accesorios`}
          </motion.p>
        </div>

        <button
          onClick={() => setShowFilters((v) => !v)}
          className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm text-sm font-medium text-gray-700 hover:border-color-principal hover:text-color-principal transition-colors"
          aria-expanded={showFilters}
          aria-controls="filter-sidebar"
        >
          {showFilters ? (
            <X size={16} />
          ) : (
            <SlidersHorizontal size={16} />
          )}
          Filtros
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-color-principal text-white text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar — solo desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar mode="accesorios" priceRange={priceRange} />
        </aside>

        {/* Bottom sheet — solo mobile */}
        {showFilters && (
          <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowFilters(false)}
            />
            <div className="relative bg-white rounded-t-3xl max-h-[88vh] flex flex-col animate-slideUp">
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
              <div className="overflow-y-auto flex-1 px-5 py-4">
                <FilterSidebar mode="accesorios" priceRange={priceRange} flat />
              </div>
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

        <main className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-gray-400">
              <Package size={48} className="text-gray-200" />
              <div className="text-center">
                <p className="font-medium text-gray-600">Ningún accesorio coincide con los filtros</p>
                <p className="text-sm mt-1">Probá cambiar o limpiar los filtros.</p>
              </div>
              <Link
                href="/accesorios"
                className="mt-2 px-5 py-2 bg-color-principal text-white text-sm font-medium rounded-full hover:bg-color-principal-oscuro transition-colors"
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
                  <AccesorioCard accesorio={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
