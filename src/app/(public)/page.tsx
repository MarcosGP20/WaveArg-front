import Image from "next/image";
import Link from "next/link";
import { Shield, RefreshCw, Truck, PackageCheck } from "lucide-react";

import CommunitySection from "@/components/CommunitySection";
import FAQSection from "@/components/FAQSection";
import HomeLoader from "@/components/HomeLoader";
import { LazyVideoFacade } from "@/components/VideoPlayer";
import BentoCreadores from "@/components/BentoCreadores";
import Ticker from "@/components/Ticker";
import HeroVideo from "@/components/home/HeroVideo";
import HomeCarousel from "@/components/home/HomeCarousel";
import ParallaxReveal from "@/components/home/ParallaxReveal";

// Server Component (front#15): el HTML inicial trae todo el contenido de la home. Lo animado o
// interactivo vive en islas cliente (HomeLoader, HeroVideo, HomeCarousel, ParallaxReveal y las
// secciones de components/).

// Rutas de recursos
const ASSET_PATHS = {
  VIDEO: "/wave-video-portada.mp4",
  IPHONE_IMG: "/iphone-div-landing.jpg",
};

const TRUST_SIGNALS = [
  { icon: Shield,       title: "Garantía incluida",      desc: "3 meses en todos los equipos" },
  { icon: RefreshCw,    title: "Plan canje",             desc: "Tu iPhone como parte de pago" },
  { icon: Truck,        title: "Envíos a todo el país",  desc: "Con número de seguimiento" },
  { icon: PackageCheck, title: "Stock real",             desc: "Lo que ves está disponible" },
];

export default function HomePage() {
  return (
    <>
      <HomeLoader />
      <main>
        {/* Hero - Video */}
        <section className="relative h-screen w-full overflow-hidden">
          <HeroVideo src={ASSET_PATHS.VIDEO} />

          {/* Overlay gradient + CTA. La entrada es CSS: el texto se ve aunque el JS no haya llegado. */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end pb-16 px-6 md:px-16 lg:px-24">
            <div className="pointer-events-auto max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 ease-out fill-mode-both motion-reduce:animate-none">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/60 mb-3 font-medium">
                Tu próximo iPhone, al mejor precio
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Tecnología Apple que <br className="hidden md:block" />{" "}
                acompaña tu ritmo.
              </h1>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors duration-200"
                >
                  Ver iPhones
                </Link>
                <Link
                  href="/accesorios"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/20 transition-colors duration-200"
                >
                  Ver accesorios
                </Link>
              </div>
            </div>

            {/* Scroll indicator */}
            <div
              aria-hidden="true"
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-in fade-in duration-700 delay-1000 fill-mode-both motion-reduce:animate-none"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">
                Scroll
              </span>
              <div className="w-[22px] h-[36px] rounded-full border border-white/30 flex items-start justify-center pt-[6px]">
                <div className="w-[3px] h-[6px] rounded-full bg-white/60 animate-bounce motion-reduce:animate-none" />
              </div>
            </div>
          </div>
        </section>

        <Ticker />

        {/* Carrusel de iPhones */}
        <section className="bg-[#F5F5F5] py-14 px-4 md:px-8">
          <div className="w-[90%] max-w-6xl mx-auto">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.15em] text-[#05467D]/60 mb-2">
              Nuestros modelos
            </p>
            <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              Encontrá tu iPhone ideal
            </h2>
            <HomeCarousel />
          </div>
        </section>

        {/* Sección trust signals con parallax */}
        <ParallaxReveal className="relative h-screen bg-white flex items-center justify-center px-2 md:px-4 overflow-hidden">
          <div className="relative h-[95vh] bg-gray-900 rounded-2xl overflow-hidden">
            <Image
              src={ASSET_PATHS.IPHONE_IMG}
              alt="Por qué elegir Wave"
              fill
              sizes="100vw"
              className="object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-12">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/50 font-semibold mb-3">
                Por qué elegirnos
              </p>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
                La forma más confiable<br className="hidden md:block" /> de conseguir tu iPhone.
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {TRUST_SIGNALS.map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 md:p-5"
                  >
                    <Icon size={20} strokeWidth={1.75} className="text-white/70 mb-3" />
                    <p className="text-white font-semibold text-sm leading-snug mb-1">{title}</p>
                    <p className="text-white/50 text-xs leading-snug">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ParallaxReveal>

        <BentoCreadores />
        <CommunitySection />
        <LazyVideoFacade
          mode="testimonial"
          altText="Testimonios de clientes de Wave"
          videoUrlMp4="/Wave-testimonios.mp4"
          posterUrl="/posterURL.webp"
        />
        <FAQSection />
      </main>
    </>
  );
}
