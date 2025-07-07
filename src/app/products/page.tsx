"use client";

import ProductCard from "@/components/ProductCards";
import { products } from "@/lib/mock/products";
import { useCompare } from "@/context/CompareContext";
import CompareBar from "@/components/CompareBar";

export default function ProductsPage() {
  const { modoComparacion, setModoComparacion } = useCompare();

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-center">Catálogo de iPhones</h1>

      {!modoComparacion && (
        <div className="text-center">
          <button
            onClick={() => setModoComparacion(true)}
            className="bg-[#05467D] text-white px-5 py-2 rounded hover:bg-[#0F3C64] transition"
          >
            ¿Querés comparar modelos?
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
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
      <CompareBar />
    </div>
  );
}
