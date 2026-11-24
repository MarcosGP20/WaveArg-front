"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { Accesorio, AccesorioVariante, CATEGORIA_LABELS } from "@/lib/api";
import { formatearPrecio } from "@/lib/precio";

type AccesorioCardProps = {
  accesorio: Accesorio;
  className?: string;
  /** Nivel del título de la tarjeta, según dónde se use. */
  titulo?: "h2" | "h3";
};

// Helper: extrae la primera URL de imagen sin importar si el backend
// devuelve string[], { url: string }[], u otro shape
function extractUrl(val: unknown): string | null {
  if (!val) return null;
  if (typeof val === "string") return val;
  if (typeof val === "object" && "url" in val && typeof val.url === "string") return val.url;
  return null;
}

// Tarjeta de accesorio, con el mismo lenguaje que la de iPhone (TarjetaDeModelo): panel gris, la
// foto fundida con el fondo y toda la tarjeta como link a la ficha.
export default function AccesorioCard({ accesorio, className, titulo: Titulo = "h2" }: AccesorioCardProps) {
  const [imgError, setImgError] = useState(false);
  // Precio desde la variante más barata disponible
  const variantesConStock = accesorio.variantes?.filter((v) => v.stock > 0) ?? [];
  const stockTotal = accesorio.variantes?.reduce((sum, v) => sum + (v.stock ?? 0), 0) ?? 0;
  const varianteMasBarata: AccesorioVariante | undefined =
    variantesConStock.sort((a, b) => a.precio - b.precio)[0] ?? accesorio.variantes?.[0];
  const precio = varianteMasBarata?.precio;
  const sinStock = variantesConStock.length === 0;

  // Buscamos imagen en este orden:
  //  1. variante.imagenes[0]        (array propio de la variante)
  //  2. accesorio.imagenes[0]       (array del accesorio)
  //  3. variante.fotoEstadoUrl      (foto de estado individual)
  const rawVarianteImgs: unknown = varianteMasBarata?.imagenes;
  const rawAccesorioImgs: unknown = accesorio.imagenes;
  const imagen =
    extractUrl(Array.isArray(rawVarianteImgs) ? rawVarianteImgs[0] : rawVarianteImgs) ??
    extractUrl(Array.isArray(rawAccesorioImgs) ? rawAccesorioImgs[0] : rawAccesorioImgs) ??
    varianteMasBarata?.fotoEstadoUrl ??
    null;

  // Label de categoría — el enum llega como número desde el backend
  const categoriaLabel =
    CATEGORIA_LABELS[accesorio.categoria as keyof typeof CATEGORIA_LABELS] ??
    CATEGORIA_LABELS[Number(accesorio.categoria) as keyof typeof CATEGORIA_LABELS] ??
    "Accesorio";

  return (
    <article
      className={`flex h-full flex-col rounded-panel bg-superficie transition-colors duration-300 ease-ola has-[a:hover]:bg-borde ${className ?? ""}`}
    >
      <Link href={`/accesorios/${accesorio.id}`} className="group flex flex-1 flex-col rounded-panel p-3 md:p-6">
        <div className="relative aspect-square md:aspect-[4/3]">
          {imagen && !imgError ? (
            <Image
              src={imagen}
              alt=""
              fill
              unoptimized
              className="object-contain p-2 mix-blend-multiply transition-transform duration-500 ease-ola group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-tinta-suave">
              <ImageOff size={32} strokeWidth={1.75} aria-hidden="true" />
              <span className="caption-2">Sin imagen</span>
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-lg bg-principal-suave px-2 py-1 caption-1 text-color-principal">{categoriaLabel}</span>
          {varianteMasBarata?.esUsado && <span className="rounded-lg bg-white px-2 py-1 caption-1 text-tinta">Usado</span>}
          {stockTotal > 0 && stockTotal <= 3 && (
            <span className="rounded-lg bg-white px-2 py-1 caption-1 tabular-nums text-tinta">
              {stockTotal === 1 ? "Queda 1" : `Quedan ${stockTotal}`}
            </span>
          )}
        </div>

        <Titulo className="mt-3 body-1 text-tinta md:heading-6">{accesorio.nombre}</Titulo>
        {varianteMasBarata?.especificacion && (
          <p className="mt-1 line-clamp-2 caption-2 text-tinta-suave">{varianteMasBarata.especificacion}</p>
        )}

        <p className="mt-auto pt-4 heading-6 tabular-nums text-tinta md:heading-5">
          {precio != null ? formatearPrecio(precio) : "Consultar precio"}
        </p>

        {/* Toda la tarjeta es el link: el botón es su parte visible. */}
        <span
          className={`mt-4 rounded-lg px-3 py-3 text-center button-sm ring-1 ring-inset transition-colors duration-300 ease-ola md:rounded-control md:button-md ${
            sinStock
              ? "bg-superficie text-tinta-suave ring-borde"
              : "bg-white text-tinta ring-borde-fuerte group-hover:bg-color-principal group-hover:text-white group-hover:ring-color-principal"
          }`}
        >
          {sinStock ? "Sin stock" : "Ver accesorio"}
        </span>
      </Link>
    </article>
  );
}
