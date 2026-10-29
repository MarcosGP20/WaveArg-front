import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import FAQSection from "@/components/FAQSection";
import HomeLoader from "@/components/HomeLoader";
import { LazyVideoFacade } from "@/components/VideoPlayer";
import { HeroTarjeta, HeroTelefono } from "@/components/home/HeroPulso";
import RielModelos from "@/components/home/RielModelos";

// Home "Pulso" (DESIGN.md). Server Component (front#15): el HTML trae todo el texto; lo que
// depende del catálogo (iPhone del hero, tarjeta de compra, riel de modelos) son islas cliente.
// El movimiento es CSS atado al scroll (.hero-pulso-*, .revelar en globals.css): sin JS, sin
// riesgo de hidratación, y quieto con prefers-reduced-motion o en navegadores sin soporte.

const RAZONES = [
  { titulo: "Stock real", detalle: "Lo que ves en la web está disponible para enviar." },
  { titulo: "Garantía de 3 meses", detalle: "En todos los equipos, nuevos y usados." },
  { titulo: "Plan canje", detalle: "Tu iPhone actual como parte de pago." },
  { titulo: "Envío a todo el país", detalle: "Despacho en 24/48 hs hábiles, con número de seguimiento." },
];

// Mensajes reales de clientes (los mismos del video de testimonios).
const TESTIMONIOS = [
  { texto: "Está flamaaaa, gracias!", fondo: "bg-superficie" },
  { texto: "Perfecto! Muchas gracias por la atención, te volví loco, un genio!", fondo: "bg-noche text-white" },
  { texto: "Excelentísima atención pre y post venta! Gracias por la paciencia!", fondo: "bg-principal-suave" },
  { texto: "De USA directo a casa! Muchas gracias!", fondo: "bg-superficie" },
  { texto: "Gracias, hermoso el celu!! Son lo más", fondo: "bg-color-principal text-white" },
];

const INSTAGRAM = "https://www.instagram.com/wavearg__";

const titulo = "text-5xl md:text-7xl font-semibold tracking-[-0.045em] leading-[0.98]";

export default function HomePage() {
  return (
    <>
      <HomeLoader />

      {/* ── Hero ── */}
      <section className="hero-pulso relative overflow-hidden bg-noche text-[#F5F5F7]">
        <p
          aria-hidden="true"
          className="hero-pulso-palabra pointer-events-none absolute inset-x-0 top-24 select-none text-center font-extrabold leading-none tracking-[-0.06em] text-noche-2 text-[clamp(140px,25vw,360px)]"
        >
          iPhone
        </p>

        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col px-4 pb-12 pt-24 md:pb-16">
          {/* En mobile el iPhone va en el flujo; desde md flota centrado detrás del texto, así el
              hero entra en una pantalla. */}
          <div className="pointer-events-none z-0 grid place-items-center py-6 md:absolute md:inset-x-0 md:top-12 md:bottom-56 md:py-0">
            <HeroTelefono />
          </div>

          <div className="relative z-10 mt-auto flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-[480px] hero-pulso-texto">
              <h1 className="text-[44px] md:text-[64px] font-semibold leading-[0.98] tracking-[-0.045em]">
                Tecnología Apple que acompaña tu ritmo.
              </h1>
              <p className="mt-4 text-lg text-niebla">Originales, con garantía de 3 meses y envío a todo el país.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/products" className="inline-flex min-h-14 items-center rounded-control bg-white px-7 font-semibold text-noche transition-colors hover:bg-[#E8E8ED]">
                  Ver iPhone
                </Link>
                <Link href="/accesorios" className="inline-flex min-h-14 items-center rounded-control border border-noche-borde px-6 font-medium text-[#F5F5F7] transition-colors hover:border-niebla">
                  Accesorios
                </Link>
              </div>
            </div>
            <HeroTarjeta />
          </div>
        </div>
      </section>

      {/* ── Por qué Wave ── */}
      <section aria-labelledby="por-que" className="mx-auto grid max-w-6xl gap-12 px-4 pt-32 md:grid-cols-2 md:gap-16 md:pt-36">
        <div className="md:sticky md:top-28 md:self-start">
          <p className="text-[15px] text-tinta-suave">Por qué Wave</p>
          <h2 id="por-que" className={`revelar mt-2 ${titulo}`}>
            En Argentina, comprar un iPhone suele ser un dolor de cabeza.{" "}
            <span className="text-color-principal">Nosotros lo hacemos simple.</span>
          </h2>
        </div>
        <ol className="border-t border-borde">
          {RAZONES.map((r, i) => (
            <li key={r.titulo} className="revelar grid grid-cols-[56px_1fr] gap-4 border-b border-borde py-7 md:grid-cols-[72px_1fr]">
              <span className="text-[15px] tabular-nums text-tinta-suave">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="text-2xl md:text-[26px] font-semibold tracking-tight">{r.titulo}</p>
                <p className="mt-1 text-tinta-suave">{r.detalle}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <RielModelos />

      {/* ── Creadores ── */}
      <section aria-labelledby="creadores" className="mx-auto max-w-6xl px-4 pt-32 md:pt-36">
        <div className="grid auto-rows-[220px] grid-cols-2 gap-4 md:auto-rows-[260px] md:grid-cols-4">
          <div className="revelar col-span-2 row-span-2 flex flex-col justify-between rounded-[32px] bg-color-principal p-8 text-white md:p-11">
            <p className="text-[15px] text-[#C9DCEC]">Para creadores</p>
            <div>
              <h2 id="creadores" className="text-4xl md:text-6xl font-semibold leading-[0.98] tracking-[-0.045em]">
                Grabá, editá y publicá con lo que usan los que saben.
              </h2>
              <Link href="/creadores" className="mt-7 inline-flex min-h-13 items-center rounded-control bg-white px-6 font-semibold text-color-principal transition-colors hover:bg-principal-suave">
                Ver la guía para creadores
              </Link>
            </div>
          </div>
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="revelar group relative col-span-2 overflow-hidden rounded-[32px] bg-noche"
          >
            <Image src="/celu-wave-perfil-ig.webp" alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none" />
            <span className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-[15px] font-semibold text-tinta">
              Seguinos en Instagram <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
            </span>
          </a>
          <Link href="/accesorios" className="revelar group relative overflow-hidden rounded-[32px] bg-noche">
            <Image src="/mic.jpg" alt="" fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover opacity-85 transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none" />
            <span className="absolute bottom-4 left-5 text-lg font-semibold text-white">Audio</span>
          </Link>
          <Link href="/creadores" className="revelar group relative grid place-items-center overflow-hidden rounded-[32px] bg-superficie">
            <Image src="/macbook-pro.png" alt="" width={400} height={260} className="w-4/5 h-auto transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none" />
            <span className="absolute bottom-4 left-5 text-lg font-semibold">Edición</span>
          </Link>
        </div>
      </section>

      {/* ── Testimonios ── */}
      <section aria-labelledby="clientes" className="pt-32 md:pt-36">
        <h2 id="clientes" className={`revelar mx-auto mb-8 max-w-6xl px-4 ${titulo}`}>Clientes felices.</h2>
        <ul className="flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto scroll-pl-[max(1rem,calc((100%-72rem)/2+1rem))] pl-[max(1rem,calc((100%-72rem)/2+1rem))] pr-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <li className="w-[86vw] max-w-[620px] flex-shrink-0 snap-start overflow-hidden rounded-[28px]">
            <LazyVideoFacade
              mode="testimonial"
              altText="Testimonios de clientes de Wave"
              videoUrlMp4="/Wave-testimonios.mp4"
              posterUrl="/posterURL.webp"
            />
          </li>
          {TESTIMONIOS.map((t) => (
            <li key={t.texto} className={`flex w-[78vw] max-w-[360px] flex-shrink-0 snap-start flex-col justify-between rounded-[28px] p-7 ${t.fondo}`}>
              <blockquote className="text-2xl font-medium leading-tight">&ldquo;{t.texto}&rdquo;</blockquote>
              <p className="mt-6 text-sm opacity-75">Cliente por Instagram</p>
            </li>
          ))}
        </ul>
      </section>

      <FAQSection />

      {/* ── Cierre ── */}
      <section className="mt-32 bg-noche text-[#F5F5F7] md:mt-36">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-8 px-4 py-24 md:py-32">
          <h2 className="revelar text-6xl md:text-8xl font-semibold leading-[0.95] tracking-[-0.05em]">
            Surfeá tu<br />próximo nivel.
          </h2>
          <Link href="/products" className="inline-flex min-h-15 items-center rounded-control bg-white px-8 text-lg font-semibold text-noche transition-colors hover:bg-[#E8E8ED]">
            Ver iPhone disponibles
          </Link>
        </div>
      </section>
    </>
  );
}
