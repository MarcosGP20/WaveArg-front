"use client";

import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#05467D] mb-3">Contacto</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ¿Necesitas ayuda con tu pedido mayorista? Contáctanos y nuestro
            equipo te responderá en menos de 24 horas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulario de contacto */}
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold text-[#05467D] mb-6">
              Envíanos un mensaje
            </h2>

            <form className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05467D] focus:border-[#05467D] transition"
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05467D] focus:border-[#05467D] transition"
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Teléfono (opcional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05467D] focus:border-[#05467D] transition"
                  placeholder="+54 11 1234-5678"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Asunto
                </label>
                <select
                  id="subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05467D] focus:border-[#05467D] transition"
                >
                  <option value="">Selecciona un asunto</option>
                  <option value="quote">Cotización mayorista</option>
                  <option value="order">Consulta sobre mi pedido</option>
                  <option value="product">Consulta sobre productos</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mensaje
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05467D] focus:border-[#05467D] transition"
                  placeholder="Detalla tu consulta..."
                  required
                ></textarea>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#05467D] hover:bg-[#0F3C64] text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Enviar mensaje
              </Button>
            </form>
          </div>

          {/* Información de contacto */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
              <h2 className="text-2xl font-semibold text-[#05467D] mb-6">
                Información de contacto
              </h2>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="bg-[#E6F2FF] p-2 rounded-full">
                    <Mail className="w-5 h-5 text-[#05467D]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Correo electrónico
                    </h3>
                    <p className="text-gray-600">ventas@wavelength.com</p>
                    <p className="text-gray-600">soporte@wavelength.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#E6F2FF] p-2 rounded-full">
                    <Phone className="w-5 h-5 text-[#05467D]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Teléfono</h3>
                    <p className="text-gray-600">+54 11 1234-5678 (Ventas)</p>
                    <p className="text-gray-600">+54 11 9876-5432 (Soporte)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#E6F2FF] p-2 rounded-full">
                    <MapPin className="w-5 h-5 text-[#05467D]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Ubicación</h3>
                    <p className="text-gray-600">Necochea, Argentina</p>
                    <p className="text-gray-600">Mar del Plata, Argentina</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#E6F2FF] p-2 rounded-full">
                    <Clock className="w-5 h-5 text-[#05467D]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Horario de atención
                    </h3>
                    <p className="text-gray-600">
                      Lunes a Viernes: 9:00 - 18:00 hs
                    </p>
                    <p className="text-gray-600">Sábados: 10:00 - 13:00 hs</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ rápida */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h3 className="font-semibold text-[#05467D] mb-4">
                Preguntas frecuentes
              </h3>
              <div className="space-y-3">
                <Link
                  href="/faq#envios"
                  className="block text-gray-700 hover:text-[#05467D] transition"
                >
                  ¿Cuáles son los tiempos de entrega para pedidos mayoristas?
                </Link>
                <Link
                  href="/faq#pagos"
                  className="block text-gray-700 hover:text-[#05467D] transition"
                >
                  ¿Qué métodos de pago aceptan?
                </Link>
                <Link
                  href="/faq#devoluciones"
                  className="block text-gray-700 hover:text-[#05467D] transition"
                >
                  ¿Cuál es la política de devoluciones?
                </Link>
                <Link
                  href="/faq#garantia"
                  className="block text-gray-700 hover:text-[#05467D] transition"
                >
                  ¿Cómo funciona la garantía de los productos?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
