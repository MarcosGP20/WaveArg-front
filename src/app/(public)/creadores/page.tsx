import { LazyVideoFacade } from "@/components/VideoPlayer";
import Button from "@mui/material/Button";
import Image from "next/image"; // Recomendado para Next.js

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
          <button className="mt-4 bg-[#05467D] text-white font-medium py-3 px-8 rounded-full transition-colors cursor-pointer hover:bg-[#03305a]">
            Quiero una asesoria!
          </button>
        </div>
      </section>

      {/* Video Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12 mt-30">
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
          <button className="bg-[#05467D] text-white px-8 py-3 rounded-full hover:bg-[#043d6b] transition-colors">
            Ver equipos recomendados
          </button>
        </div>
      </section>

      {/* iPhone Selection Section (Espacio para el carrusel futuro) */}
      <section className="flex flex-col items-center justify-center text-center mt-10 px-4 py-10">
        <h3 className="text-[#05467D] text-3xl font-bold mb-10">
          ¿Qué iPhone elegir para crear contenido?
        </h3>
        {/* Aquí irá el carrusel cuando esté listo */}
        <div className="w-full h-40 bg-gray-50 rounded-xl flex items-center justify-center border-dashed border-2 border-gray-200 text-gray-400">
          Espacio para el carrusel de iPhones
        </div>
      </section>

      {/* Zig-Zag Section: ¿Con qué editar? */}
      <section className="max-w-5xl mx-auto px-6 py-20">
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
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#05467D",
                      borderRadius: " calc(infinity * 1px)",
                      padding: "10px 24px",
                      textTransform: "none",
                      fontSize: "1rem",
                      fontWeight: "500",
                      "&:hover": {
                        backgroundColor: "#043d6b",
                      },
                    }}
                  >
                    {item.buttonText}
                  </Button>
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

            <Button
              variant="contained"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                color: "#05467D",
                borderRadius: "50px",
                padding: "10px 30px",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: "600",
                "&:hover": {
                  backgroundColor: "#ffffff",
                },
              }}
            >
              Ver accesorios
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
