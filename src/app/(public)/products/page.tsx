import { Suspense } from "react";
import type { Metadata } from "next";
import ProductsContent from "./ProductsContent";

export const metadata: Metadata = {
  title: "Catálogo | Wave ARG",
  description: "Explorá nuestra selección de iPhones y accesorios. Equipos nuevos y usados con garantía.",
};

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center">
          <div className="inline-flex flex-col items-center gap-3 text-gray-500">
            <div className="w-8 h-8 border-4 border-color-principal border-t-transparent rounded-full animate-spin" />
            <span className="font-medium text-sm">Cargando catálogo...</span>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
