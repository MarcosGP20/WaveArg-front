import { Suspense } from "react";
import type { Metadata } from "next";
import CatalogoEsqueleto from "./CatalogoEsqueleto";
import ProductsContent from "./ProductsContent";

export const metadata: Metadata = {
  title: "iPhones y accesorios en stock | Wave Arg",
  description:
    "iPhones nuevos sellados y usados revisados, con 3 meses de garantía y envío a todo el país. Filtrá por precio, capacidad y estado.",
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<CatalogoEsqueleto />}>
      <ProductsContent />
    </Suspense>
  );
}
