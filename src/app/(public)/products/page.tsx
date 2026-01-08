"use client";

import { useEffect, useState } from "react";
import { getProductos } from "@/lib/api"; // <-- Importamos tu función
import { Producto } from "@/interfaces/producto";
import ProductCard from "@/components/ProductCards";
import FilterSidebar from "@/components/FilterSide";

export default function ProductsPage() {
  const [products, setProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Definimos la función de carga
    const loadData = async () => {
      try {
        setLoading(true);
        // LLAMADA A TU FUNCIÓN DE api.ts
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
  }, []); // [] significa que solo se ejecuta una vez al cargar la página

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
        <p className="text-gray-500">{products.length} productos disponibles</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64">
          <FilterSidebar />
        </aside>

        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
