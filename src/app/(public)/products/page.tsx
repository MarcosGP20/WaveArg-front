"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCards"; // ⚠️ Chequea que el nombre del archivo coincida
import FilterSidebar from "@/components/FilterSide"; // Usamos el nuevo componente
import { products } from "@/lib/mock/products";
// import { useCompare } from "@/context/CompareContext"; // Si no usas variables de esto acá, podes comentarlo
import CompareBar from "@/components/CompareBar";

export default function ProductsPage() {
  // 1. Leemos los parámetros de la URL
  const searchParams = useSearchParams();

  // Obtenemos los strings de la URL (ej: "iphone-13,iphone-14")
  const familiaParam = searchParams.get("familia");
  const modeloParam = searchParams.get("modelo");
  const estadoParam = searchParams.get("estado"); // Nuevo filtro
  const memoriaParam = searchParams.get("memoria"); // Nuevo filtro

  // 2. Lógica de Filtrado "Multi-Select"
  const filteredProducts = products.filter((product) => {
    // Filtro FAMILIA (ej: iPhone 13, iPhone 14)
    if (familiaParam) {
      const familias = familiaParam.split(",");
      if (!familias.includes(product.familiaSlug)) return false;
    }

    // Filtro MODELO (ej: Pro, Plus, Standard)
    if (modeloParam) {
      const modelos = modeloParam.split(",");
      if (!modelos.includes(product.modeloSlug)) return false;
    }

    // Filtro ESTADO (Nuevo vs Usado)
    if (estadoParam) {
      const estados = estadoParam.split(",");
      // Asegúrate que tu mock/products tenga la propiedad `estado`
      if (!estados.includes(product.estado)) return false;
    }

    // Filtro MEMORIA (128GB, 256GB...)
    if (memoriaParam) {
      const memorias = memoriaParam.split(",");
      // Convertimos a minúsculas por seguridad (128GB -> 128gb)
      if (!memorias.includes(product.memoria.toLowerCase())) return false;
    }

    return true; // Si pasa todos los checks, se muestra
  });

  return (
    <div className="container mx-auto px-4 py-8 pb-32">
      {" "}
      {/* pb-32 para dar espacio a la CompareBar */}
      {/* Título Principal */}
      <div className="mb-8 text-center lg:text-left">
        <h1 className="text-3xl font-bold text-[#05467D]">
          {filteredProducts.length === products.length
            ? "Todos nuestros productos"
            : "Resultados de tu búsqueda"}
        </h1>
        <p className="text-gray-500 mt-2">
          {filteredProducts.length} productos encontrados
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* --- COLUMNA IZQUIERDA: FILTROS --- */}
        {/* 'hidden lg:block' oculta el sidebar en celular (puedes hacer un botón para mostrarlo en mobile luego) */}
        <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-4">
          <FilterSidebar />
        </aside>

        {/* --- COLUMNA DERECHA: GRILLA DE PRODUCTOS --- */}
        <main className="flex-1 w-full">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product} // Pasamos el objeto entero
                  // Props individuales por compatibilidad (si tu componente las pide)
                  className="w-full"
                />
              ))}
            </div>
          ) : (
            // Empty State (Sin resultados)
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-xl text-gray-500 font-medium mb-2">
                No encontramos productos con esos filtros.
              </p>
              <p className="text-sm text-gray-400 mb-6">
                Prueba desactivando alguna opción del menú lateral.
              </p>
              <Link
                href="/products"
                className="text-white bg-[#05467D] hover:bg-[#0F3C64] px-6 py-2 rounded-full transition-colors text-sm font-medium"
              >
                Limpiar todos los filtros
              </Link>
            </div>
          )}
        </main>
      </div>
      <CompareBar />
    </div>
  );
}
