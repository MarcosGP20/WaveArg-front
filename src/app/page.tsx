"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";

// componentes
import CommunitySection from "../components/CommunitySection";
import FAQSection from "../components/FAQSection";
import VideoLoader from "../components/VideoLoader";

// Rutas de recursos
const ASSET_PATHS = {
  VIDEO: "/wave-video-portada.mp4",
  IPHONE_IMG: "/iphone-div-landing.jpg",
  CREATORS_IMG: "/wave-imagen-web.png",
  MIC_IMG: "mic.jpg",
  TRIPODE_IMG: "tripode.jpg",
};

export default function HomePage() {
  // 2. CREA EL ESTADO DE CARGA
  const [isLoading, setIsLoading] = useState(true);

  // 3. USA useEffect PARA VERIFICAR LA SESIÓN
  // Esto hace que el loader solo aparezca 1 VEZ por sesión de navegador.

  // 4. CREA LA FUNCIÓN QUE SE LLAMARÁ CUANDO EL VIDEO TERMINE
  const handleVideoLoaded = () => {
    setIsLoading(false); // Oculta el loader
    sessionStorage.setItem("hasVisited", "true"); // Marca la sesión como "visitada"
  };

  // --- Tu código de animaciones (sin cambios) ---
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 1.1]);
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
              <div className="relative h-[95vh] bg-gray-900 rounded-xl md:rounded-3xl overflow-hidden">
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
                        <button className="bg-[#05467D] hover:bg-gray-500 text-white px-8 py-3 rounded-full">
                          Ver más
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Sección - Guía para creadores */}
          <section className="relative min-h-screen bg-gray-50 flex items-center justify-center py-20">
            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
              {/* Lado izquierdo - Imágenes circulares (las 2 juntas) */}
              <div className="relative">
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
                {/* Este div da el espacio para que el texto no se superponga */}
                <div className="w-full h-96 md:h-[500px]"></div>
              </div>

              {/* Lado derecho - Contenido de texto */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl md:text-4xl font-bold text-[#05467D] mb-6">
                    Guía para creadores
                  </h2>
                  <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-8">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-[#05467D] text-white px-8 py-4 rounded-full hover:bg-[#043d6b] transition-colors text-lg font-medium">
                    Ver más
                  </button>
                </div>
              </div>
            </div>
          </section>
          <CommunitySection />
          <FAQSection />
        </main>
      )}
    </>
  );
}
