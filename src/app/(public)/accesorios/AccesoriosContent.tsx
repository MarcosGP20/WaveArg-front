"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { AccesoriosService } from "@/lib/api";
import { Accesorio } from "@/interfaces/accesorio";
import AccesorioCard from "@/components/AccesorioCard";
import FilterSidebar from "@/components/FilterSide";
import { SlidersHorizontal, X, Package } from "lucide-react";
import Link from "next/link";

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

  const activeFilterCount = useMemo(() => {
    let count = 0;
    for (const key of ["estado", "memoria", "modelo", "familia"]) {
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

      return true;
    });
  }, [products, searchParams]);

  if (loading)
    return (
      <div className="p-20 text-center">
        <div className="inline-flex flex-col items-center gap-3 text-gray-500">
          <div className="w-8 h-8 border-4 border-color-principal border-t-transparent rounded-full animate-spin" />
          <span className="font-medium text-sm">Conectando con el servidor...</span>
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
          <h1 className="text-3xl font-bold text-color-principal">Nuestro Catálogo</h1>
          <p className="text-gray-500 text-sm mt-1">
            {filteredProducts.length === products.length
              ? `${products.length} accesorios disponibles`
              : `${filteredProducts.length} de ${products.length} accesorios`}
          </p>
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
        <aside
          id="filter-sidebar"
          className={`w-full lg:w-64 lg:block ${
            showFilters ? "block" : "hidden"
          }`}
        >
          <FilterSidebar mode="accesorios" />
        </aside>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <AccesorioCard key={product.id} accesorio={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
