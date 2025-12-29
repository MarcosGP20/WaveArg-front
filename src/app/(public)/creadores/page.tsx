import { LazyVideoFacade } from "@/components/VideoPlayer";

export default function Creadores() {
  return (
    <>
      <section className=" flex flex-col items-center justify-center text-center mt-20 px-4 py-20">
        <div className="max-w-2xl">
          <h2 className=" text-center text-[#05467D] text-4xl font-semibold mb-6">
            Guia para creadores de contenido
          </h2>
          <p className="text-center text-lg text-[#05467D] mt-4 mb-10 px-4 md:px-0">
            Todo lo que necesitas para crear contenido de calidad, elegir el
            equipo correcto y sacarle máximo provecho a tu iPhone o Mac
          </p>
          <button className="mt-4 bg-[#05467D] text-white font-medium py-3 px-8 rounded-full transition-colors cursor-pointer">
            Quiero una asesoria!
          </button>
        </div>
      </section>
      <section className=" max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12">
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
            Aprendé con <span className="font-bold">nuestros expertos</span> a
            dominar tu equipo.
          </h3>
          <p className="text-gray-600 mb-8">
            Descubrí cómo configurar la cámara de tu iPhone para grabar en 4K y
            qué apps usar para editar como un profesional.
          </p>
          <button className="bg-[#4276a4] text-white px-8 py-3 rounded-full">
            Ver tutorial completo
          </button>
        </div>
      </section>
    </>
  );
}
