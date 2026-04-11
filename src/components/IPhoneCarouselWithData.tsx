"use client";

import { useState, useEffect } from "react";
import IPhoneCarousel, { CarouselItem } from "./IPhoneCarousel";
import { getProductos } from "@/lib/api";
import type { Producto } from "@/interfaces/producto";

/**
 * Wrapper client-side que fetchea productos de la API
 * y renderiza el IPhoneCarousel.
 *
 * Ideal para usar en Server Components (como /creadores)
 * que no pueden hacer fetch client-side directamente.
 */

function toSpecs(p: Producto): CarouselItem["specs"] {
  const name = p.nombre.toLowerCase();
  const specs: CarouselItem["specs"] = [];

  if (name.includes("pro")) {
    specs.push({ icon: "📷", label: "Cámara 48MP Fusion" });
  } else {
    specs.push({ icon: "📷", label: "Cámara 12MP avanzada" });
  }

  if (name.includes("pro max")) {
    specs.push({ icon: "🎬", label: "4K 120fps ProRes" });
  } else if (name.includes("pro")) {
    specs.push({ icon: "🎥", label: "Video ProRes 4K" });
  } else {
    specs.push({ icon: "🎥", label: "Video Dolby Vision HDR" });
  }

  specs.push({ icon: "⚡", label: "5G + Face ID" });
  return specs;
}

function toCarouselItem(p: Producto): CarouselItem {
  const hasStock = p.variantes.some((v) => v.stock > 0);
  return {
    id: p.id,
    model: p.nombre,
    description: p.descripcion,
    image: p.imagenes?.[0] ?? "",
    badge: hasStock ? "En stock" : null,
    specs: toSpecs(p),
    href: `/products/${p.id}`,
  };
}

export default function IPhoneCarouselWithData() {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductos()
      .then((productos) => setItems(productos.map(toCarouselItem)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-[90%] max-w-6xl mx-auto w-full rounded-2xl border border-gray-100 shadow-md overflow-hidden flex flex-col md:flex-row min-h-[360px] md:min-h-[500px] animate-pulse">
        <div className="md:w-[42%] bg-gray-100 min-h-[260px] md:min-h-0" />
        <div className="md:w-[58%] flex flex-col justify-center gap-4 px-7 py-8 md:px-12 md:py-12 bg-white">
          <div className="h-3 w-16 bg-gray-200 rounded-full" />
          <div className="h-7 w-48 bg-gray-200 rounded-full" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-100 rounded-full" />
            <div className="h-4 w-4/5 bg-gray-100 rounded-full" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="h-7 w-28 bg-gray-100 rounded-full" />
            <div className="h-7 w-24 bg-gray-100 rounded-full" />
            <div className="h-7 w-20 bg-gray-100 rounded-full" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-full" />
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="w-[90%] max-w-6xl mx-auto w-full">
      <IPhoneCarousel items={items} />
    </div>
  );
}
