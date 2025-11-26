"use client";

import Image from "next/image";

const values = [
  {
    icon: "💡",
    title: "Claridad",
    text: "Nada de tecnicismos. Explicamos todo como si se lo contáramos a un amigo: lo que conviene, lo que no, y por qué.",
  },
  {
    icon: "🤝",
    title: "Confianza",
    text: "Cumplir lo que decimos es nuestra política. Si algo falla, lo resolvemos.",
    highlight: "Si algo falla, lo resolvemos.", // Opcional si quieres negrita específica
  },
  {
    icon: "🧍",
    title: "Cercanía",
    text: "Respondemos como personas, no como una empresa automatizada. Te hablamos en tu idioma, con buena onda y sin guiones.",
  },
  {
    icon: "💪",
    title: "Responsabilidad",
    text: "Damos la cara siempre. No desaparecemos después de la venta.",
  },
  {
    icon: "🎯",
    title: "Criterio",
    text: "No te vendemos lo más caro: te recomendamos lo que realmente te sirve.",
  },
  {
    icon: "⚡",
    title: "Velocidad",
    text: "Sabemos que nadie quiere esperar su iPhone. Priorizamos la entrega rápida y la comunicación constante.",
  },
];

const objectives = [
  "Simplificar la compra de iPhones en Argentina, con procesos claros y atención personalizada.",
  "Posicionar a WAVE como sinónimo de confianza, transparencia y cumplimiento.",
  "Fidelizar clientes con un servicio postventa humano y eficiente.",
  "Educar a los usuarios para que conozcan y aprovechen al máximo sus equipos.",
  "Expandir la marca a nuevos productos y servicios Apple, manteniendo la misma filosofía: claridad, criterio y confianza.",
];

export default function AboutPage() {
  return (
    <section className="max-w-7xl mx-auto py-18 px-4 flex flex-col gap-24">
      {/* SECCIÓN 1: QUIÉNES SOMOS 
        Orden: Imagen Izquierda - Texto Derecha 
      */}
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="shrink-0 relative w-[250px] h-[250px] md:w-[300px] md:h-[300px] rounded-full overflow-hidden shadow-md">
          <Image
            src={"/mic.jpg"}
            alt="Micrófono y equipo de grabación"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-[#05467D] mb-6">
            Quiénes somos
          </h1>
          <p className="text-[#05467D] leading-relaxed text-lg">
            Somos una marca argentina especializada en la{" "}
            <span className="font-bold">
              venta de iPhones online, con envíos a todo el país.
            </span>{" "}
            Nacimos para resolver un problema real: en Argentina, comprar un
            iPhone suele ser un dolor de cabeza. Precios que cambian, poca
            información, demoras y promesas que no se cumplen. Por eso decidimos
            hacer las cosas distintas. En WAVE, creemos que comprar tecnología
            no tiene que ser complicado ni exclusivo. Nuestro objetivo es que
            <span className="font-bold">
              {" "}
              cada persona pueda acceder a un iPhone original con confianza,
            </span>{" "}
            sabiendo exactamente qué está comprando, en cuánto tiempo lo va a
            recibir y con quién está tratando. Detrás de la marca{" "}
            <span className="font-bold">
              hay personas reales que responden, asesoran y acompañan.
            </span>{" "}
            Vendemos iPhones, sí. Pero lo que realmente ofrecemos es{" "}
            <span className="font-bold">
              claridad, confianza y tranquilidad.
            </span>
          </p>
        </div>
      </div>

      {/* SECCIÓN 2: MISIÓN Y VISIÓN (Nueva)
        Orden: Texto Izquierda - Imagen Derecha
      */}
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {/* Bloque de Texto (Primero en el código para que salga a la izquierda en Desktop) */}
        <div className="flex-1 text-center md:text-left order-2 md:order-1">
          <h2 className="text-3xl md:text-4xl font-bold text-[#05467D] mb-6">
            Nuestra misión y visión
          </h2>
          {/* Usamos space-y-4 para separar los párrafos sin usar <br> */}
          <div className="text-[#05467D] leading-relaxed text-lg space-y-4">
            <p>
              En Wave queremos que comprar un iPhone en Argentina sea una{" "}
              <span className="font-bold">
                experiencia simple, segura y sin vueltas.
              </span>{" "}
              Que cualquier persona, desde cualquier punto del país, pueda
              acceder a un equipo Apple original con la misma confianza que
              tendría en una tienda oficial. Acompañamos a cada cliente durante
              todo el proceso, desde la elección del modelo hasta la entrega y
              el soporte post-venta,{" "}
              <span className="font-bold">
                con atención real, sin letra chica, sin demoras y sin excusas.
              </span>
            </p>
            <p>
              Sabemos que un iPhone no es solo un teléfono: es una herramienta
              de trabajo, de estudio o de creación, por eso{" "}
              <span className="font-bold">cuidamos cada detalle</span> como si
              fuera nuestro propio equipo.
            </p>
            <p>
              Nuestra visión es convertirnos en la marca de iPhones más
              confiable de Argentina. Crecemos con propósito, cumpliendo lo que
              prometemos y manteniendo el trato cercano que nos caracteriza.{" "}
              <span className="font-bold">
                No buscamos ser los más grandes, sino los más confiables.
              </span>{" "}
              Porque en Wave, la confianza no se promete: se construye, día a
              día.
            </p>
          </div>
        </div>

        {/* Bloque de Imagen (Segundo en código, Derecha en Desktop) */}
        <div className="shrink-0 relative w-[250px] h-[250px] md:w-[300px] md:h-[300px] rounded-full overflow-hidden shadow-md order-1 md:order-2">
          <Image
            src={"/mic.jpg"}
            alt="Persona usando trípode con iPhone"
            fill
            className="object-cover"
          />
        </div>
      </div>
      {/* SECCIÓN 3: NUESTROS VALORES */}
      <div className="flex flex-col gap-12 w-full">
        <h2 className="text-3xl md:text-4xl font-bold text-[#05467D] text-center">
          Nuestros Valores
        </h2>

        {/* EL TRUCO (Scroll Snap + Grid Híbrido):
          - flex: Para que en móvil se pongan uno al lado del otro.
          - overflow-x-auto: Permite el scroll horizontal en móvil.
          - snap-x snap-mandatory: Hace que al deslizar el dedo, se "trabe" en la tarjeta (efecto imán).
          - md:grid md:grid-cols-3: En pantallas medianas/grandes, desactivamos el scroll y usamos grilla de 3 columnas.
        */}
        <div className="flex gap-6  overflow-x-auto pb-8 snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
          {values.map((val, index) => (
            <div
              key={index}
              // min-w-[85vw]: En móvil, cada tarjeta ocupa el 85% del ancho de pantalla (para que se vea que hay otra al lado).
              // snap-center: El punto de anclaje del carrusel.
              className="min-w-[85vw] md:min-w-0 snap-center bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.16)] border border-gray-100 flex flex-col items-center text-center gap-4  transition-shadow "
            >
              <span className="text-4xl" role="img" aria-label={val.title}>
                {val.icon}
              </span>
              <h3 className="text-xl font-bold text-[#05467D]">{val.title}</h3>
              <p className="text-[#05467D]/80 leading-relaxed text-sm">
                {/* Lógica simple para renderizar negritas si es necesario, 
                    o simplemente renderizar el texto plano */}
                {val.text.split(/(:|\.)/).map((part, i, arr) => {
                  // Un pequeño hack para detectar las partes clave según tu imagen
                  // O podes renderizar val.text directo si no queres complicarte con negritas dinámicas
                  if (
                    part.includes("lo que conviene") ||
                    part.includes("Si algo falla") ||
                    part.includes("como personas") ||
                    part.includes("Damos la cara") ||
                    part.includes("te recomendamos") ||
                    part.includes("Priorizamos")
                  ) {
                    return (
                      <span key={i} className="font-bold text-[#05467D]">
                        {part}
                      </span>
                    );
                  }
                  return part;
                })}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* SECCIÓN 4: NUESTROS OBJETIVOS */}
      <div className="flex flex-col gap-12 w-full pb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-[#05467D] text-center ">
          Nuestros objetivos
        </h2>

        <div className="flex flex-col  gap-8 md:gap-0">
          {objectives.map((text, index) => {
            const number = index + 1;
            const isEven = number % 2 === 0; // Para saber si es el 2 o el 4

            return (
              // CONTENEDOR FILA
              <div
                key={index}
                className="flex flex-col py-4 items-center text-center md:grid md:grid-cols-[1fr_auto_1fr] md:gap-x-12 md:text-left"
              >
                {/* --- COLUMNA IZQUIERDA --- */}
                {/* Si es PAR (2,4), mostramos el texto aquí. Si no, div vacío para ocupar espacio */}
                <div
                  className={`order-2 md:order-1 ${
                    isEven ? "md:text-right" : ""
                  }`}
                >
                  {isEven && (
                    <p className="text-[#05467D] font-medium text-lg leading-relaxed max-w-md ml-auto">
                      {text}
                    </p>
                  )}
                </div>

                {/* --- COLUMNA CENTRAL (NÚMERO) --- */}
                {/* El número siempre va en el medio en desktop */}
                <div className="order-1 md:order-2 flex justify-center items-center">
                  <span className="text-6xl font-bold text-[#05467D]">
                    {number}.
                  </span>
                </div>

                {/* --- COLUMNA DERECHA --- */}
                {/* Si es IMPAR (1,3,5), mostramos el texto aquí. Si no, div vacío */}
                <div className="order-3 md:order-3">
                  {!isEven && ( // Si NO es par (es impar)
                    <p className="text-[#05467D] font-medium text-lg leading-relaxed max-w-md mr-auto">
                      {text}
                    </p>
                  )}
                  {/* En MÓVIL, si es PAR, necesitamos mostrar el texto acá abajo también porque ocultamos la columna izquierda arriba?
                      NO, en móvil usamos Flex-col, así que simplemente renderizamos el texto debajo del número siempre.
                      Para lograr eso, hacemos un pequeño truco visual en móvil:
                  */}
                  <p className="md:hidden mt-4 text-[#05467D] font-medium text-lg leading-relaxed px-4">
                    {text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
