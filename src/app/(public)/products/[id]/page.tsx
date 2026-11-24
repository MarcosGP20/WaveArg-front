import type { Metadata } from "next";
import type { Producto } from "@/interfaces/producto";
import ProductDetailContent from "./ProductDetailContent";

import { BACKEND_API_BASE } from "@/lib/backend";

// Misma request que generateMetadata: Next la deduplica, así que la página no pega dos veces.
async function getProducto(id: string): Promise<Producto | null> {
  try {
    const res = await fetch(`${BACKEND_API_BASE}/Productos/${id}`, {
      next: { revalidate: 3600 },
    });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const producto = await getProducto(id);
  if (!producto) return { title: "Producto | Wave ARG" };
  const title = `${producto.nombre} | Wave ARG`;
  const description =
    producto.descripcion?.trim() ||
    `Comprá ${producto.nombre} en Wave ARG. iPhones nuevos y usados con garantía.`;
  const image = producto.imagenes?.[0];
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(image ? { images: [{ url: image }] } : {}),
    },
  };
}

// Datos estructurados (schema.org Product): una oferta por variante, con su estado y stock, para
// que Google muestre precio y disponibilidad reales.
function productoJsonLd(producto: Producto) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: producto.nombre,
    description: producto.descripcion || undefined,
    image: producto.imagenes,
    brand: { "@type": "Brand", name: "Apple" },
    offers: producto.variantes.map((v) => ({
      "@type": "Offer",
      name: `${producto.nombre} ${v.memoria} ${v.color}${v.esUsado ? " usado" : ""}`,
      price: v.precio,
      priceCurrency: "ARS",
      itemCondition: v.esUsado ? "https://schema.org/UsedCondition" : "https://schema.org/NewCondition",
      availability: v.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Wave ARG" },
    })),
  };
}

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [{ id }, { v }] = await Promise.all([params, searchParams]);
  const producto = await getProducto(id);
  return (
    <>
      {producto && (
        <script
          type="application/ld+json"
          // "<" escapado: un nombre o descripción con "</script>" no puede cortar la etiqueta.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productoJsonLd(producto)).replace(/</g, "\\u003c") }}
        />
      )}
      <ProductDetailContent params={params} varianteDelLink={typeof v === "string" ? v : undefined} />
    </>
  );
}
