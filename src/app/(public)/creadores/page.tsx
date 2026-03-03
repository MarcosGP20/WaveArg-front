import { LazyVideoFacade } from "@/components/VideoPlayer";
import IPhoneCarousel from "@/components/IPhoneCarousel";
import Link from "next/link";
import Image from "next/image";

const creatorTools = [
  {
    title: "MacBook Pro M3/M4/M5",
    description: [
      "Flujos pesados.",
      "Edición profesional.",
      "Trabajo intensivo.",
    ],
    image: "/macbook-pro.png", // Asegurate de que estas rutas sean correctas en /public
    button: false,
  },
  {
    title: "MacBook Air M3/M4",
    description: [
      "Batería de todo el día.",
      "Render rápido.",
      "Ideal para creadores.",
    ],
    image: "/macbook-air.png",
    button: false,
  },
  {
    title: "iPad (AIR/PRO)",
    description: [
      "Ideal para edición rápida.",
      "Potente y liviano.",
      "Súper práctico para viajes.",
    ],
    image: "/ipad.jpg",
    button: true,
    buttonText: "Ver disponibles",
  },
];

export default function Creadores() {
  return (
    <>
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center mt-20  px-4 py-20">
        <div className="max-w-4xl">
          <h2 className="text-center text-[#05467D] text-5xl font-bold mb-6">
            Guía para creadores de contenido
          </h2>
          <p className="text-center text-2xl text-[#05467D] mt-4 mb-10 px-4 md:px-0">
            Todo lo que necesitas para crear contenido de calidad, elegir el
            equipo correcto y sacarle máximo provecho a tu iPhone o Mac
          </p>
          <Link
            href="/contacto"
            className="mt-4 inline-block bg-[#05467D] text-white font-medium py-3 px-8 rounded-full transition-colors cursor-pointer hover:bg-[#03305a]"
          >
            Quiero una asesoria!
          </Link>
        </div>
      </section>

      {/* Video Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12 mt-10 md:mt-20">
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-[320px] aspect-[9/16] rounded-[3rem] overflow-hidden shadow-2xl bg-gray-200">
            <LazyVideoFacade
              mode="creator"
              videoUrlMp4="/Tips-Creadores.mp4"
              posterUrl="/thumb-creadores.jpg"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h3 className="text-3xl font-normal text-[#004a80] mb-6">
            Trabajamos con <span className="font-bold">creadores reales</span>{" "}
            que usan estos equipos todos los dias para
            <span className="font-bold"> grabar, editar y trabajar.</span>
          </h3>
          <a
            href="#equipos"
            className="bg-[#05467D] text-white px-8 py-3 rounded-full hover:bg-[#043d6b] transition-colors inline-block"
          >
            Ver equipos recomendados
          </a>
        </div>
      </section>

      {/* iPhone Selection Section (Espacio para el carrusel futuro) */}
      <section className="flex flex-col items-center justify-center text-center mt-10 px-4 py-10">
        <h3 className="text-[#05467D] text-3xl font-bold mb-10">
          ¿Qué iPhone elegir para crear contenido?
        </h3>
        <IPhoneCarousel />
      </section>

      {/* Zig-Zag Section: ¿Con qué editar? */}
      <section id="equipos" className="max-w-5xl mx-auto px-6 py-20">
        <h3 className="text-[#05467D] text-3xl font-bold text-center mb-16">
          ¿Con qué editar tu contenido?
        </h3>

        <div className="space-y-24">
          {creatorTools.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col items-center justify-between gap-12 md:flex-row ${
                index % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Contenedor de Imagen */}
              <div className="w-full md:w-1/2 flex justify-center">
                <img
                  src={item.image}
                  alt={item.title}
                  className="max-w-full h-auto object-contain transition-transform duration-500 hover:scale-105"
                  style={{ maxHeight: "350px" }}
                />
              </div>

              {/* Contenedor de Texto */}
              <div className="w-full md:w-1/2 flex flex-col items-start text-left">
                <h4 className="text-[#05467D] text-2xl md:text-3xl font-bold mb-4">
                  {item.title}
                </h4>
                <ul className="space-y-3 mb-8">
                  {item.description.map((line, i) => (
                    <li
                      key={i}
                      className="flex items-center text-[#05467D] text-lg"
                    >
                      <span className="mr-3 text-xl font-bold">✓</span>
                      {line}
                    </li>
                  ))}
                </ul>

                {item.button && (
                  <button className="bg-[#05467D] hover:bg-[#043d6b] text-white rounded-full px-6 py-2.5 text-base font-medium transition-colors cursor-pointer">
                    {item.buttonText}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Banner de Accesorios */}
      <section className="max-w-full mx-auto px-6 py-10">
        <div className="relative w-full h-[70vh] md:h-[85vh] rounded-[2rem] overflow-hidden shadow-xl">
          {/* Imagen de fondo */}
          <img
            src="/accesorios.png" // Reemplaza por tu ruta
            alt="Accesorios para creadores"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Overlay oscuro para legibilidad (opcional pero recomendado) */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Contenido arriba de la imagen */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <h3 className="text-white text-3xl md:text-4xl font-bold mb-4 drop-shadow-md">
              Accesorios que hacen la diferencia
            </h3>
            <p className="text-white text-lg md:text-xl max-w-xl mb-8 drop-shadow-sm">
              No se trata solo del iPhone. Los accesorios correctos elevan tu
              contenido al siguiente nivel.
            </p>

            <button className="bg-white/90 hover:bg-white text-[#05467D] rounded-full px-8 py-2.5 text-base font-semibold transition-colors cursor-pointer">
              Ver accesorios
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
