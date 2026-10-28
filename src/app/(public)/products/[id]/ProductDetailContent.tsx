"use client";

import { useEffect, useState, use, useRef } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Camera, Battery, ShieldCheck, Truck, RefreshCw, ArrowUpRight } from "lucide-react";
import { getProductoById, getProductos, Producto, Variante } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import Breadcrumb from "@/components/Breadcrumb";
import { formatearPrecio } from "@/lib/precio";
import { linkWhatsApp } from "@/lib/whatsapp";

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

type Spec = { label: string; value: string };

// Lo que Wave promete en todos los equipos (mismos textos que la home).
const GARANTIAS: { icon: LucideIcon; titulo: string; detalle: string }[] = [
  { icon: ShieldCheck, titulo: "Garantía de 3 meses", detalle: "en todos los equipos" },
  { icon: Truck, titulo: "Envío a todo el país", detalle: "con número de seguimiento" },
  { icon: RefreshCw, titulo: "Plan canje", detalle: "tu iPhone como parte de pago" },
];

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
    { label: "Chip",         value: chip },
    { label: "Pantalla",     value: pantalla },
    { label: "Cámara",       value: camara },
    { label: "Video",        value: video },
    { label: "Conectividad", value: "5G + Wi-Fi 6" },
    { label: "Seguridad",    value: "Face ID + SOS" },
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
      // Sólo cuando el botón quedó arriba de la pantalla: si está abajo (en mobile, al cargar)
      // la barra tapaba el precio sin que hiciera falta. El root se extiende hacia abajo para que
      // "abajo de la pantalla" cuente como visible; así un scroll rápido que salta el botón
      // también cambia el estado y dispara el observer.
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px 100000px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [product, selectedVariante]);

  // Con la barra visible, el botón de WhatsApp sube para no taparla (ver WhatsAppButton).
  useEffect(() => {
    const raiz = document.documentElement.style;
    if (showStickyBar) raiz.setProperty("--barra-inferior", "4.5rem");
    else raiz.removeProperty("--barra-inferior");
    return () => {
      raiz.removeProperty("--barra-inferior");
    };
  }, [showStickyBar]);

  if (loading)
    return (
      <div className="py-20 text-center text-tinta-suave text-sm animate-pulse motion-reduce:animate-none">
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
      stock: selectedVariante.stock,
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

  const sinStock = selectedVariante.stock < 1;
  const ultimas = selectedVariante.stock > 0 && selectedVariante.stock <= 3;
  // WhatsApp es ayuda secundaria: la venta se concreta en la web (DESIGN.md).
  const consultaWhatsApp = linkWhatsApp(
    `Hola, tengo una consulta sobre el ${product.nombre} ${selectedVariante.memoria} ${selectedVariante.color}.`
  );

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-28 md:pb-24 text-tinta">
        <Breadcrumb items={[
          { label: "Inicio", href: "/" },
          { label: "iPhone", href: "/products" },
          { label: product.nombre },
        ]} />

        <div className="flex flex-col md:flex-row md:items-start gap-8 lg:gap-12">

          {/* ── Galería ── */}
          <section aria-label="Fotos" className="w-full md:w-[56%] flex gap-3">
            {galleryImages.length > 1 && (
              <div className="hidden md:flex flex-col gap-2.5 flex-shrink-0">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    aria-label={`Ver imagen ${idx + 1} de ${product.nombre} en ${selectedVariante.color}`}
                    aria-current={activeImage === img}
                    className={`relative size-[72px] rounded-control bg-superficie overflow-hidden transition-colors ${
                      activeImage === img ? "ring-[1.5px] ring-tinta" : "ring-1 ring-borde hover:ring-borde-fuerte"
                    }`}
                  >
                    <Image src={img} alt="" fill sizes="72px" className="object-contain p-1.5 mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 min-w-0 flex flex-col gap-3">
              <div className="relative aspect-square rounded-panel bg-superficie overflow-hidden">
                {isRealPhoto && (
                  <span className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-xs font-medium text-tinta">
                    <Camera size={13} strokeWidth={1.75} aria-hidden="true" />
                    Foto real del equipo
                  </span>
                )}
                {/* mix-blend-multiply: el fondo blanco de las fotos se funde con el panel gris. */}
                <Image
                  src={activeImage || "/placeholder.png"}
                  alt={`${product.nombre} – ${selectedVariante.color}`}
                  fill
                  sizes="(min-width: 768px) 56vw, 100vw"
                  className={`object-contain p-10 mix-blend-multiply transition-opacity duration-150 motion-reduce:transition-none ${fading ? "opacity-0" : "opacity-100"}`}
                  priority
                />
              </div>

              {galleryImages.length > 1 && (
                <div className="flex md:hidden gap-2 overflow-x-auto pb-1">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(img)}
                      aria-label={`Ver imagen ${idx + 1} de ${product.nombre} en ${selectedVariante.color}`}
                      aria-current={activeImage === img}
                      className={`relative flex-shrink-0 size-16 rounded-control bg-superficie overflow-hidden ${
                        activeImage === img ? "ring-[1.5px] ring-tinta" : "ring-1 ring-borde"
                      }`}
                    >
                      <Image src={img} alt="" fill sizes="64px" className="object-contain p-1.5 mix-blend-multiply" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ── Compra ── */}
          <section aria-label="Comprar" className="w-full md:flex-1 min-w-0 flex flex-col gap-6">
            <div>
              <div className="flex flex-wrap gap-2">
                {selectedVariante.esUsado ? (
                  <>
                    <span className="rounded-md bg-superficie px-2.5 py-1 text-xs font-semibold text-tinta">Usado</span>
                    {selectedVariante.detalleEstado && (
                      <span className="flex items-center gap-1 rounded-md bg-superficie px-2.5 py-1 text-xs text-tinta-suave">
                        <Battery size={13} strokeWidth={1.75} aria-hidden="true" />
                        {selectedVariante.detalleEstado}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="rounded-md bg-principal-suave px-2.5 py-1 text-xs font-semibold text-color-principal">
                    Nuevo · sellado
                  </span>
                )}
              </div>
              <h1 className="mt-3 text-4xl lg:text-[44px] font-semibold tracking-tight leading-[1.05]">
                {product.nombre}
              </h1>
              <p className="mt-1.5 text-[15px] text-tinta-suave">
                {selectedVariante.memoria} · {selectedVariante.color} · Modelo {product.modelo}
              </p>
            </div>

            <div className="rounded-panel bg-superficie px-5 py-4">
              <p className="text-[32px] font-semibold tracking-tight tabular-nums leading-tight">
                {formatearPrecio(selectedVariante.precio)}
              </p>
              <p className="mt-0.5 text-sm text-tinta-suave">Pagás con MercadoPago: tarjeta, débito o transferencia.</p>
            </div>

            {coloresUnicos.length > 1 && (
              <fieldset>
                <legend className="mb-2.5 text-sm font-semibold">
                  Color · <span className="font-normal text-tinta-suave">{selectedVariante.color}</span>
                </legend>
                <div className="flex flex-wrap gap-2.5">
                  {coloresUnicos.map((cv) => {
                    const activo = selectedVariante.color === cv.color;
                    return (
                      <button
                        key={cv.color}
                        type="button"
                        onClick={() => handleColorClick(cv)}
                        aria-label={cv.color}
                        aria-pressed={activo}
                        className={`size-11 rounded-full bg-white p-[3px] border-2 transition-colors ${
                          activo ? "border-color-principal" : "border-borde hover:border-borde-fuerte"
                        }`}
                      >
                        <span
                          className={`block size-full rounded-full ${needsDarkBorder(cv.color) ? "ring-1 ring-inset ring-black/15" : ""}`}
                          style={{ backgroundColor: mapColorToHex(cv.color) }}
                        />
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {memoriasParaColor.length > 0 && (
              <fieldset>
                <legend className="mb-2.5 text-sm font-semibold">Capacidad</legend>
                <div className="grid grid-cols-3 gap-2.5">
                  {memoriasParaColor.map((mem) => {
                    const activo = selectedVariante.memoria === mem;
                    return (
                      <button
                        key={mem}
                        type="button"
                        onClick={() => handleMemoriaClick(mem)}
                        aria-pressed={activo}
                        className={`min-h-12 rounded-control bg-white text-[15px] font-medium transition-colors ${
                          activo ? "border-2 border-color-principal" : "border border-borde-fuerte hover:border-tinta-suave"
                        }`}
                      >
                        {mem}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            <div className="flex flex-col gap-3">
              <div className="flex gap-2.5">
                <div role="group" aria-label="Cantidad" className="flex items-center rounded-control border border-borde-fuerte select-none">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    aria-label="Restar uno"
                    className="size-12 flex items-center justify-center text-lg text-tinta disabled:text-borde-fuerte"
                  >
                    <span aria-hidden="true">−</span>
                  </button>
                  <span className="w-6 text-center font-semibold tabular-nums" aria-live="polite">
                    <span className="sr-only">Cantidad: </span>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(selectedVariante.stock, quantity + 1))}
                    disabled={quantity >= selectedVariante.stock}
                    aria-label="Sumar uno"
                    className="size-12 flex items-center justify-center text-lg text-tinta disabled:text-borde-fuerte"
                  >
                    <span aria-hidden="true">+</span>
                  </button>
                </div>

                <button
                  ref={addBtnRef}
                  type="button"
                  onClick={handleAddToCart}
                  disabled={sinStock}
                  className={`flex-1 min-h-14 rounded-control text-[17px] font-semibold text-white transition-colors active:scale-[0.99] motion-reduce:active:scale-100 ${
                    added ? "bg-exito" : "bg-color-principal hover:bg-color-principal-oscuro"
                  } disabled:bg-borde disabled:text-tinta-suave`}
                >
                  {sinStock ? "Sin stock" : added ? "Agregado al carrito" : "Agregar al carrito"}
                </button>
              </div>
              <p role="status" className="sr-only">{added ? "Agregado al carrito" : ""}</p>

              <p className={`text-sm ${sinStock ? "text-tinta-suave" : "text-exito"}`}>
                {sinStock
                  ? "Sin stock en esta combinación. Probá con otro color o capacidad."
                  : `En stock · ${selectedVariante.stock} ${selectedVariante.stock === 1 ? "unidad" : "unidades"}${ultimas ? " · Últimas unidades" : ""}`}
              </p>
              <p className="text-sm text-tinta-suave">
                ¿Tenés dudas?{" "}
                <a
                  href={consultaWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-color-principal underline underline-offset-[3px] hover:text-color-principal-oscuro"
                >
                  Escribinos por WhatsApp
                </a>
              </p>
            </div>

            <ul className="rounded-panel border border-borde divide-y divide-borde">
              {GARANTIAS.map(({ icon: Icon, titulo, detalle }) => (
                <li key={titulo} className="flex items-center gap-3 px-4 py-3.5 text-sm">
                  <Icon size={20} strokeWidth={1.75} className="flex-shrink-0 text-color-principal" aria-hidden="true" />
                  <span>
                    <span className="font-semibold">{titulo}</span>{" "}
                    <span className="text-tinta-suave">{detalle}</span>
                  </span>
                </li>
              ))}
            </ul>

            {product.descripcion && (
              <p className="text-[15px] leading-relaxed text-tinta-suave">{product.descripcion}</p>
            )}
          </section>
        </div>

        {/* ── Especificaciones ── */}
        <section aria-labelledby="specs" className="mt-20">
          <h2 id="specs" className="mb-5 text-[28px] font-semibold tracking-tight">Especificaciones</h2>
          <dl className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {specs.map((spec) => (
              <div key={spec.label} className="rounded-panel bg-superficie p-5">
                <dt className="text-[13px] text-tinta-suave">{spec.label}</dt>
                <dd className="mt-1.5 text-[17px] font-medium leading-snug">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Relacionados ── */}
        {relatedProducts.length > 0 && (
          <section aria-labelledby="relacionados" className="mt-20">
            <h2 id="relacionados" className="mb-5 text-[28px] font-semibold tracking-tight">También te puede interesar</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="group rounded-panel bg-superficie p-4 transition-colors hover:bg-borde"
                >
                  <div className="relative aspect-square">
                    {p.imagenes?.[0] && (
                      <Image
                        src={p.imagenes[0]}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 25vw, 50vw"
                        className="object-contain p-3 mix-blend-multiply transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                    )}
                  </div>
                  <p className="mt-3 text-[15px] font-semibold line-clamp-1">{p.nombre}</p>
                  <p className="mt-0.5 flex items-center justify-between text-sm text-tinta-suave">
                    Desde {formatearPrecio(minPrice(p))}
                    <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" className="group-hover:text-color-principal" />
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── Barra fija: aparece cuando el botón de agregar quedó arriba ── */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-30 border-t border-borde bg-white/95 backdrop-blur-md
          transition-transform duration-300 ease-in-out motion-reduce:transition-none
          ${showStickyBar ? "translate-y-0" : "translate-y-full"}`}
        inert={!showStickyBar}
      >
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {activeImage && (
              <div className="relative size-11 flex-shrink-0 rounded-control bg-superficie overflow-hidden">
                <Image src={activeImage} alt="" fill sizes="44px" className="object-contain p-1 mix-blend-multiply" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-tinta truncate">{product.nombre}</p>
              <p className="text-xs text-tinta-suave truncate">
                {selectedVariante.memoria} · {selectedVariante.color}
              </p>
            </div>
          </div>

          <p className="hidden sm:block flex-shrink-0 text-base font-semibold text-tinta tabular-nums">
            {formatearPrecio(selectedVariante.precio)}
          </p>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={sinStock}
            className={`flex-shrink-0 min-h-11 px-5 rounded-control text-sm font-semibold text-white transition-colors ${
              added ? "bg-exito" : "bg-color-principal hover:bg-color-principal-oscuro"
            } disabled:bg-borde disabled:text-tinta-suave`}
          >
            {added ? "Agregado" : "Agregar al carrito"}
          </button>
        </div>
      </div>
    </>
  );
}
