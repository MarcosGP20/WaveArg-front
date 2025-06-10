import ProductCard from "@/components/ProductCards";
import { products } from "@/lib/mock/products";

export default function ProductsPage() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-center">Catálogo de iPhones</h1>
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
          />
        ))}
      </div>
    </div>
  );
}
