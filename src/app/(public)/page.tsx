import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import FAQSection from "@/components/FAQSection";
import HomeLoader from "@/components/HomeLoader";
import { LazyVideoFacade } from "@/components/VideoPlayer";
import HeroVideo from "@/components/home/HeroVideo";
import ParteDeStock from "@/components/home/ParteDeStock";
import { linkWhatsApp } from "@/lib/whatsapp";

// Home con la identidad "Parte de olas" (DESIGN.md). Server Component (front#15): el texto viene
// en el HTML; el video de portada y el parte de stock son islas cliente. Lo central es el parte:
// el resto de la página queda quieto y en segundo plano.

// Es una secuencia real (lo que pasa desde que elegís hasta que lo usás), por eso va numerada.
const PASOS = [
  { titulo: "Elegís el equipo", detalle: "Modelo, color, capacidad y estado. Lo que ves en el parte está en stock." },
  { titulo: "Pagás con Mercado Pago", detalle: "Tarjeta, débito o transferencia, sin salir de la web." },
  { titulo: "Lo despachamos", detalle: "En 24/48 hs hábiles a todo el país, con número de seguimiento." },
  { titulo: "Tenés 3 meses de garantía", detalle: "Escrita, en nuevos y usados. Si algo falla, respondemos nosotros." },
];

// Mensajes reales de clientes (los mismos del video de testimonios).
const MENSAJES = [
  "Está flamaaaa, gracias!",
  "Perfecto! Muchas gracias por la atención, te volví loco, un genio!",
  "Excelentísima atención pre y post venta! Gracias por la paciencia!",
  "De USA directo a casa! Muchas gracias!",
  "Gracias, hermoso el celu!! Son lo más",
];

const INSTAGRAM = "https://www.instagram.com/wavearg__";

const tituloSeccion = "font-display font-extrabold tracking-[-0.025em] leading-[0.98] text-[clamp(32px,4.2vw,52px)]";

export default function HomePage() {
  return (
    <>
      <HomeLoader />

      {/* ── Hero: video de portada (trae el titular y el teléfono) ── */}
      <section className="relative h-svh w-full overflow-hidden bg-[#05080F]">
        {/* El titular está dibujado en el video; acá va en texto para buscadores y lectores de pantalla. */}
        <h1 className="sr-only">Tu próximo iPhone, en tus manos</h1>
        <HeroVideo />
      </section>

      <ParteDeStock />

      {/* ── Cómo es comprar ── */}
      <section aria-labelledby="como-comprar" className="mx-auto max-w-6xl px-4 py-24 md:py-32">
        <h2 id="como-comprar" className={`max-w-[22ch] ${tituloSeccion}`}>
          Comprar un iPhone en Argentina no debería ser un dolor de cabeza.
        </h2>
        <ol className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {PASOS.map((paso, i) => (
            <li key={paso.titulo} className="border-t-2 border-tinta pt-5">
              <span aria-hidden="true" className="font-display text-[44px] font-extrabold leading-none tabular-nums text-color-principal [font-variation-settings:'wdth'_112]">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{paso.titulo}</h3>
              <p className="mt-1.5 text-tinta-suave">{paso.detalle}</p>
            </li>
          ))}
        </ol>
        <p className="mt-12 text-tinta-suave">
          ¿Tenés un iPhone para entregar? Lo tomamos como parte de pago.{" "}
          <a
            href={linkWhatsApp("Hola, quiero cotizar mi iPhone para el plan canje.")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-color-principal underline underline-offset-[3px] hover:text-color-principal-oscuro"
          >
            Cotizalo por WhatsApp
          </a>
        </p>
      </section>

      {/* ── Testimonios: son mensajes de Instagram, se muestran como un chat ── */}
      <section aria-labelledby="clientes" className="bg-superficie">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-16 md:py-32">
          <div>
            <h2 id="clientes" className={tituloSeccion}>Lo que nos escriben</h2>
            <p className="mt-3 text-tinta-suave">Mensajes que nos mandaron clientes por Instagram.</p>
            <ul className="mt-10 flex flex-col items-start gap-2.5">
              {MENSAJES.map((texto) => (
                <li key={texto} className="max-w-[34ch] rounded-[22px] rounded-bl-md bg-white px-5 py-3 text-[17px] leading-snug">
                  {texto}
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-panel">
            <LazyVideoFacade
              mode="testimonial"
              altText="Testimonios de clientes de Wave"
              videoUrlMp4="/Wave-testimonios.mp4"
              posterUrl="/posterURL.webp"
            />
          </div>
        </div>
      </section>

      {/* ── Creadores ── */}
      <section aria-labelledby="creadores" className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-24 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-16 md:py-32">
        <div>
          <h2 id="creadores" className={tituloSeccion}>Para los que graban y editan</h2>
          <p className="mt-4 max-w-[44ch] text-lg text-tinta-suave">
            Armamos una guía con los equipos que usan los creadores todos los días: qué iPhone, qué
            micrófono y con qué editan.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link href="/creadores" className="inline-flex min-h-13 items-center rounded-control border border-borde-fuerte px-6 font-semibold transition-colors hover:border-tinta">
              Ver la guía para creadores
            </Link>
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-medium text-color-principal underline underline-offset-[3px]">
              Seguinos en Instagram
              <ArrowUpRight size={16} strokeWidth={1.75} aria-label="(se abre en otra pestaña)" />
            </a>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-panel bg-atlantico">
          <Image src="/celu-wave-perfil-ig.webp" alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
      </section>

      <FAQSection />
    </>
  );
}
