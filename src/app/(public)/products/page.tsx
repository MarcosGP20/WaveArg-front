import { Suspense } from "react";
import ProductsContent from "./ProductsContent";

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center">
          <div className="inline-flex flex-col items-center gap-3 text-gray-500">
            <div className="w-8 h-8 border-4 border-[#05467D] border-t-transparent rounded-full animate-spin" />
            <span className="font-medium text-sm">Cargando catálogo...</span>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
