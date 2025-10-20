// CAMBIO 1: Importamos los íconos de 'react-icons/fa' (Font Awesome)
import { FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

// --- Data para los links ---
const navLinks = [
  { href: "/products", label: "Productos" },
  { href: "/cart", label: "Carrito" },
  { href: "/guia-creadores", label: "Guía para creadores" },
];

const contactLinks = [
  { href: "mailto:contacto@wavearg.com", label: "Mail" },
  { href: "tel:+541112345678", label: "Teléfono" },
];

const communityLinks = [
  { href: "/sobre-nosotros", label: "Sobre nosotros" },
  { href: "/comunidad", label: "Unite a nuestra comunidad" },
];

// CAMBIO 2: Actualizamos el array 'socialLinks' con los nuevos íconos
const socialLinks = [
  {
    href: "https://www.instagram.com/wavearg__?igsh=NWNxdXZjbDFkMHc4", // Poné tu URL
    icon: FaInstagram, // <-- ÍCONO NUEVO
    label: "Instagram",
  },
  {
    href: "https://www.tiktok.com/@iphonewave.arg", // Poné tu URL
    icon: FaTiktok, // <-- ÍCONO NUEVO
    label: "TikTok",
  },
  {
    href: "https://wa.me/2233064666", // Poné tu URL de WhatsApp
    icon: FaWhatsapp, // <-- ÍCONO NUEVO
    label: "WhatsApp",
  },
];

// --- Clases reutilizables (Sin cambios) ---
const h3Styles = "text-lg font-semibold mb-3";
const textStyles = "text-sm text-gray-200";
const linkStyles = `text-sm text-gray-200 hover:underline`;
const iconStyles = "w-5 h-5 text-white hover:text-gray-300 transition";

// --- Estilos de Botones (Sin cambios) ---
const baseButtonStyles =
  "px-4 py-2 rounded-lg text-center font-medium transition text-sm";
const outlineButtonStyles = `${baseButtonStyles} border border-white text-white hover:bg-white hover:text-[#05467D]`;
const solidButtonStyles = `${baseButtonStyles} bg-white text-[#05467D] hover:bg-gray-200`;

export default function Footer() {
  return (
    <footer className="bg-[#05467D] text-white py-10 mt-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          {/* 1. Marca y Tagline */}
          <div className="md:col-span-2 space-y-2">
            <Link href="/">
              <Image
                src="/waves6.svg"
                alt="Logo Wave Arg"
                width={120}
                height={120}
              />
            </Link>
            <p className={textStyles}>Surfeá tu próximo nivel</p>
          </div>

          {/* 2. Inicio */}
          <div>
            <h3 className={h3Styles}>Inicio</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkStyles}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Contacto */}
          <div>
            <h3 className={h3Styles}>Contacto</h3>
            <ul className="space-y-2">
              {contactLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={linkStyles}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Comunidad */}
          <div>
            <h3 className={h3Styles}>Comunidad</h3>
            <ul className="space-y-2">
              {communityLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkStyles}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 5. Botones de Autenticación */}
          <div className="flex flex-col space-y-3">
            <Link href="/login" className={outlineButtonStyles}>
              Iniciar sesión
            </Link>
            <Link href="/register" className={solidButtonStyles}>
              Registrarse
            </Link>
          </div>
        </div>

        {/* --- Barra de Copyright --- */}
        <div
          className="border-t border-white/20 mt-10 pt-4 text-xs text-gray-300
                        flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} Wave Arg. Todos los derechos
            reservados.
          </p>

          {/* CAMBIO 3: Esto ahora funciona porque el array socialLinks se actualizó */}
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
              >
                <social.icon className={iconStyles} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
