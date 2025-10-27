// src/components/CommunitySection.tsx
"use client"; // Necesario para los hooks
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image"; // Buena práctica usar Next/Image

export default function CommunitySection() {
  // 1. Creamos la ref para medir el scroll
  const sectionRef = useRef<HTMLDivElement>(null);

  // 2. Configuramos los hooks de scroll y transform
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    // 3. Asignamos la ref al contenedor principal
    <section ref={sectionRef} className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* 4. Aplicamos la animación al div que contiene la imagen y el texto */}
        <motion.div
          style={{ scale, opacity }}
          className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[600px] flex items-center"
        >
          <Image
            src="/wave-comunidad.jpg"
            alt="Comunidad móvil"
            fill // Rellena el contenedor padre
            className="object-cover" // Mantiene el aspect ratio
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 max-w-2xl px-8 md:px-12 lg:px-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Únete a nuestra comunidad
            </h2>
            <p className="text-gray-200 text-lg mb-10 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://www.instagram.com/wavearg__?igsh=NWNxdXZjbDFkMHc4"
                target="_blank"
              >
                <button className="bg-[#05467D] hover:bg-gray-500 text-white px-8 py-3 rounded-full transition-colors">
                  ¡Quiero unirme!
                </button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
