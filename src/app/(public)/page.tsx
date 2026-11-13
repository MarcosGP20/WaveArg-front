import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, CreditCard, MessageCircle, ShieldCheck, Truck } from "lucide-react";

import FAQSection from "@/components/FAQSection";
import HomeLoader from "@/components/HomeLoader";
import { LazyVideoFacade } from "@/components/VideoPlayer";
import FormularioAvisos from "@/components/home/FormularioAvisos";
import FraseDeMarca from "@/components/home/FraseDeMarca";
import HeroVideo from "@/components/home/HeroVideo";
import LineaOla from "@/components/home/LineaOla";
import ParteDeStock from "@/components/home/ParteDeStock";
import ParteEnVivo from "@/components/home/ParteEnVivo";
import Reveal from "@/components/home/Reveal";
import { botonSobreOscuro, enlace, enlaceSobreOscuro, seccion, tituloSeccion } from "@/components/home/estilos";
import { CUOTAS_SIN_INTERES } from "@/lib/cuotas";
import { VENDEDOR } from "@/lib/vendedor";
import { linkWhatsApp } from "@/lib/whatsapp";

// Home pensada para vender y para captar a quien todavía no compra (DESIGN.md, "Parte de olas").
// Server Component: el texto viene en el HTML; son islas cliente el video, el stock, la frase de
// marca y el formulario de avisos. Una acción principal por sección.

const TITULO = "Wave Arg | iPhones originales con garantía y envío a todo el país";
const DESCRIPCION =
  "iPhones nuevos sellados y usados revisados, con 3 meses de garantía. Pagás con Mercado Pago y te lo despachamos en 24/48 hs a toda la Argentina.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://wavearg-front.vercel.app"),
  title: TITULO,
  description: DESCRIPCION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Wave Arg",
    url: "/",
    title: TITULO,
    description: DESCRIPCION,
    images: [{ url: "/out/wave-hero-1920x1080-poster-hero.webp", width: 1920, height: 1080, alt: "Wave Arg: tu próximo iPhone, en tus manos" }],
  },
};

// Lo que Wave ya promete en la ficha, el FAQ y /contacto. No agregar nada que el cliente no haya confirmado.
const CONFIANZA = [
  {
    icono: ShieldCheck,
    titulo: "3 meses de garantía escrita",
    detalle: "En nuevos y usados. Los sellados suman la garantía oficial de Apple.",
  },
  {
    icono: Truck,
    titulo: "Envío a todo el país",
    detalle: "Despacho en 24/48 hs hábiles, con correo asegurado y número de seguimiento.",
  },
  {
    icono: CreditCard,
    titulo: "Pagás con Mercado Pago",
    detalle: CUOTAS_SIN_INTERES
      ? `Tarjeta, débito o transferencia. Hasta ${CUOTAS_SIN_INTERES} cuotas sin interés.`
      : "Tarjeta, débito o transferencia. En cuotas según tu banco y la promoción vigente.",
  },
  {
    icono: MessageCircle,
    titulo: "Te atiende una persona",
    detalle: `Por WhatsApp. ${VENDEDOR.horario}.`,
  },
];

// Es una secuencia real (lo que pasa desde que elegís hasta que lo usás), por eso va numerada.
const PASOS = [
  { titulo: "Elegís el equipo", detalle: "Modelo, color, capacidad y estado. Lo que ves publicado está en stock." },
  { titulo: "Pagás con Mercado Pago", detalle: "Con tarjeta de crédito, débito o transferencia." },
  { titulo: "Lo recibís en tu casa", detalle: "Lo despachamos en 24/48 hs hábiles a todo el país, con número de seguimiento." },
];

// Mensajes reales de clientes (los mismos del video de testimonios).
const MENSAJES = [
  "Está flamaaaa, gracias!",
  "Perfecto! Muchas gracias por la atención, te volví loco, un genio!",
  "Excelentísima atención pre y post venta! Gracias por la paciencia!",
  "De USA directo a casa! Muchas gracias!",
  "Gracias, hermoso el celu!! Son lo más",
];

const AVISOS = [
  "Entran equipos nuevos o usados",
  "Vuelve el modelo que no encontraste",
  "Sale un lanzamiento y abrimos la lista de espera",
];

const INSTAGRAM = "https://www.instagram.com/wavearg__";

export default function HomePage() {
  return (
    <>
      <HomeLoader />

      {/* ── Hero: qué vendemos, la acción principal y la captación como link ── */}
      <section aria-labelledby="hero-titulo" className="overflow-hidden bg-atlantico text-espuma">
        <div className="mx-auto grid max-w-6xl items-center gap-x-12 px-4 pt-24 md:grid-cols-2 md:pb-16 md:pt-32">
          <div className="pb-8 md:pb-0">
            {/* pb-2: el degradé se recorta al texto y sin ese aire corta las letras que bajan. */}
            <h1
              id="hero-titulo"
              className="max-w-[680px] bg-gradient-to-r from-white to-bruma bg-clip-text pb-2 heading-3 text-transparent sm:heading-2 md:heading-3 lg:heading-2 xl:heading-1 forced-colors:bg-none forced-colors:text-[CanvasText]"
            >
              Tu próximo iPhone,
              <br />
              en tus manos
            </h1>
            <p className="mt-4 max-w-[680px] body-3 text-pretty text-espuma/85 sm:body-7">
              Nuevos sellados y usados revisados, con 3 meses de garantía escrita. Ves el precio y el stock real,
              pagás con Mercado Pago y te lo despachamos en 24/48 hs.
            </p>
            <div className="mt-8 flex flex-col gap-x-8 gap-y-2 sm:flex-row sm:flex-wrap sm:items-center">
              <Link href="/products" className={`${botonSobreOscuro} whitespace-nowrap`}>
                Ver iPhones en stock
              </Link>
              <a href="#avisos" className={`${enlaceSobreOscuro} self-start whitespace-nowrap py-3 sm:self-auto`}>
                Avisame de nuevos ingresos
              </a>
            </div>
            <ParteEnVivo />
          </div>
          <div className="-mx-4 md:mx-0 md:w-full md:max-w-lg md:justify-self-end">
            <HeroVideo />
          </div>
        </div>
      </section>

      {/* ── Confianza: las cuatro dudas de quien compra un iPhone online ── */}
      <section aria-labelledby="confianza" className="border-b border-borde">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <h2 id="confianza" className="sr-only">
            Por qué comprar en Wave
          </h2>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {CONFIANZA.map(({ icono: Icono, titulo, detalle }) => (
              <li key={titulo} className="flex gap-4 lg:flex-col lg:gap-3">
                <Icono size={24} strokeWidth={1.75} aria-hidden="true" className="mt-0.5 shrink-0 text-color-principal" />
                <div>
                  <h3 className="body-1 text-tinta">{titulo}</h3>
                  <p className="mt-1 body-6 text-pretty text-tinta-suave">{detalle}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Stock de hoy: tarjetas que llevan directo a la ficha ── */}
      <Reveal>
        <ParteDeStock />
      </Reveal>

      {/* ── Frase de marca ── */}
      <section aria-label="Nuestra promesa" className="bg-superficie">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
          <FraseDeMarca
            texto="Comprar un iPhone en Argentina no debería ser un dolor de cabeza. Acá ves el precio, el estado y el stock real antes de pagar."
            className="mx-auto max-w-[680px] text-center heading-4 text-balance text-tinta md:heading-3 lg:heading-2"
          />
        </div>
      </section>

      {/* ── Cómo es comprar ── */}
      <Reveal>
        <section aria-labelledby="como-comprar">
          <div className={seccion}>
            <h2 id="como-comprar" className={tituloSeccion}>
              Así es comprar en Wave
            </h2>
            {/* La ola del logo une los tres pasos. */}
            <LineaOla className="mt-10 text-borde-fuerte" />
            <ol className="mt-8 grid gap-8 md:grid-cols-3 md:gap-12">
              {PASOS.map((paso, i) => (
                <li key={paso.titulo} className="flex gap-4 md:flex-col md:gap-3">
                  <span aria-hidden="true" className="w-8 shrink-0 heading-3 tabular-nums text-color-principal md:heading-2">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="heading-6 text-tinta">{paso.titulo}</h3>
                    <p className="mt-2 body-3 text-pretty text-tinta-suave">{paso.detalle}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-12 body-3 text-tinta-suave">
              ¿Tenés un iPhone para entregar? Lo tomamos como parte de pago.{" "}
              <a
                href={linkWhatsApp("Hola, quiero cotizar mi iPhone para el plan canje.")}
                target="_blank"
                rel="noopener noreferrer"
                className={enlace}
              >
                Cotizalo por WhatsApp
              </a>
            </p>
          </div>
        </section>
      </Reveal>

      {/* ── Testimonios: son mensajes de Instagram, se muestran como un chat ── */}
      <section aria-labelledby="clientes" className="bg-superficie">
        <Reveal className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:gap-16 md:py-24">
          <div>
            <h2 id="clientes" className={tituloSeccion}>
              Lo que nos escriben
            </h2>
            <p className="mt-3 body-3 text-tinta-suave">Mensajes que nos mandaron clientes por Instagram.</p>
            <ul className="mt-8 flex flex-col items-start gap-2">
              {MENSAJES.map((texto) => (
                <li key={texto} className="max-w-sm rounded-3xl rounded-bl-md bg-white px-4 py-3 body-3 text-tinta">
                  {texto}
                </li>
              ))}
            </ul>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-8 inline-flex items-center gap-1 body-2 ${enlace}`}
            >
              Ver más en Instagram
              <ArrowUpRight size={16} strokeWidth={1.75} aria-label="(se abre en otra pestaña)" />
            </a>
          </div>
          <div className="overflow-hidden rounded-panel">
            <LazyVideoFacade
              mode="testimonial"
              altText="Testimonios de clientes de Wave"
              videoUrlMp4="/Wave-testimonios.mp4"
              posterUrl="/posterURL.webp"
            />
          </div>
        </Reveal>
      </section>

      {/* ── Avisos: para quien todavía no compra ── */}
      <section id="avisos" aria-labelledby="avisos-titulo" className="scroll-mt-16 bg-atlantico text-espuma">
        <Reveal className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:gap-16 md:py-24">
          <div>
            <h2 id="avisos-titulo" className={`${tituloSeccion} text-white`}>
              Te avisamos cuando entra el iPhone que buscás
            </h2>
            <p className="mt-4 body-7 text-espuma/85">Dejanos tu email y te escribimos cuando:</p>
            <ul className="mt-6 flex flex-col gap-3">
              {AVISOS.map((aviso) => (
                <li key={aviso} className="flex gap-3 body-3 text-espuma">
                  <Check size={20} strokeWidth={1.75} aria-hidden="true" className="mt-0.5 shrink-0 text-espuma/70" />
                  {aviso}
                </li>
              ))}
            </ul>
            <p className="mt-8 body-3 text-espuma/85">
              ¿No sabés qué modelo elegir?{" "}
              <a
                href={linkWhatsApp("Hola, quiero que me ayuden a elegir un iPhone.")}
                target="_blank"
                rel="noopener noreferrer"
                className={enlaceSobreOscuro}
              >
                Te asesoramos por WhatsApp
              </a>
            </p>
          </div>
          <div className="rounded-panel bg-white p-6 text-tinta md:p-8">
            <FormularioAvisos />
          </div>
        </Reveal>
      </section>

      <Reveal>
        <FAQSection />
      </Reveal>

      {/* ── Cierre: la misma acción del hero. -mb-20 lo pega al footer (que trae mt-20), también atlantico. ── */}
      <section aria-labelledby="cierre" className="-mb-20 bg-atlantico text-espuma">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <div>
            <h2 id="cierre" className={`${tituloSeccion} text-white`}>
              Elegí el tuyo y lo despachamos en 24/48 hs
            </h2>
            <p className="mt-3 max-w-xl body-7 text-pretty text-espuma/85">
              Con 3 meses de garantía escrita y 10 días para arrepentirte si lo compraste por la web.
            </p>
          </div>
          <Link href="/products" className={`${botonSobreOscuro} shrink-0`}>
            Ver iPhones en stock
          </Link>
        </div>
      </section>
    </>
  );
}
