import type { Metadata } from "next";
import type { Producto } from "@/interfaces/producto";
import ProductDetailContent from "./ProductDetailContent";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5075/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${API_BASE}/Productos/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { title: "Producto | Wave ARG" };
    const producto: Producto = await res.json();
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
  } catch {
    return { title: "Producto | Wave ARG" };
  }
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <ProductDetailContent params={params} />;
}
