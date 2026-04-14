"use client";

import { useEffect, useState, use, useRef } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Cpu, Smartphone, Camera, Clapperboard, Wifi, Fingerprint,
  Truck, ShieldCheck, CreditCard, Battery, ArrowUpRight,
} from "lucide-react";
import { getProductoById, getProductos, Producto, Variante } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import Breadcrumb from "@/components/Breadcrumb";

// ─── helpers ───────────────────────────────────────────────────────────────

function mapColorToHex(color: string): string {
  const map: Record<string, string> = {
    Negro: "#1a1a1a", Blanco: "#f5f5f7", Azul: "#1e40af",
    "Azul Oscuro": "#1e3a5f", Rojo: "#be1b1b", Medianoche: "#0f172a",
    Estelar: "#e8e3d5", Púrpura: "#6b21a8", Verde: "#15803d",
    Amarillo: "#ca8a04", Rosa: "#db2777", Titanio: "#8a8a8e",
    "Titanio Natural": "#c8b89a", "Titanio Negro": "#2c2c2e",
    "Titanio Blanco": "#f2f2f2", "Titanio Desierto": "#c9a96e",
    Grafito: "#374151", Plata: "#d1d5db", Dorado: "#b8962e",
  };
  return map[color] ?? "#9ca3af";
}

function needsDarkBorder(color: string): boolean {
  return ["Blanco", "Estelar", "Plata", "Titanio Blanco", "Titanio Natural", "Dorado", "Titanio Desierto", "Titanio"].includes(color);
}

function getGalleryImages(product: Producto, variante: Variante): string[] {
  const varImgs = (variante as unknown as Record<string, unknown>)?.imagenes as string[] | undefined;
  if (varImgs && varImgs.length > 0) return varImgs;
  if (variante.fotoEstadoUrl) return [variante.fotoEstadoUrl];
  const stockImg = product.imagenes?.[0];
  return stockImg ? [stockImg] : ["/placeholder.png"];
}

type Spec = { icon: LucideIcon; label: string; value: string };

function getSpecs(product: Producto): Spec[] {
  const n = product.nombre.toLowerCase();
  const isProMax = n.includes("pro max");
  const isPro    = n.includes("pro") && !isProMax;
  const isMini   = n.includes("mini");
  const isPlus   = n.includes("plus");
  const gen15    = n.includes("15");
  const gen14    = n.includes("14");
  const gen13    = n.includes("13");
  const gen12    = n.includes("12");

  let chip = "Apple Silicon";
  if      (gen15 && (isPro || isProMax))             chip = "A17 Pro";
  else if (gen15 || (gen14 && (isPro || isProMax)))  chip = "A16 Bionic";
  else if (gen14 || gen13)                            chip = "A15 Bionic";
  else if (gen12)                                     chip = "A14 Bionic";

  let pantalla = "Super Retina XDR";
  if      (isProMax || isPlus) pantalla = `6.7" Super Retina XDR`;
  else if (isMini)             pantalla = `5.4" Super Retina XDR`;
  else                          pantalla = `6.1" Super Retina XDR`;
  if ((isPro || isProMax) && (gen13 || gen14 || gen15)) pantalla += " ProMotion";

  const camara = (isPro || isProMax) && (gen14 || gen15) ? "48 MP Fusion" : "12 MP avanzada";

  let video = "Dolby Vision 4K 60 fps";
  if      (isProMax && gen15) video = "4K 120 fps ProRes";
  else if (isPro || isProMax) video = "ProRes 4K";

  return [
    { icon: Cpu,         label: "Chip",        value: chip },
    { icon: Smartphone,  label: "Pantalla",     value: pantalla },
    { icon: Camera,      label: "Cámara",       value: camara },
    { icon: Clapperboard,label: "Video",        value: video },
    { icon: Wifi,        label: "Conectividad", value: "5G + Wi-Fi 6" },
    { icon: Fingerprint, label: "Seguridad",    value: "Face ID + SOS" },
  ];
}

// ─── componente ────────────────────────────────────────────────────────────

export default function ProductDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { addToCart, openCart } = useCart();

  const [product, setProduct]               = useState<Producto | null>(null);
  const [selectedVariante, setSelectedVariante] = useState<Variante | null>(null);
  const [quantity, setQuantity]             = useState(1);
  const [loading, setLoading]               = useState(true);
  const [added, setAdded]                   = useState(false);
  const [activeImage, setActiveImage]       = useState<string | null>(null);
  const [fading, setFading]                 = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Producto[]>([]);
  const [showStickyBar, setShowStickyBar]   = useState(false);

  const addBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getProductoById(id);
        setProduct(data);
        if (data.variantes?.length) {
          const primera = data.variantes.find((v) => !v.esUsado) ?? data.variantes[0];
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

  useEffect(() => {
    if (!product) return;
    getProductos()
      .then((all) =>
        setRelatedProducts(
          all.filter((p) => p.id !== product.id && p.stockTotal > 0).slice(0, 4)
        )
      )
      .catch(() => {});
  }, [product]);

  useEffect(() => {
    const el = addBtnRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [product, selectedVariante]);

  if (loading)
    return (
      <div className="py-20 text-center text-gray-400 text-sm animate-pulse">
        Cargando producto...
      </div>
    );
  if (!product || !selectedVariante) return notFound();

  const coloresUnicos: Variante[] = Array.from(
    new Map(product.variantes.map((v) => [v.color, v])).values()
  );

  const galleryImages = getGalleryImages(product, selectedVariante);

  const memoriasParaColor = [
    ...new Set(
      product.variantes
        .filter((v) => v.color === selectedVariante.color)
        .map((v) => v.memoria)
    ),
  ];

  const switchVariante = (next: Variante) => {
    if (next.id === selectedVariante.id) return;
    setFading(true);
    setTimeout(() => {
      setSelectedVariante(next);
      setActiveImage(getGalleryImages(product, next)[0] ?? null);
      setFading(false);
    }, 150);
  };

  const handleColorClick = (cv: Variante) => {
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
      type: "producto",
    });
    openCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const isRealPhoto =
    selectedVariante.fotoEstadoUrl &&
    activeImage === selectedVariante.fotoEstadoUrl;

  const specs = getSpecs(product);
  const minPrice = (p: Producto) => Math.min(...p.variantes.map((v) => v.precio));

  return (
    <>
      {/* ─── Main content ─── */}
      <div className="py-10 px-4 max-w-6xl mx-auto pb-28 md:pb-16">

        {/* ════ TWO-COLUMN: Gallery + Info ════ */}
        <div className="flex flex-col md:flex-row items-start gap-10 lg:gap-16">

          {/* ── GALERÍA ── */}
          <div className="w-full md:w-1/2 flex gap-3">
            {galleryImages.length > 1 && (
              <div className="hidden md:flex flex-col gap-2 flex-shrink-0">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onMouseEnter={() => setActiveImage(img)}
                    onClick={() => setActiveImage(img)}
                    aria-label={`Ver imagen ${idx + 1} de ${product.nombre} en ${selectedVariante.color}`}
                    className={`w-[60px] h-[60px] rounded-xl border-2 overflow-hidden transition-all bg-white ${
                      activeImage === img
                        ? "border-color-principal shadow-md"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <div className="relative w-full h-full">
                      <Image src={img} alt="" fill className="object-contain p-1" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 flex flex-col gap-3">
              <div className="relative rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden aspect-square shadow-sm">
                {isRealPhoto && (
                  <div className="absolute top-3 left-3 z-10 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide flex items-center gap-1.5">
                    <Camera size={11} strokeWidth={2} />
                    Foto real del equipo
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

              {galleryImages.length > 1 && (
                <div className="flex md:hidden gap-2 overflow-x-auto pb-1">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      aria-label={`Ver imagen ${idx + 1} de ${product.nombre} en ${selectedVariante.color}`}
                      className={`flex-shrink-0 w-14 h-14 rounded-xl border-2 overflow-hidden transition-all bg-white ${
                        activeImage === img ? "border-color-principal" : "border-gray-200"
                      }`}
                    >
                      <div className="relative w-full h-full">
                        <Image src={img} alt="" fill className="object-contain p-1" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── INFO ── */}
          <div className="w-full md:w-1/2 flex flex-col">
            <Breadcrumb items={[
              { label: "Inicio", href: "/" },
              { label: "Productos", href: "/products" },
              { label: product.nombre },
            ]} />

            <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.nombre}</h1>
            <p className="text-gray-400 text-xs uppercase tracking-widest mt-1 mb-2">
              {product.modelo}
            </p>
            <p className="text-gray-500 text-sm leading-relaxed">{product.descripcion}</p>

            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-4xl font-bold text-color-principal">
                ${selectedVariante.precio.toLocaleString("es-AR")}
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${selectedVariante.stock > 0 ? "bg-green-500" : "bg-red-400"}`} />
                <span className="text-sm text-gray-500 font-medium">
                  {selectedVariante.stock > 0
                    ? `${selectedVariante.stock} unidad${selectedVariante.stock > 1 ? "es" : ""} disponible${selectedVariante.stock > 1 ? "s" : ""}`
                    : "Sin stock"}
                </span>
                {selectedVariante.stock > 0 && selectedVariante.stock <= 3 && (
                  <span className="bg-red-50 text-red-600 border border-red-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
                    ¡Últimas unidades!
                  </span>
                )}
                {selectedVariante.esUsado && (
                  <>
                    <span className="bg-amber-100 text-amber-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                      Usado
                    </span>
                    {selectedVariante.detalleEstado && (
                      <span className="bg-amber-50 text-amber-600 text-[11px] px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                        <Battery size={11} strokeWidth={2} />
                        {selectedVariante.detalleEstado}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

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
                          ? "ring-2 ring-color-principal ring-offset-2 scale-110 shadow-md"
                          : `ring-1 hover:scale-105 ${needsDarkBorder(cv.color) ? "ring-gray-300" : "ring-transparent"}`
                      }`}
                      style={{ backgroundColor: mapColorToHex(cv.color) }}
                    />
                  ))}
                </div>
              </div>
            )}

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
                      className={`px-5 py-2 rounded-full text-sm font-bold border-2 transition-all ${
                        selectedVariante.memoria === mem
                          ? "bg-color-principal text-white border-color-principal shadow-md shadow-blue-900/20"
                          : "bg-white border-gray-200 text-gray-600 hover:border-color-principal/40"
                      }`}
                    >
                      {mem}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 mt-10">
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

              <button
                ref={addBtnRef}
                onClick={handleAddToCart}
                disabled={selectedVariante.stock < 1}
                className={`flex-1 font-bold py-3.5 rounded-full text-sm tracking-wide transition-all ${
                  added
                    ? "bg-green-600 text-white shadow-lg shadow-green-700/20"
                    : "bg-color-principal text-white shadow-lg shadow-blue-900/20 hover:bg-color-principal-oscuro active:scale-[0.98]"
                } disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none`}
              >
                {added ? "✓ AGREGADO AL CARRITO" : "AGREGAR AL CARRITO"}
              </button>
            </div>
          </div>
        </div>

        {/* ════ DIVIDER ════ */}
        <div className="mt-24 mb-0 border-t border-gray-100" />

        {/* ════ SPECS GRID ════ */}
        <section className="mt-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-color-principal/50 mb-3">
            Especificaciones
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mb-10">
            Lo que hace especial al {product.nombre}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4">
            {specs.map((spec) => {
              const Icon = spec.icon;
              return (
                <div
                  key={spec.label}
                  className="group relative bg-white border border-gray-100 rounded-2xl p-5 lg:p-6 flex flex-col gap-0
                    hover:border-color-principal/20 hover:shadow-[0_8px_32px_-4px_rgba(5,70,125,0.08)]
                    transition-all duration-300 cursor-default overflow-hidden"
                >
                  {/* Subtle background accent on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-color-principal/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-color-principal/[0.07] flex items-center justify-center mb-5
                    group-hover:bg-color-principal/[0.12] group-hover:scale-110
                    transition-all duration-300 ease-out origin-center relative z-10">
                    <Icon size={18} strokeWidth={1.75} className="text-color-principal" />
                  </div>

                  {/* Label */}
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-400 mb-1.5 relative z-10">
                    {spec.label}
                  </p>

                  {/* Value */}
                  <p className="text-sm font-semibold text-gray-900 leading-snug relative z-10">
                    {spec.value}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ════ TRUST STRIP ════ */}
        <section className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden bg-white">
            {[
              { icon: Truck,       title: "Envío a todo el país",  sub: "Coordinamos la entrega" },
              { icon: ShieldCheck, title: "Garantía oficial",      sub: "Equipos verificados" },
              { icon: CreditCard,  title: "Pago 100% seguro",      sub: "Procesado por MercadoPago" },
            ].map(({ icon: Icon, title, sub }) => (
              <div
                key={title}
                className="group flex items-center gap-4 px-6 py-5 hover:bg-gray-50/80 transition-colors duration-200"
              >
                <div className="w-9 h-9 flex-shrink-0 rounded-xl bg-color-principal/[0.07] flex items-center justify-center
                  group-hover:bg-color-principal/[0.12] group-hover:scale-110 transition-all duration-300">
                  <Icon size={16} strokeWidth={1.75} className="text-color-principal" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ════ RELATED PRODUCTS ════ */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-color-principal/50 mb-3">
              Seguí explorando
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mb-10">
              También te puede interesar
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden
                    hover:border-color-principal/20 hover:shadow-[0_8px_32px_-4px_rgba(5,70,125,0.08)]
                    transition-all duration-300"
                >
                  {/* Image */}
                  <div className="aspect-square bg-gray-50 relative overflow-hidden">
                    {p.imagenes?.[0] && (
                      <Image
                        src={p.imagenes[0]}
                        alt={p.nombre}
                        fill
                        className="object-contain p-4 group-hover:scale-[1.06] transition-transform duration-500 ease-out"
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="px-4 py-4 border-t border-gray-50">
                    <p className="text-sm font-semibold text-gray-900 line-clamp-1 mb-1">
                      {p.nombre}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-color-principal">
                        Desde ${minPrice(p).toLocaleString("es-AR")}
                      </p>
                      <ArrowUpRight
                        size={14}
                        strokeWidth={2}
                        className="text-gray-300 group-hover:text-color-principal group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ════ STICKY ADD BAR ════ */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.08)]
          transition-transform duration-300 ease-in-out
          ${showStickyBar ? "translate-y-0" : "translate-y-full"}`}
        aria-hidden={!showStickyBar}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {activeImage && (
              <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden relative">
                <Image src={activeImage} alt={product.nombre} fill className="object-contain p-1" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{product.nombre}</p>
              <p className="text-xs text-gray-400 truncate">
                {selectedVariante.color} · {selectedVariante.memoria}
              </p>
            </div>
          </div>

          <p className="text-base font-bold text-color-principal flex-shrink-0 hidden sm:block">
            ${selectedVariante.precio.toLocaleString("es-AR")}
          </p>

          <button
            onClick={handleAddToCart}
            disabled={selectedVariante.stock < 1}
            className={`flex-shrink-0 font-bold px-6 py-2.5 rounded-full text-sm tracking-wide transition-all ${
              added
                ? "bg-green-600 text-white"
                : "bg-color-principal text-white hover:bg-color-principal-oscuro active:scale-[0.98]"
            } disabled:bg-gray-200 disabled:text-gray-400`}
          >
            {added ? "✓ Agregado" : "Agregar al carrito"}
          </button>
        </div>
      </div>
    </>
  );
}
