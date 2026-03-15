"use client";

import { useEffect, useState, use } from "react";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { getProductoById, Producto, Variante } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import Toast from "@/components/ui/Toast";

// ─── helpers ───────────────────────────────────────────────────────────────

function mapColorToHex(color: string): string {
  const map: Record<string, string> = {
    Negro: "#1a1a1a",
    Blanco: "#f5f5f7",
    Azul: "#1e40af",
    "Azul Oscuro": "#1e3a5f",
    Rojo: "#be1b1b",
    Medianoche: "#0f172a",
    Estelar: "#e8e3d5",
    Púrpura: "#6b21a8",
    Verde: "#15803d",
    Amarillo: "#ca8a04",
    Rosa: "#db2777",
    Titanio: "#8a8a8e",
    "Titanio Natural": "#c8b89a",
    "Titanio Negro": "#2c2c2e",
    "Titanio Blanco": "#f2f2f2",
    "Titanio Desierto": "#c9a96e",
    Grafito: "#374151",
    Plata: "#d1d5db",
    Dorado: "#b8962e",
  };
  return map[color] ?? "#9ca3af";
}

function needsDarkBorder(color: string): boolean {
  return ["Blanco", "Estelar", "Plata", "Titanio Blanco", "Titanio Natural", "Dorado", "Titanio Desierto", "Titanio"].includes(color);
}

/**
 * Devuelve las imágenes de la galería para la variante activa.
 * Cuando el backend tenga variante.imagenes[], lo usará automáticamente.
 * Fallback: product.imagenes[] indexado por posición del color.
 */
function getGalleryImages(product: Producto, variante: Variante, colorIdx: number): string[] {
  // Prioridad 1: backend envía imagenes[] propias de la variante (futuro)
  const varImgs = (variante as any).imagenes as string[] | undefined;
  if (varImgs && varImgs.length > 0) return varImgs;

  // Prioridad 2: la variante tiene foto real propia → mostrar SOLO esa
  // No mezclamos imágenes de otros colores
  if (variante.fotoEstadoUrl) {
    return [variante.fotoEstadoUrl];
  }

  // Prioridad 3: sin fotos propias → fallback a la imagen general del producto
  const stockImg = product.imagenes?.[0];
  return stockImg ? [stockImg] : ["/placeholder.png"];
}

// ─── componente ────────────────────────────────────────────────────────────

export default function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Producto | null>(null);
  const [selectedVariante, setSelectedVariante] = useState<Variante | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getProductoById(id);
        setProduct(data);
        if (data.variantes?.length) {
          // Preferir la primera variante NUEVA si existe, sino la primera que haya
          const primera =
            data.variantes.find((v) => !v.esUsado) ?? data.variantes[0];
          setSelectedVariante(primera);
          setActiveImage(primera.fotoEstadoUrl ?? data.imagenes?.[0] ?? null);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading)
    return (
      <div className="py-20 text-center text-gray-400 text-sm animate-pulse">
        Cargando producto...
      </div>
    );
  if (!product || !selectedVariante) return notFound();

  // ── datos derivados ───────────────────────────────────────────────────────

  // Una variante representante por color
  const coloresUnicos: Variante[] = Array.from(
    new Map(product.variantes.map((v) => [v.color, v])).values()
  );

  const colorIdx = coloresUnicos.findIndex((v) => v.color === selectedVariante.color);

  // Galería de la variante activa
  const galleryImages = getGalleryImages(product, selectedVariante, colorIdx);

  // Solo memorias que existen para el color seleccionado
  const memoriasParaColor = [
    ...new Set(
      product.variantes
        .filter((v) => v.color === selectedVariante.color)
        .map((v) => v.memoria)
    ),
  ];

  // ── helpers de interacción ───────────────────────────────────────────────

  /** Cambia variante con fade de imagen */
  const switchVariante = (next: Variante) => {
    if (next.id === selectedVariante.id) return;
    setFading(true);
    setTimeout(() => {
      setSelectedVariante(next);
      const nextColorIdx = coloresUnicos.findIndex((v) => v.color === next.color);
      const nextImgs = getGalleryImages(product, next, nextColorIdx);
      setActiveImage(nextImgs[0] ?? null);
      setFading(false);
    }, 150);
  };

  const handleColorClick = (cv: Variante) => {
    // Intentar conservar la misma memoria
    const match =
      product.variantes.find(
        (v) => v.color === cv.color && v.memoria === selectedVariante.memoria
      ) ?? cv;
    switchVariante(match);
  };

  const handleMemoriaClick = (mem: string) => {
    const match = product.variantes.find(
      (v) => v.memoria === mem && v.color === selectedVariante.color
    );
    if (match) switchVariante(match);
  };

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${selectedVariante.id}`,
      name: `${product.nombre} (${selectedVariante.color}, ${selectedVariante.memoria})`,
      price: selectedVariante.precio,
      quantity,
      image: activeImage ?? product.imagenes?.[0] ?? undefined,
    });
    setShowToast(true);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setShowToast(false);
    }, 1500);
  };

  const isRealPhoto =
    selectedVariante.fotoEstadoUrl &&
    activeImage === selectedVariante.fotoEstadoUrl;

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="py-10 px-4 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-start gap-10 lg:gap-16">

        {/* ════ GALERÍA ════ */}
        <div className="w-full md:w-1/2 flex gap-3">

          {/* Tira de miniaturas — desktop */}
          {galleryImages.length > 1 && (
            <div className="hidden md:flex flex-col gap-2 flex-shrink-0">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onMouseEnter={() => setActiveImage(img)}
                  onClick={() => setActiveImage(img)}
                  className={`w-[60px] h-[60px] rounded-lg border-2 overflow-hidden transition-all bg-white ${
                    activeImage === img
                      ? "border-[#05467D] shadow-md"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image src={img} alt={`Vista ${idx + 1}`} fill className="object-contain p-1" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Visor principal */}
          <div className="flex-1 flex flex-col gap-3">
            <div className="relative rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden aspect-square shadow-sm">

              {/* Badge foto real */}
              {isRealPhoto && (
                <div className="absolute top-3 left-3 z-10 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                  📷 Foto real del equipo
                </div>
              )}

              <Image
                src={activeImage || "/placeholder.png"}
                alt={`${product.nombre} – ${selectedVariante.color}`}
                fill
                className={`object-contain p-8 transition-opacity duration-150 ${fading ? "opacity-0" : "opacity-100"}`}
                priority
              />
            </div>

            {/* Tira de miniaturas — mobile */}
            {galleryImages.length > 1 && (
              <div className="flex md:hidden gap-2 overflow-x-auto pb-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`flex-shrink-0 w-14 h-14 rounded-lg border-2 overflow-hidden transition-all bg-white ${
                      activeImage === img ? "border-[#05467D]" : "border-gray-200"
                    }`}
                  >
                    <div className="relative w-full h-full">
                      <Image src={img} alt={`Vista ${idx + 1}`} fill className="object-contain p-1" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ════ INFO ════ */}
        <div className="w-full md:w-1/2 flex flex-col">

          {/* Volver */}
          <button
            onClick={() => router.back()}
            className="mb-5 self-start flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            ← Volver al catálogo
          </button>

          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.nombre}</h1>
          <p className="text-gray-400 text-xs uppercase tracking-widest mt-1 mb-2">
            {product.modelo}
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">{product.descripcion}</p>

          {/* Precio + stock */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-4xl font-bold text-[#05467D]">
              ${selectedVariante.precio.toLocaleString("es-AR")}
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  selectedVariante.stock > 0 ? "bg-green-500" : "bg-red-400"
                }`}
              />
              <span className="text-sm text-gray-500 font-medium">
                {selectedVariante.stock > 0
                  ? `${selectedVariante.stock} unidad${selectedVariante.stock > 1 ? "es" : ""} disponible${selectedVariante.stock > 1 ? "s" : ""}`
                  : "Sin stock"}
              </span>

              {selectedVariante.esUsado && (
                <>
                  <span className="bg-amber-100 text-amber-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    Usado
                  </span>
                  {selectedVariante.detalleEstado && (
                    <span className="bg-amber-50 text-amber-600 text-[11px] px-2.5 py-0.5 rounded-full border border-amber-200">
                      🔋 {selectedVariante.detalleEstado}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* ── COLORES ── */}
          {coloresUnicos.length > 1 && (
            <div className="mt-7">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Color —{" "}
                <span className="text-gray-700 normal-case font-semibold">
                  {selectedVariante.color}
                </span>
              </p>
              <div className="flex gap-3 flex-wrap">
                {coloresUnicos.map((cv) => (
                  <button
                    key={cv.color}
                    onClick={() => handleColorClick(cv)}
                    title={cv.color}
                    aria-label={`Color ${cv.color}`}
                    className={`w-10 h-10 rounded-full transition-all duration-200 focus:outline-none ${
                      selectedVariante.color === cv.color
                        ? "ring-2 ring-[#05467D] ring-offset-2 scale-110 shadow-md"
                        : `ring-1 hover:scale-105 ${
                            needsDarkBorder(cv.color) ? "ring-gray-300" : "ring-transparent"
                          }`
                    }`}
                    style={{ backgroundColor: mapColorToHex(cv.color) }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── MEMORIA ── */}
          {memoriasParaColor.length > 0 && (
            <div className="mt-7">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Capacidad
              </p>
              <div className="flex gap-2 flex-wrap">
                {memoriasParaColor.map((mem) => (
                  <button
                    key={mem}
                    onClick={() => handleMemoriaClick(mem)}
                    className={`px-5 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                      selectedVariante.memoria === mem
                        ? "bg-[#05467D] text-white border-[#05467D] shadow-md shadow-blue-900/20"
                        : "bg-white border-gray-200 text-gray-600 hover:border-[#05467D]/40"
                    }`}
                  >
                    {mem}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── ACCIONES ── */}
          <div className="flex items-center gap-3 mt-10">
            {/* Cantidad */}
            <div className="flex items-center border-2 border-gray-200 rounded-full select-none">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full transition-colors text-lg font-bold"
              >
                −
              </button>
              <span className="w-8 text-center font-bold text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(selectedVariante.stock, quantity + 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full transition-colors text-lg font-bold"
              >
                +
              </button>
            </div>

            {/* Agregar al carrito */}
            <button
              onClick={handleAddToCart}
              disabled={selectedVariante.stock < 1}
              className={`flex-1 font-bold py-3.5 rounded-full text-sm tracking-wide transition-all ${
                added
                  ? "bg-green-600 text-white shadow-lg shadow-green-700/20"
                  : "bg-[#05467D] text-white shadow-lg shadow-blue-900/20 hover:bg-[#043a6a] active:scale-[0.98]"
              } disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none`}
            >
              {added ? "✓ AGREGADO AL CARRITO" : "AGREGAR AL CARRITO"}
            </button>
          </div>
        </div>
      </div>

      <Toast
        message="Producto agregado al carrito"
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
