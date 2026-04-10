"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { getProductos, AccesoriosService } from "@/lib/api";
import { Producto } from "@/interfaces/producto";
import { Accesorio, CATEGORIA_LABELS, CategoriaAccesorio } from "@/interfaces/accesorio";
import ProductCard from "@/components/ProductCards";
import AccesorioCard from "@/components/AccesorioCard";
import FilterSidebar from "@/components/FilterSide";
import { SlidersHorizontal, X, Package, Smartphone } from "lucide-react";
import Link from "next/link";

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

  // Filtro de categoría para accesorios (en la URL como ?cat=0,1,2)
  const catParam = searchParams.get("cat");
  const categoriasActivas: number[] = catParam
    ? catParam.split(",").map(Number).filter((n) => !isNaN(n))
    : [];

  // Badge de filtros activos
  const activeFilterCount = useMemo(() => {
    let count = 0;
    for (const key of ["estado", "memoria", "modelo", "familia", "cat"]) {
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
      <div className="p-20 text-center">
        <div className="inline-flex flex-col items-center gap-3 text-gray-500">
          <div className="w-8 h-8 border-4 border-color-principal border-t-transparent rounded-full animate-spin" />
          <span className="font-medium text-sm">Conectando con el servidor...</span>
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
          <h1 className="text-3xl font-bold text-color-principal">Nuestro Catálogo</h1>
          <p className="text-gray-500 text-sm mt-1">
            {filteredProducts.length} iPhone{filteredProducts.length !== 1 ? "s" : ""} ·{" "}
            {filteredAccesorios.length} accesorio{filteredAccesorios.length !== 1 ? "s" : ""}
          </p>
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
        {/* Sidebar */}
        <aside
          id="filter-sidebar"
          className={`w-full lg:w-64 lg:block ${showFilters ? "block" : "hidden"}`}
        >
          <FilterSidebar />
        </aside>

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
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredAccesorios.map((acc) => (
                    <AccesorioCard key={acc.id} accesorio={acc} />
                  ))}
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
