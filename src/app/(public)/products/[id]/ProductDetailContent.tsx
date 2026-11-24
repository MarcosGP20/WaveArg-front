"use client";

import { useEffect, useState, use, useRef } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Camera, Battery, ShieldCheck, Truck, RefreshCw, ArrowUpRight, Undo2 } from "lucide-react";
import { ApiError, getProductoById, getProductos, Producto, Variante } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import Breadcrumb from "@/components/Breadcrumb";
import { botonPrincipal } from "@/components/home/estilos";
import { mapColorToHex, needsDarkBorder } from "@/lib/colorMap";
import { textoCuotas } from "@/lib/cuotas";
import { especificacionesDe } from "@/lib/especificaciones";
import { tarjetasDeModelos, type TarjetaDeModelo } from "@/lib/home";
import { formatearPrecio } from "@/lib/precio";
import { linkWhatsApp } from "@/lib/whatsapp";
import {
  capacidadesDelColor,
  coloresDelEstado,
  estadosDisponibles,
  resolverVariante,
  varianteInicial,
  type Eleccion,
} from "@/lib/configurador";

// ─── helpers ───────────────────────────────────────────────────────────────

function getGalleryImages(product: Producto, variante: Variante): string[] {
  const varImgs = (variante as unknown as Record<string, unknown>)?.imagenes as string[] | undefined;
  if (varImgs && varImgs.length > 0) return varImgs;
  if (variante.fotoEstadoUrl) return [variante.fotoEstadoUrl];
  const stockImg = product.imagenes?.[0];
  return stockImg ? [stockImg] : ["/placeholder.png"];
}

// Lo que Wave promete en todos los equipos (mismos textos que la home).
const GARANTIAS: { icon: LucideIcon; titulo: string; detalle: string }[] = [
  { icon: ShieldCheck, titulo: "Garantía de 3 meses", detalle: "en todos los equipos" },
  { icon: Truck, titulo: "Envío a todo el país", detalle: "con número de seguimiento" },
  { icon: RefreshCw, titulo: "Plan canje", detalle: "tu iPhone como parte de pago" },
  { icon: Undo2, titulo: "10 días para arrepentirte", detalle: "si lo compraste por la web" },
];

// ─── componente ────────────────────────────────────────────────────────────

export default function ProductDetailContent({
  params,
  varianteDelLink,
}: {
  params: Promise<{ id: string }>;
  /** ?v= del link: la configuración que alguien compartió. */
  varianteDelLink?: string;
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
  const [relacionados, setRelacionados]     = useState<TarjetaDeModelo[]>([]);
  const [noExiste, setNoExiste]             = useState(false);
  const [intento, setIntento]               = useState(0);
  const [showStickyBar, setShowStickyBar]   = useState(false);

  const addBtnRef = useRef<HTMLButtonElement>(null);
  const fadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (fadeRef.current) clearTimeout(fadeRef.current);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const data = await getProductoById(id);
        setProduct(data);
        if (data.variantes?.length) {
          const primera = varianteInicial(data.variantes, varianteDelLink) ?? data.variantes[0];
          setSelectedVariante(primera);
          setActiveImage(primera.fotoEstadoUrl ?? data.imagenes?.[0] ?? null);
        }
      } catch (e) {
        // Sólo un 404 es "no existe": si falló la conexión se ofrece reintentar, no un "no encontrado".
        if (e instanceof ApiError && e.status === 404) setNoExiste(true);
        else console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, varianteDelLink, intento]);

  useEffect(() => {
    if (!product) return;
    getProductos()
      // Sólo modelos con stock, con su precio más bajo: cada uno abre su ficha en esa variante.
      .then((all) => setRelacionados(tarjetasDeModelos(all.filter((p) => p.id !== product.id)).slice(0, 4)))
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

  // Con la barra visible, el botón de WhatsApp sube para no taparla (ver WhatsAppButton; el lanzador del chat también sube, ver ChatAyuda).
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
      <div aria-hidden="true" className="mx-auto max-w-6xl px-4 pb-24 pt-6">
        <div className="h-5 w-48 animate-pulse rounded-lg bg-borde motion-reduce:animate-none" />
        <div className="mt-6 flex flex-col gap-8 md:flex-row lg:gap-12">
          <div className="aspect-square w-full animate-pulse rounded-panel bg-superficie motion-reduce:animate-none md:w-[56%]" />
          <div className="flex flex-1 flex-col gap-6">
            <div className="h-12 w-3/4 animate-pulse rounded-lg bg-borde motion-reduce:animate-none" />
            <div className="h-24 animate-pulse rounded-panel bg-superficie motion-reduce:animate-none" />
            <div className="h-16 animate-pulse rounded-control bg-superficie motion-reduce:animate-none" />
            <div className="h-16 animate-pulse rounded-control bg-superficie motion-reduce:animate-none" />
            <div className="h-14 animate-pulse rounded-control bg-borde motion-reduce:animate-none" />
          </div>
        </div>
      </div>
    );
  if (noExiste) return notFound();
  if (!product || !selectedVariante)
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-tinta md:py-24">
        <h1 className="heading-4 md:heading-3">No pudimos cargar este iPhone</h1>
        <p className="mt-3 body-7 text-tinta-suave">Puede ser la conexión. Probá de nuevo en un momento.</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setIntento((n) => n + 1);
            }}
            className={botonPrincipal}
          >
            Reintentar
          </button>
          <Link href="/products" className="body-2 text-color-principal underline underline-offset-4">
            Volver al catálogo
          </Link>
        </div>
      </div>
    );

  const galleryImages = getGalleryImages(product, selectedVariante);

  // Configurador: estado → color → capacidad. Lo que no hay se ve deshabilitado, no se oculta.
  const estados = estadosDisponibles(product.variantes);
  const colores = coloresDelEstado(product.variantes, selectedVariante.esUsado);
  const capacidades = capacidadesDelColor(product.variantes, selectedVariante.esUsado, selectedVariante.color);

  const switchVariante = (next: Variante) => {
    if (next.id === selectedVariante.id) return;
    // La elección queda en el link (?v=) para poder compartir la configuración exacta.
    window.history.replaceState(null, "", `?v=${next.id}`);
    // Un cambio nuevo cancela el fade anterior: si no, un clic rápido dejaba la variante vieja.
    if (fadeRef.current) clearTimeout(fadeRef.current);
    setFading(true);
    fadeRef.current = setTimeout(() => {
      setSelectedVariante(next);
      setActiveImage(getGalleryImages(product, next)[0] ?? null);
      setFading(false);
    }, 150);
  };

  const elegir = (cambio: Partial<Eleccion>) => {
    const next = resolverVariante(product.variantes, {
      esUsado: selectedVariante.esUsado,
      color: selectedVariante.color,
      memoria: selectedVariante.memoria,
      ...cambio,
    });
    if (next) {
      setQuantity(1);
      switchVariante(next);
    }
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

  const specs = especificacionesDe(product.nombre);

  const sinStock = selectedVariante.stock < 1;
  const ultimas = selectedVariante.stock > 0 && selectedVariante.stock <= 3;
  // WhatsApp es ayuda secundaria: la venta se concreta en la web (DESIGN.md). El mensaje lleva la
  // configuración, el precio y el link, así quien atiende ve el mismo equipo sin preguntar.
  const estadoTexto = selectedVariante.esUsado ? "usado" : "nuevo sellado";
  const linkFicha = typeof window !== "undefined" ? ` ${window.location.origin}/products/${product.id}?v=${selectedVariante.id}` : "";
  const consultaWhatsApp = linkWhatsApp(
    `Hola, tengo una consulta sobre el ${product.nombre} ${selectedVariante.memoria} ${selectedVariante.color}, ` +
      `${estadoTexto}, a ${formatearPrecio(selectedVariante.precio)}.${linkFicha}`
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
              <p className="mt-0.5 text-sm text-tinta-suave">
                {textoCuotas(selectedVariante.precio)}. Pagás con tarjeta, débito o transferencia.
              </p>
            </div>

            {estados.length > 1 && (
              <fieldset>
                <legend className="mb-2.5 text-sm font-semibold">Estado</legend>
                <div className="grid grid-cols-2 gap-2.5">
                  {estados.map(({ esUsado, desde, hayStock }) => {
                    const activo = selectedVariante.esUsado === esUsado;
                    return (
                      <button
                        key={String(esUsado)}
                        type="button"
                        onClick={() => elegir({ esUsado })}
                        aria-pressed={activo}
                        className={`flex min-h-16 flex-col items-start justify-center rounded-control bg-white px-4 py-2.5 text-left transition-colors ${
                          activo ? "border-2 border-color-principal" : "border border-borde-fuerte hover:border-tinta-suave"
                        }`}
                      >
                        <span className="text-[15px] font-medium">{esUsado ? "Usado" : "Nuevo sellado"}</span>
                        <span className="text-[13px] text-tinta-suave tabular-nums">
                          {hayStock ? `Desde ${formatearPrecio(desde)}` : "Sin stock"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {colores.length > 1 && (
              <fieldset>
                <legend className="mb-2.5 text-sm font-semibold">
                  Color <span className="font-normal text-tinta-suave">{selectedVariante.color}</span>
                </legend>
                <div className="flex flex-wrap gap-2.5">
                  {colores.map(({ color, hayStock }) => {
                    const activo = selectedVariante.color === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => elegir({ color })}
                        aria-label={hayStock ? color : `${color}, sin stock`}
                        aria-pressed={activo}
                        className={`relative size-11 rounded-full bg-white p-[3px] border-2 transition-colors ${
                          activo ? "border-color-principal" : "border-borde hover:border-borde-fuerte"
                        }`}
                      >
                        <span
                          className={`block size-full rounded-full ${needsDarkBorder(color) ? "ring-1 ring-inset ring-black/15" : ""} ${hayStock ? "" : "opacity-40"}`}
                          style={{ backgroundColor: mapColorToHex(color) }}
                        />
                        {/* Sin stock en ninguna capacidad: se puede mirar, pero queda tachado. */}
                        {!hayStock && (
                          <span aria-hidden="true" className="absolute left-1/2 top-1/2 h-0.5 w-7 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded bg-tinta-suave" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {capacidades.length > 0 && (
              <fieldset>
                <legend className="mb-2.5 text-sm font-semibold">Capacidad</legend>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {capacidades.map(({ memoria, variante, disponible }) => {
                    const activo = selectedVariante.memoria === memoria;
                    return (
                      <button
                        key={memoria}
                        type="button"
                        onClick={() => elegir({ memoria })}
                        disabled={!disponible && !activo}
                        aria-pressed={activo}
                        className={`flex min-h-16 flex-col items-center justify-center rounded-control px-2 py-2 transition-colors disabled:cursor-not-allowed ${
                          activo
                            ? "border-2 border-color-principal bg-white"
                            : "border border-borde-fuerte bg-white enabled:hover:border-tinta-suave disabled:border-borde disabled:bg-superficie"
                        }`}
                      >
                        <span className={`text-[15px] font-medium ${disponible || activo ? "" : "text-tinta-suave line-through"}`}>
                          {memoria}
                        </span>
                        <span className="text-[13px] text-tinta-suave tabular-nums">
                          {disponible && variante
                            ? formatearPrecio(variante.precio)
                            : variante
                              ? "Sin stock"
                              : `No hay en ${selectedVariante.color.toLowerCase()}`}
                        </span>
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
                  : ultimas
                    ? selectedVariante.stock === 1
                      ? "En stock, queda la última unidad"
                      : `En stock, quedan las últimas ${selectedVariante.stock} unidades`
                    : `En stock, ${selectedVariante.stock} unidades para enviar`}
              </p>
              {sinStock && (
                <p className="text-sm text-tinta-suave">
                  <a
                    href={linkWhatsApp(
                      `Hola, quiero que me avisen cuando entre el ${product.nombre} ${selectedVariante.memoria} ${selectedVariante.color}, ${estadoTexto}.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-color-principal underline underline-offset-[3px] hover:text-color-principal-oscuro"
                  >
                    Avisame por WhatsApp cuando vuelva
                  </a>
                </p>
              )}
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
        {specs && (
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
        )}

        {/* ── Relacionados ── */}
        {relacionados.length > 0 && (
          <section aria-labelledby="relacionados" className="mt-20">
            <h2 id="relacionados" className="mb-5 text-[28px] font-semibold tracking-tight">También te puede interesar</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {relacionados.map(({ producto: p, desde }) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}?v=${desde.id}`}
                  className="group rounded-panel bg-superficie p-4 transition-colors hover:bg-borde"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={desde.imagenes?.[0] ?? p.imagenes?.[0] ?? "/placeholder.png"}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 25vw, 50vw"
                      className="object-contain p-3 mix-blend-multiply transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </div>
                  <p className="mt-3 text-[15px] font-semibold line-clamp-1">{p.nombre}</p>
                  <p className="mt-0.5 flex items-center justify-between text-sm text-tinta-suave tabular-nums">
                    Desde {formatearPrecio(desde.precio)}
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
