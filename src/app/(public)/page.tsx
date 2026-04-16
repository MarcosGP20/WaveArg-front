"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// componentes
import CommunitySection from "../../components/CommunitySection";
import FAQSection from "../../components/FAQSection";
import VideoLoader from "../../components/VideoLoader";
import { LazyVideoFacade } from "../../components/VideoPlayer";
import IPhoneCarousel, { CarouselItem } from "../../components/IPhoneCarousel";
import BentoCreadores from "../../components/BentoCreadores";

// API
import { getProductos } from "../../lib/api";
import type { Producto } from "../../interfaces/producto";

// ─────────────────────────────────────────────────────────────────────────────
// Deriva 2-3 specs clave a partir del nombre/modelo del producto
// ─────────────────────────────────────────────────────────────────────────────
function toSpecs(p: Producto): CarouselItem["specs"] {
  const name = p.nombre.toLowerCase();
  const specs: CarouselItem["specs"] = [];

  // Cámara: Pro tiene Fusion 48MP; base tiene 12MP
  if (name.includes("pro")) {
    specs.push({ icon: "📷", label: "Cámara 48MP Fusion" });
  } else {
    specs.push({ icon: "📷", label: "Cámara 12MP avanzada" });
  }

  // ProRes / video: solo modelos Pro
  if (name.includes("pro max")) {
    specs.push({ icon: "🎬", label: "4K 120fps ProRes" });
  } else if (name.includes("pro")) {
    specs.push({ icon: "🎥", label: "Video ProRes 4K" });
  } else {
    specs.push({ icon: "🎥", label: "Video Dolby Vision HDR" });
  }

  // Conectividad / pantalla: siempre
  specs.push({ icon: "⚡", label: "5G + Face ID" });

  return specs;
}

// ─────────────────────────────────────────────────────────────────────────────
// Transforma un Producto de la API en un CarouselItem
// ─────────────────────────────────────────────────────────────────────────────
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

// Rutas de recursos
const ASSET_PATHS = {
  VIDEO: "/wave-video-portada.mp4",
  IPHONE_IMG: "/iphone-div-landing.jpg",
};

export default function HomePage() {
  // Loader solo se muestra la primera vez por sesión de navegador.
  // La función inicializadora corre solo en el cliente (no en SSR).
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window === "undefined") return false; // SSR: nunca mostrar
    return !sessionStorage.getItem("hasVisited"); // false si ya visitó
  });

  const handleVideoLoaded = () => {
    setIsLoading(false);
    sessionStorage.setItem("hasVisited", "true");
  };

  // ── Carrusel: fetch de productos reales ──
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [carouselLoading, setCarouselLoading] = useState(true);

  useEffect(() => {
    getProductos()
      .then((productos) => setCarouselItems(productos.map(toCarouselItem)))
      .catch((err) =>
        console.error("Error cargando productos para carrusel:", err),
      )
      .finally(() => setCarouselLoading(false));
  }, []);

  // --- Tu código de animaciones (sin cambios) ---
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // 5. MODIFICA EL RETURN CON EL CONDICIONAL
  return (
    <>
      {isLoading ? (
        // Si 'isLoading' es true, muestra el loader
        <VideoLoader onLoaded={handleVideoLoaded} />
      ) : (
        // Si 'isLoading' es false, muestra tu página normal
        <main>
          {/* Hero - Video */}
          <section className="relative h-screen w-full overflow-hidden">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={ASSET_PATHS.VIDEO} type="video/mp4" />
            </video>

            {/* Overlay gradient + CTA */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end pb-16 px-6 md:px-16 lg:px-24">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
                className="max-w-2xl"
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/60 mb-3 font-medium">
                  Tu próximo iPhone, al mejor precio
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                  Tecnología Apple que <br className="hidden md:block" />{" "}
                  acompaña tu ritmo.
                </h1>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors duration-200"
                  >
                    Ver iPhones
                  </Link>
                  <Link
                    href="/accesorios"
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/20 transition-colors duration-200"
                  >
                    Ver accesorios
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Carrusel de iPhones */}
          <section className="bg-[#F5F5F5] py-14 px-4 md:px-8">
            <div className="w-[90%] max-w-6xl mx-auto">
              <p className="text-center text-xs font-semibold uppercase tracking-[0.15em] text-[#05467D]/60 mb-2">
                Nuestros modelos
              </p>
              <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                Encontrá tu iPhone ideal
              </h2>
              {carouselLoading ? (
                /* Skeleton — misma forma que la card real */
                <div className="w-full rounded-2xl border border-gray-100 shadow-md overflow-hidden flex flex-col md:flex-row min-h-[360px] md:min-h-[500px] animate-pulse">
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
              ) : (
                <IPhoneCarousel items={carouselItems} />
              )}
            </div>
          </section>

          {/* Sección productos (Con animación 1) */}
          <section
            ref={containerRef}
            className="relative h-screen bg-white flex items-center justify-center px-2 md:px-4 overflow-hidden"
          >
            <motion.div style={{ scale, opacity }} className="relative w-full">
              {/* ...el resto de tu div de producto... */}
              <div className="relative h-[95vh] bg-gray-900 rounded-2xl md:rounded-2xl overflow-hidden">
                <img
                  src={ASSET_PATHS.IPHONE_IMG}
                  alt="iPhone – conocé nuestros productos"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 flex items-end p-6 md:p-12">
                  <div className="text-white">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                      Conocé nuestros productos
                    </h2>
                    <div className="flex gap-4">
                      <a href="/products">
                        <button className="bg-color-principal hover:bg-color-principal-oscuro text-white px-8 py-3 rounded-full cursor-pointer">
                          Ver más
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          <BentoCreadores />
          <CommunitySection />
          <LazyVideoFacade
            mode="testimonial"
            videoUrlMp4="/wave-testimonios.mp4"
            posterUrl="/posterURL.webp"
          />
          <FAQSection />
        </main>
      )}
    </>
  );
}
