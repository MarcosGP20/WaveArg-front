import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import FAQSection from "@/components/FAQSection";
import HomeLoader from "@/components/HomeLoader";
import { LazyVideoFacade } from "@/components/VideoPlayer";
import LineaOla from "@/components/home/LineaOla";
import ParteDeStock from "@/components/home/ParteDeStock";
import TelefonoOla from "@/components/home/TelefonoOla";
import TituloOla from "@/components/home/TituloOla";

// Home con la identidad "Parte de olas" (DESIGN.md). Server Component (front#15): el texto viene
// en el HTML; el teléfono 3D y el parte de stock son islas cliente. Lo único que se mueve solo es
// el hero (la ola tipográfica una vez y el teléfono); el resto de la página queda quieto.

const RAZONES = [
  { titulo: "Stock real", detalle: "Lo que ves en el parte está para enviar hoy." },
  { titulo: "3 meses de garantía", detalle: "En todos los equipos, nuevos y usados. Escrita." },
  { titulo: "Plan canje", detalle: "Tu iPhone actual paga parte del nuevo." },
  { titulo: "Envío a todo el país", detalle: "Despachamos en 24/48 hs hábiles, con seguimiento." },
];

// Mensajes reales de clientes (los mismos del video de testimonios).
const TESTIMONIOS = [
  { texto: "Está flamaaaa, gracias!", fondo: "bg-espuma" },
  { texto: "Perfecto! Muchas gracias por la atención, te volví loco, un genio!", fondo: "bg-atlantico text-espuma" },
  { texto: "Excelentísima atención pre y post venta! Gracias por la paciencia!", fondo: "bg-espuma" },
  { texto: "De USA directo a casa! Muchas gracias!", fondo: "bg-color-principal text-white" },
  { texto: "Gracias, hermoso el celu!! Son lo más", fondo: "bg-espuma" },
];

const INSTAGRAM = "https://www.instagram.com/wavearg__";

const tituloSeccion = "font-display font-extrabold tracking-[-0.025em] leading-[0.95] text-[clamp(40px,6vw,76px)]";

export default function HomePage() {
  return (
    <>
      <HomeLoader />

      {/* ── Hero: titular con ola, teléfono 3D y parte de stock ── */}
      <section className="relative overflow-hidden bg-atlantico text-espuma">
        <div className="mx-auto max-w-6xl px-4 pt-24 pb-10 md:pb-14">
          {/* El titular va a todo el ancho y en dos líneas; el teléfono sube por detrás, a la derecha. */}
          <TituloOla
            lineas={["Tu próximo iPhone,", "hoy en stock."]}
            className="relative z-10 font-display font-extrabold text-white text-[clamp(44px,8.2vw,120px)] leading-[0.9] tracking-[-0.035em]"
          />
          <div className="grid items-end gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
            <div className="relative z-10 pb-4">
              <p className="mt-6 max-w-[44ch] text-lg text-espuma/80">
                iPhones originales, nuevos y usados, con 3 meses de garantía. Despachamos a todo el país desde
                Necochea y Mar del Plata.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link href="/products" className="inline-flex min-h-14 items-center rounded-control bg-white px-7 font-semibold text-atlantico transition-colors hover:bg-espuma">
                  Ver iPhone en stock
                </Link>
                <Link href="/accesorios" className="font-medium text-white underline decoration-espuma/40 underline-offset-[6px] hover:decoration-white">
                  Ver accesorios
                </Link>
              </div>
            </div>
            <div className="md:-mt-60">
              <TelefonoOla />
            </div>
          </div>

          <LineaOla className="mt-8 text-espuma/25" />
          <ParteDeStock />
        </div>
      </section>

      {/* ── Por qué Wave ── */}
      <section aria-labelledby="por-que" className="mx-auto grid max-w-6xl gap-12 px-4 py-28 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-16 md:py-36">
        <h2 id="por-que" className={tituloSeccion}>
          Comprar un iPhone en Argentina no debería ser un dolor de cabeza.
        </h2>
        <dl className="grid content-end gap-x-10 gap-y-9 sm:grid-cols-2">
          {RAZONES.map((r) => (
            <div key={r.titulo}>
              <dt className="font-display text-2xl font-bold tracking-tight">{r.titulo}</dt>
              <dd className="mt-1.5 text-tinta-suave">{r.detalle}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Creadores ── */}
      <section aria-labelledby="creadores" className="mx-auto max-w-6xl px-4">
        <div className="grid auto-rows-[220px] grid-cols-2 gap-3 md:auto-rows-[260px] md:grid-cols-4">
          <div className="col-span-2 row-span-2 flex flex-col justify-end rounded-[28px] bg-color-principal p-8 text-white md:p-11">
            <h2 id="creadores" className="font-display text-[clamp(36px,4.6vw,60px)] font-extrabold leading-[0.95] tracking-[-0.025em]">
              Grabá, editá y publicá con lo que usan los creadores.
            </h2>
            <p className="mt-4 max-w-[40ch] text-white/80">
              Armamos una guía con los equipos que usan todos los días para grabar y editar.
            </p>
            <Link href="/creadores" className="mt-7 inline-flex min-h-13 w-fit items-center rounded-control bg-white px-6 font-semibold text-color-principal transition-colors hover:bg-espuma">
              Ver la guía para creadores
            </Link>
          </div>
          <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="group relative col-span-2 overflow-hidden rounded-[28px] bg-atlantico">
            <Image src="/celu-wave-perfil-ig.webp" alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover opacity-80" />
            <span className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[15px] font-semibold text-tinta">
              Seguinos en Instagram
              <ArrowUpRight size={16} strokeWidth={1.75} aria-label="(se abre en otra pestaña)" />
            </span>
          </a>
          <Link href="/accesorios" className="relative overflow-hidden rounded-[28px] bg-atlantico">
            <Image src="/mic.jpg" alt="" fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover opacity-85" />
            <span className="absolute bottom-4 left-5 text-lg font-semibold text-white">Audio</span>
          </Link>
          <Link href="/creadores" className="relative grid place-items-center overflow-hidden rounded-[28px] bg-espuma">
            <Image src="/macbook-pro.png" alt="" width={400} height={260} className="h-auto w-4/5" />
            <span className="absolute bottom-4 left-5 text-lg font-semibold">Edición</span>
          </Link>
        </div>
      </section>

      {/* ── Testimonios ── */}
      <section aria-labelledby="clientes" className="py-28 md:py-36">
        <h2 id="clientes" className={`mx-auto mb-8 max-w-6xl px-4 ${tituloSeccion}`}>Lo que nos escriben.</h2>
        <ul className="flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto scroll-pl-[max(1rem,calc((100%-72rem)/2+1rem))] pl-[max(1rem,calc((100%-72rem)/2+1rem))] pr-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <li className="w-[86vw] max-w-[620px] flex-shrink-0 snap-start overflow-hidden rounded-[24px]">
            <LazyVideoFacade
              mode="testimonial"
              altText="Testimonios de clientes de Wave"
              videoUrlMp4="/Wave-testimonios.mp4"
              posterUrl="/posterURL.webp"
            />
          </li>
          {TESTIMONIOS.map((t) => (
            <li key={t.texto} className={`flex w-[78vw] max-w-[340px] flex-shrink-0 snap-start items-end rounded-[24px] p-7 ${t.fondo}`}>
              <blockquote className="font-display text-2xl font-bold leading-tight tracking-tight">&ldquo;{t.texto}&rdquo;</blockquote>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-4 max-w-6xl px-4 text-sm text-tinta-suave">Mensajes que nos mandaron clientes por Instagram.</p>
      </section>

      <FAQSection />

      {/* ── Cierre ── */}
      <section className="mt-28 bg-atlantico text-espuma md:mt-36">
        <LineaOla className="text-espuma/25" />
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-8 px-4 py-24 md:py-32">
          <h2 className="font-display font-extrabold text-white text-[clamp(56px,9vw,120px)] leading-[0.9] tracking-[-0.03em]">
            Surfeá tu<br />próximo nivel.
          </h2>
          <Link href="/products" className="inline-flex min-h-14 items-center rounded-control bg-white px-8 text-lg font-semibold text-atlantico transition-colors hover:bg-espuma">
            Ver iPhone en stock
          </Link>
        </div>
      </section>
    </>
  );
}
