"use client";

import Link from "next/link";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { Accesorio, AccesorioVariante, CATEGORIA_LABELS } from "@/lib/api";

type AccesorioCardProps = {
  accesorio: Accesorio;
  className?: string;
};

function mapColorToHex(color: string): string {
  const map: Record<string, string> = {
    Negro: "#1a1a1a",
    Blanco: "#f5f5f7",
    Azul: "#1e40af",
    Rojo: "#be1b1b",
    Gris: "#6b7280",
    Plateado: "#d1d5db",
    Dorado: "#b8962e",
    Rosa: "#db2777",
    Verde: "#15803d",
    Transparente: "#e5e7eb",
  };
  return map[color] ?? "#9ca3af";
}

function needsDarkBorder(color: string): boolean {
  return ["Blanco", "Plateado", "Transparente", "Dorado"].includes(color);
}

export default function AccesorioCard({ accesorio, className }: AccesorioCardProps) {
  const [imgError, setImgError] = useState(false);
  // Precio desde la variante más barata disponible
  const variantesConStock = accesorio.variantes?.filter((v) => v.stock > 0) ?? [];
  const varianteMasBarata: AccesorioVariante | undefined =
    variantesConStock.sort((a, b) => a.precio - b.precio)[0] ??
    accesorio.variantes?.[0];

  const precio = varianteMasBarata?.precio;

  // Helper: extrae la primera URL de imagen sin importar si el backend
  // devuelve string[], { url: string }[], u otro shape
  function extractUrl(val: any): string | null {
    if (!val) return null;
    if (typeof val === "string") return val;
    if (typeof val === "object" && val.url) return val.url;
    return null;
  }

  // Buscamos imagen en este orden:
  //  1. variante.imagenes[0]        (array propio de la variante)
  //  2. accesorio.imagenes[0]       (array del accesorio)
  //  3. variante.fotoEstadoUrl      (foto de estado individual)
  const rawVarianteImgs = (varianteMasBarata as any)?.imagenes;
  const rawAccesorioImgs = (accesorio as any)?.imagenes;

  const imagen =
    extractUrl(Array.isArray(rawVarianteImgs) ? rawVarianteImgs[0] : rawVarianteImgs) ??
    extractUrl(Array.isArray(rawAccesorioImgs) ? rawAccesorioImgs[0] : rawAccesorioImgs) ??
    varianteMasBarata?.fotoEstadoUrl ??
    null;


  // Colores únicos disponibles
  const coloresUnicos: AccesorioVariante[] = Array.from(
    new Map(accesorio.variantes?.map((v) => [v.color, v]) ?? []).values()
  );

  // Label de categoría — el enum llega como número desde el backend
  const categoriaLabel =
    CATEGORIA_LABELS[accesorio.categoria as keyof typeof CATEGORIA_LABELS] ??
    CATEGORIA_LABELS[Number(accesorio.categoria) as keyof typeof CATEGORIA_LABELS] ??
    "Accesorio";

  return (
    <div
      className={`rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col bg-white group overflow-hidden ${className}`}
    >
      {/* ── ZONA DE IMAGEN ── */}
      <Link href={`/accesorios/${accesorio.id}`} className="block relative">
        <div className="relative w-full h-52 bg-gray-50 overflow-hidden">
          {imagen && !imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imagen}
              alt={accesorio.nombre}
              className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
              <ImageOff size={36} />
              <span className="text-[10px] text-gray-300 font-medium uppercase tracking-wide">Sin imagen</span>
            </div>
          )}

          {/* Badge de categoría */}
          <span className="absolute top-2 left-2 bg-color-principal/10 text-color-principal text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide border border-color-principal/20">
            {categoriaLabel}
          </span>

          {/* Badge "Usado" si aplica */}
          {varianteMasBarata?.esUsado && (
            <span className="absolute top-2 right-2 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
              Usado
            </span>
          )}
        </div>
      </Link>

      {/* ── INFO ── */}
      <div className="flex flex-col flex-1 px-5 pt-4 pb-5 gap-3">

        {/* Nombre y modelo */}
        <Link href={`/accesorios/${accesorio.id}`} className="block text-center">
          <h2 className="text-[17px] font-semibold text-color-principal leading-snug">
            {accesorio.nombre}
          </h2>
          <span className="text-[11px] text-gray-400 uppercase tracking-widest">
            {accesorio.modelo}
          </span>
        </Link>

        {/* Especificación de la variante */}
        {varianteMasBarata?.especificacion && (
          <p className="text-xs text-gray-500 text-center line-clamp-2">
            {varianteMasBarata.especificacion}
          </p>
        )}

        {/* Selector de colores (si hay más de uno) */}
        {coloresUnicos.length > 1 && (
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {coloresUnicos.map((cv) => (
              <div
                key={cv.color}
                title={cv.color}
                className={`w-5 h-5 rounded-full ring-1 ${
                  needsDarkBorder(cv.color) ? "ring-gray-300" : "ring-transparent"
                }`}
                style={{ backgroundColor: mapColorToHex(cv.color) }}
              />
            ))}
          </div>
        )}

        {/* Precio */}
        <p className="text-2xl font-bold text-center text-color-principal">
          {precio != null
            ? `$${precio.toLocaleString("es-AR")}`
            : "Consultar precio"}
        </p>

        {/* Stock info */}
        {variantesConStock.length === 0 && (
          <p className="text-xs text-center text-red-400 font-medium">Sin stock disponible</p>
        )}

        {/* Botón */}
        <Link
          href={`/accesorios/${accesorio.id}`}
          className="mt-1 bg-color-principal text-white py-2.5 rounded-full font-semibold hover:bg-color-principal-oscuro transition-colors text-center text-sm"
        >
          Ver accesorio
        </Link>
      </div>
    </div>
  );
}
