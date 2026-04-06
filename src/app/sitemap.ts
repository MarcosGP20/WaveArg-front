import type { MetadataRoute } from "next";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5075/api";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wavearg.com.ar";

const STATIC_ROUTES = [
  { url: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { url: "/products", priority: 0.9, changeFrequency: "daily" as const },
  { url: "/accesorios", priority: 0.9, changeFrequency: "daily" as const },
  { url: "/nosotros", priority: 0.6, changeFrequency: "monthly" as const },
  { url: "/contacto", priority: 0.6, changeFrequency: "monthly" as const },
  { url: "/creadores", priority: 0.7, changeFrequency: "monthly" as const },
];

async function fetchIds(endpoint: string): Promise<number[]> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.map((item: { id: number }) => item.id) : [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productoIds, accesorioIds] = await Promise.all([
    fetchIds("/Productos"),
    fetchIds("/Accesorios"),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ url, priority, changeFrequency }) => ({
    url: `${SITE_URL}${url}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  const productoEntries: MetadataRoute.Sitemap = productoIds.map((id) => ({
    url: `${SITE_URL}/products/${id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const accesorioEntries: MetadataRoute.Sitemap = accesorioIds.map((id) => ({
    url: `${SITE_URL}/accesorios/${id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...productoEntries, ...accesorioEntries];
}
