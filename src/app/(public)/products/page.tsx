"use client";

import { useSearchParams } from "next/navigation"; // 1. Importamos el hook
import Link from "next/link";
import ProductCard from "@/components/ProductCards";
import { products } from "@/lib/mock/products";
import { useCompare } from "@/context/CompareContext";
import CompareBar from "@/components/CompareBar";

export default function ProductsPage() {
  const { modoComparacion } = useCompare(); // Simplifiqué esto si no usas setModoComparacion acá

  // 2. Leemos los parámetros de la URL
  const searchParams = useSearchParams();
  const familiaFilter = searchParams.get("familia"); // ej: 'iphone-14'
  const modeloFilter = searchParams.get("modelo"); // ej: 'pro'

  // 3. Lógica de Filtrado
  const filteredProducts = products.filter((product) => {
    // Si hay filtro de familia Y no coincide, lo sacamos
    if (familiaFilter && product.familiaSlug !== familiaFilter) return false;

    // Si hay filtro de modelo Y no coincide, lo sacamos
    if (modeloFilter && product.modeloSlug !== modeloFilter) return false;

    return true; // Si pasa los filtros (o no hay filtros), se queda
  });

  // Helper para saber si hay algún filtro activo
  const hayFiltrosActivos = familiaFilter || modeloFilter;

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col items-center justify-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-[#05467D] text-center">
          {hayFiltrosActivos
            ? "Resultados de tu búsqueda"
            : "Conocé nuestros productos"}
        </h1>

        {/* 4. Botón de Reset (Solo aparece si hay filtros) */}
        {hayFiltrosActivos && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-gray-600 text-sm">
              Filtro: <span className="font-semibold">{familiaFilter}</span>
              {modeloFilter && <span> / {modeloFilter}</span>}
            </p>

            <Link
              href="/products"
              className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-full transition-colors flex items-center gap-2"
            >
              ✕ Volver al catálogo entero
            </Link>
          </div>
        )}
      </div>

      {/* 5. Renderizado Condicional */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              nombre={product.nombre}
              color={product.color}
              memoria={product.memoria}
              precio={product.precio}
              image={product.image}
              slug={product.slug}
              product={product}
            />
          ))}
        </div>
      ) : (
        // Estado vacío (Empty State)
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">
            No encontramos productos con esas características.
          </p>
          <Link
            href="/products"
            className="text-blue-600 hover:underline mt-4 block"
          >
            Ver todos los productos
          </Link>
        </div>
      )}

      <CompareBar />
    </div>
  );
}
