"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { getProductos } from "@/lib/api";
import { Producto } from "@/interfaces/producto";
import ProductCard from "@/components/ProductCards";
import FilterSidebar from "@/components/FilterSide";

/** Convierte "iPhone 15 Pro" → "iphone-15-pro" para coincidir con la URL */
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/** Normaliza memoria para comparar (ej: "128GB" o "128 GB" → "128gb") */
function normalizeMemoria(mem: string): string {
  return mem.toLowerCase().replace(/\s/g, "");
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getProductos();
        setProducts(data);
      } catch (err) {
        console.error("Error cargando productos:", err);
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
          memoria.includes(normalizeMemoria(v.memoria))
        );
        if (!matchMemoria) return false;
      }

      return true;
    });
  }, [products, searchParams]);

  if (loading)
    return (
      <div className="p-20 text-center font-bold">
        Conectando con el backend...
      </div>
    );
  if (error)
    return <div className="p-20 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 pb-32">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#05467D]">Nuestro Catálogo</h1>
        <p className="text-gray-500">
          {filteredProducts.length === products.length
            ? `${products.length} productos disponibles`
            : `${filteredProducts.length} de ${products.length} productos`}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64">
          <FilterSidebar />
        </aside>

        <main className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg font-medium mb-2">Ningún producto coincide con los filtros</p>
              <p className="text-sm">Probá cambiar o limpiar los filtros.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
