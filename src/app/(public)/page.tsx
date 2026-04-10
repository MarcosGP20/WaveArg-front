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

// Rutas de recursos
const ASSET_PATHS = {
  VIDEO: "/wave-video-portada.mp4",
  VIDEO_TEST: "/wave-testimonios.mp4",
  IPHONE_IMG: "/iphone-div-landing.jpg",
  CREATORS_IMG: "/wave-imagen-web.png",
  MIC_IMG: "mic.jpg",
  TRIPODE_IMG: "tripode.jpg",
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

  // --- Tu código de animaciones (sin cambios) ---
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Ref independiente para la segunda sección animada (creadores)
  const containerRef2 = useRef<HTMLDivElement>(null);
  const { scrollYProgress: scrollYProgress2 } = useScroll({
    target: containerRef2,
    offset: ["start end", "end start"],
  });
  const scale2 = useTransform(scrollYProgress2, [0, 0.5, 1], [0.6, 1, 1.2]);
  const opacity2 = useTransform(scrollYProgress2, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

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
          <section className="relative h-screen w-full">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={ASSET_PATHS.VIDEO} type="video/mp4" />
            </video>
          </section>

          {/* Sección productos (Con animación 1) */}
          <section
            ref={containerRef}
            className="relative h-screen bg-white flex items-center justify-center px-2 md:px-4"
          >
            <motion.div style={{ scale, opacity }} className="relative w-full">
              {/* ...el resto de tu div de producto... */}
              <div className="relative h-[95vh] bg-gray-900 rounded-2xl md:rounded-2xl overflow-hidden">
                <img
                  src={ASSET_PATHS.IPHONE_IMG}
                  alt="iPhone Detail"
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

          <section
            ref={containerRef2}
            className="relative min-h-screen bg-gray-50 flex items-center justify-center py-20 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
              {/* --- LADO IZQUIERDO (Imágenes) --- */}
              <motion.div
                style={{ scale: scale2, opacity: opacity2 }}
                className="relative origin-left"
              >
                <div className="absolute top-0 left-0 w-64 h-64 md:w-80 md:h-80">
                  <img
                    src={ASSET_PATHS.TRIPODE_IMG}
                    alt="Creador con trípode"
                    className="w-full h-[300px] object-cover rounded-[85px] shadow-2xl"
                    loading="lazy"
                  />
                </div>
                <div className="absolute top-20 right-10 md:top-40 w-56 h-56 md:w-72 md:h-72 z-10">
                  <img
                    src={ASSET_PATHS.MIC_IMG}
                    alt="Micrófono profesional"
                    className="w-full h-[300px] object-cover rounded-[85px] shadow-2xl"
                    loading="lazy"
                  />
                </div>
                {/* Espaciador */}
                <div className="w-full h-96 md:h-[500px]"></div>
              </motion.div>

              {/* --- LADO DERECHO (Texto) --- */}
              <motion.div
                style={{ scale: scale2, opacity: opacity2 }}
                className="space-y-8 origin-right"
              >
                <div>
                  <h2 className="text-4xl md:text-4xl font-bold text-color-principal mb-6">
                    Guía para creadores
                  </h2>
                  <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-8">
                    Descubrí qué dispositivos y herramientas te ayudan a crear
                    contenido de calidad y potenciar tus ideas. Tips prácticos,
                    recomendaciones reales y asesoría pensada para creadores.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-color-principal text-white px-8 py-4 rounded-full hover:bg-color-principal-oscuro transition-colors text-lg font-medium cursor-pointer">
                    <Link href="/creadores">Ver la guía</Link>
                  </button>
                </div>
              </motion.div>
            </div>
          </section>
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
