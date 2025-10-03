"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// Componente para la sección de comunidad
const CommunitySection = () => {
  return (
    <section className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[600px] flex items-center">
          {/* Imagen de fondo */}
          <img
            src="/wave-comunidad.jpg"
            alt="Comunidad móvil"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay oscuro */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Contenido centrado verticalmente */}
          <div className="relative z-10 max-w-2xl px-8 md:px-12 lg:px-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Unite a nuestra comunidad
            </h2>

            <p className="text-gray-200 text-lg mb-10 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-full transition-colors">
                ¡Quiero unirme!
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full transition-colors">
                ¡Quiero unirme!
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Componente para FAQ (placeholder)
const FAQSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Preguntas Frecuentes
        </h2>
        <p className="text-xl text-gray-600 mb-12">
          Resolvé tus dudas sobre nuestros productos y servicios
        </p>

        {/* Aquí irá tu acordeón cuando lo implementes */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <p className="text-gray-600">
            Acordeón de FAQs pendiente de implementar
          </p>
        </div>
      </div>
    </section>
  );
};

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const creatorsSectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const { scrollYProgress: creatorsScrollY } = useScroll({
    target: creatorsSectionRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Animaciones para las imágenes circulares
  const leftImageX = useTransform(creatorsScrollY, [0, 1], [-100, 0]);
  const rightImageX = useTransform(creatorsScrollY, [0, 1], [100, 0]);
  const textY = useTransform(creatorsScrollY, [0, 1], [50, 0]);

  return (
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
          <source src="/animacion.mp4" type="video/mp4" />
        </video>
      </section>

      {/* Sección productos */}
      <section
        ref={containerRef}
        className="relative h-screen bg-white flex items-center justify-center px-2 md:px-4"
      >
        <motion.div style={{ scale, opacity }} className="relative w-full">
          <div className="relative h-[95vh] bg-gray-900 rounded-xl md:rounded-3xl overflow-hidden">
            <img
              src="/iphone-div-landing.jpg"
              alt="iPhone Detail"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-end p-6 md:p-12">
              <div className="text-white">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  Conocé nuestros productos
                </h2>
                <div className="flex gap-4">
                  <button className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-full border border-white/30">
                    Ver más
                  </button>
                  <button className="bg-blue-600 text-white px-8 py-3 rounded-full">
                    Ver más
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Sección - Guía para creadores */}
      <section
        ref={creatorsSectionRef}
        className="relative min-h-screen bg-gray-50 flex items-center justify-center py-20"
      >
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          {/* Lado izquierdo - Imágenes circulares */}
          <div className="relative">
            {/* Imagen circular superior izquierda */}
            <motion.div
              style={{ x: leftImageX }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute top-0 left-0 w-64 h-64 md:w-80 md:h-80"
            >
              <img
                src="/tripode.jpg"
                alt="Creador con trípode"
                className="w-full h-[300px] object-cover rounded-[85px] shadow-2xl"
              />
            </motion.div>

            {/* Imagen circular inferior derecha */}
            <motion.div
              style={{ x: rightImageX }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute top-32 right-0 md:top-40 w-56 h-56 md:w-72 md:h-72 z-10"
            >
              <img
                src="/mic.jpg"
                alt="Micrófono profesional"
                className="w-full h-[300px] object-cover rounded-[85px] shadow-2xl"
              />
            </motion.div>

            {/* Espacio para mantener la altura */}
            <div className="w-full h-96 md:h-[500px]"></div>
          </div>

          {/* Lado derecho - Contenido de texto */}
          <motion.div
            style={{ y: textY }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-4xl md:text-4xl font-bold text-[#05467D] mb-6">
                Guía para creadores
              </h2>
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-8">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-[#05467D] text-white px-8 py-4 rounded-full hover:bg-[#043d6b] transition-colors text-lg font-medium">
                Ver más
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sección Comunidad */}
      <CommunitySection />

      {/* Sección FAQ */}
      <FAQSection />
    </main>
  );
}
