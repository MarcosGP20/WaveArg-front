import { Instagram, Mail, PhoneCall } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#05467D] text-white py-10 mt-20">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Marca */}
        <div>
          <Link href="/">
            <Image
              src="/waves6.svg"
              alt="Logo"
              width={120}
              height={120}
              priority
            />
          </Link>
          <p className="text-sm text-gray-200 mt-2">
            Tu tienda de confianza para conseguir los últimos modelos de iPhone
            con garantía y envío rápido.
          </p>
        </div>

        {/* Enlaces */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Enlaces</h3>
          <ul className="space-y-2 text-sm text-gray-200">
            <li>
              <a href="/" className="hover:underline">
                Inicio
              </a>
            </li>
            <li>
              <a href="/products" className="hover:underline">
                Productos
              </a>
            </li>
            <li>
              <a href="/cart" className="hover:underline">
                Carrito
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                Contacto
              </a>
            </li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contacto</h3>
          <p className="text-sm text-gray-200">Email: contacto@istore.com</p>
          <p className="text-sm text-gray-200">Tel: +54 11 1234-5678</p>

          <div className="flex gap-4 mt-4">
            <a
              href="https://instagram.com/tuCliente"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="w-5 h-5 text-white hover:text-gray-300 transition" />
            </a>
            <a href="mailto:contacto@istore.com">
              <Mail className="w-5 h-5 text-white hover:text-gray-300 transition" />
            </a>
            <a href="tel:+541112345678">
              <PhoneCall className="w-5 h-5 text-white hover:text-gray-300 transition" />
            </a>
          </div>
        </div>

        {/* Métodos de pago */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Métodos de pago</h3>
          <p className="text-sm text-gray-200">Pagá con Mercado Pago:</p>
          <img
            src="logo_mp_fondo_blanco.svg"
            alt="Mercado Pago"
            className="h-20 mt-3"
          />
        </div>
      </div>

      <div className="border-t border-white/20 mt-10 pt-4 text-center text-xs text-gray-300">
        © {new Date().getFullYear()} WaveArg. Todos los derechos reservados.
      </div>
    </footer>
  );
}
