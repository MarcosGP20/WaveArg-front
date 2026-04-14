import type { Metadata } from "next";
import type { Accesorio } from "@/interfaces/accesorio";
import AccesorioDetailContent from "./AccesorioDetailContent";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5075/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${API_BASE}/Accesorios/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { title: "Accesorio | Wave ARG" };
    const accesorio: Accesorio = await res.json();
    const title = `${accesorio.nombre} | Wave ARG`;
    const description =
      accesorio.descripcion?.trim() ||
      `Comprá ${accesorio.nombre} en Wave ARG. Accesorios para iPhone con garantía.`;
    const image = accesorio.imagenes?.[0];
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
    return { title: "Accesorio | Wave ARG" };
  }
}

export default function AccesorioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <AccesorioDetailContent params={params} />;
}
