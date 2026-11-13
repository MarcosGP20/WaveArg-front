"use client";

import { useSyncExternalStore } from "react";
import { Mail } from "lucide-react";
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/components/icons/BrandIcons";
import Image from "next/image";
import Link from "next/link";
import LineaOla from "@/components/home/LineaOla";
import { PENDIENTE, VENDEDOR } from "@/lib/vendedor";
import { linkWhatsApp } from "@/lib/whatsapp";
import { useAuthStore } from "@/store/useAuthStore";

const WHATSAPP = linkWhatsApp("Hola, me interesa saber más sobre los productos de Wave Arg.");

const COLUMNAS = [
  {
    titulo: "Comprar",
    links: [
      { href: "/products", label: "iPhone" },
      { href: "/accesorios", label: "Accesorios" },
      { href: "/compare", label: "Comparar modelos" },
      { href: "/cart", label: "Carrito" },
    ],
  },
  {
    titulo: "Wave",
    links: [
      { href: "/nosotros", label: "Sobre nosotros" },
      { href: "/creadores", label: "Guía para creadores" },
      { href: "/contacto", label: "Contacto" },
    ],
  },
];

const REDES = [
  { href: "https://www.instagram.com/wavearg__?igsh=NWNxdXZjbDFkMHc4", icon: InstagramIcon, label: "Instagram" },
  { href: "https://www.tiktok.com/@iphonewave.arg", icon: TikTokIcon, label: "TikTok" },
  { href: WHATSAPP, icon: WhatsAppIcon, label: "WhatsApp" },
  { href: `mailto:${VENDEDOR.email}`, icon: Mail, label: "Email" },
];

const tituloColumna = "body-1 text-white";
const link = "body-6 text-espuma/85 transition-colors duration-300 hover:text-white hover:underline";

export default function Footer() {
  const { isLoggedIn } = useAuthStore();
  // La sesión se lee de localStorage: en el servidor y al hidratar se muestra sin sesión.
  const enCliente = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const conSesion = enCliente && isLoggedIn;

  return (
    <footer className="mt-20 bg-atlantico pb-10 text-white">
      {/* La ola del logo marca el borde, como en la home (DESIGN.md). */}
      <LineaOla className="text-espuma/25" />
      <div className="mx-auto max-w-6xl px-4 pt-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))]">
          {/* Marca y datos del vendedor (obligatorios en una tienda online) */}
          <div>
            <Link href="/" className="inline-block">
              <Image src="/waves6.svg" alt="Wave Arg, ir al inicio" width={120} height={120} />
            </Link>
            <p className="mt-2 body-6 text-espuma/85">Surfeá tu próximo nivel</p>
            <address className="mt-6 flex flex-col gap-1 body-6 not-italic text-espuma/85">
              <span className="body-4 text-white">{VENDEDOR.nombre}</span>
              <span>Razón social: {VENDEDOR.razonSocial ?? PENDIENTE}</span>
              <span>CUIT: {VENDEDOR.cuit ?? PENDIENTE}</span>
              <span>Domicilio legal: {VENDEDOR.domicilioLegal ?? PENDIENTE}</span>
              <span>{VENDEDOR.localidades}</span>
              <a href={`mailto:${VENDEDOR.email}`} className="self-start underline underline-offset-4 hover:text-white">
                {VENDEDOR.email}
              </a>
              <span>{VENDEDOR.horario}</span>
            </address>
          </div>

          {COLUMNAS.map((columna) => (
            <nav key={columna.titulo} aria-label={columna.titulo}>
              <h2 className={tituloColumna}>{columna.titulo}</h2>
              <ul className="mt-4 flex flex-col gap-3">
                {columna.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={link}>
                      {l.label}
                    </Link>
                  </li>
                ))}
                {columna.titulo === "Wave" && (
                  <li>
                    <Link href={conSesion ? "/account/profile" : "/login"} className={link}>
                      {conSesion ? "Mi cuenta" : "Iniciar sesión"}
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          ))}

          <nav aria-label="Legales">
            <h2 className={tituloColumna}>Legales</h2>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <Link href="/terminos" className={link}>
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className={link}>
                  Política de privacidad
                </Link>
              </li>
              <li className="mt-1">
                <Link
                  href="/arrepentimiento"
                  className="inline-flex rounded-control border border-espuma/50 px-4 py-3 button-sm text-white transition-colors duration-300 hover:border-white hover:bg-white/10"
                >
                  Botón de arrepentimiento
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/20 pt-4 md:flex-row">
          <p className="text-center caption-2 text-espuma/85 md:text-left">
            © {new Date().getFullYear()} {VENDEDOR.nombre}. Todos los derechos reservados.
          </p>
          <div className="flex">
            {REDES.map((red) => (
              <a
                key={red.label}
                href={red.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={red.label}
                className="grid size-11 place-items-center text-white transition-colors duration-300 hover:text-espuma/70"
              >
                <red.icon className="size-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
