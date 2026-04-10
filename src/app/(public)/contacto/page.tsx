"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

// Número de WhatsApp con código de país (Argentina +54)
const WA_NUMBER = "542233064666";

const ASUNTO_LABELS: Record<string, string> = {
  quote: "Cotización mayorista",
  order: "Consulta sobre mi pedido",
  product: "Consulta sobre productos",
  other: "Otro",
};

export default function ContactPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [touched, setTouched] = useState({
    nombre: false,
    email: false,
    mensaje: false,
  });
  const [enviado, setEnviado] = useState(false);

  // Validaciones
  const isNombreValid = nombre.trim().length > 0;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isMensajeValid = mensaje.trim().length > 10;
  const isFormValid = isNombreValid && isEmailValid && isMensajeValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Marcar todos como tocados para mostrar errores
    if (!isFormValid) {
      setTouched({ nombre: true, email: true, mensaje: true });
      return;
    }

    // Construir el mensaje de WhatsApp con los datos del form
    const asuntoLabel = ASUNTO_LABELS[asunto] || "Consulta general";
    const lineas = [
      "¡Hola! Me contacto desde la web de Wave Arg.",
      "",
      `*Nombre:* ${nombre}`,
      `*Email:* ${email}`,
      telefono ? `*Teléfono:* ${telefono}` : null,
      `*Asunto:* ${asuntoLabel}`,
      "",
      "*Mensaje:*",
      mensaje,
    ]
      .filter((l) => l !== null)
      .join("\n");

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lineas)}`;
    window.open(url, "_blank");
    setEnviado(true);
  };

  // Helper para clases de inputs con feedback de error
  const fieldClass = (isValid: boolean, isTouched: boolean) =>
    `w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-color-principal focus:border-color-principal transition outline-none ${
      isTouched && !isValid
        ? "border-red-400 bg-red-50"
        : "border-gray-300"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-color-principal mb-3">Contacto</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ¿Tenés alguna consulta? Completá el formulario y te respondemos por
            WhatsApp en menos de 24 horas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulario de contacto */}
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold text-color-principal mb-6">
              Envíanos un mensaje
            </h2>

            {/* Estado: enviado con éxito */}
            {enviado ? (
              <div className="flex flex-col items-center justify-center text-center py-10 gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <FaWhatsapp className="text-green-500 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  ¡WhatsApp abierto!
                </h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  Tu mensaje ya está listo para enviar. Solo confirmá en
                  WhatsApp y te respondemos a la brevedad.
                </p>
                <button
                  onClick={() => {
                    setEnviado(false);
                    setNombre("");
                    setEmail("");
                    setTelefono("");
                    setAsunto("");
                    setMensaje("");
                    setTouched({ nombre: false, email: false, mensaje: false });
                  }}
                  className="text-sm text-color-principal hover:underline mt-2"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                {/* Nombre */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    className={fieldClass(isNombreValid, touched.nombre)}
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    onBlur={() =>
                      setTouched((t) => ({ ...t, nombre: true }))
                    }
                    autoComplete="name"
                  />
                  {touched.nombre && !isNombreValid && (
                    <p className="text-red-500 text-xs mt-1">
                      El nombre es obligatorio.
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Correo electrónico <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={fieldClass(isEmailValid, touched.email)}
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() =>
                      setTouched((t) => ({ ...t, email: true }))
                    }
                    autoComplete="email"
                  />
                  {touched.email && !isEmailValid && (
                    <p className="text-red-500 text-xs mt-1">
                      Ingresá un email válido.
                    </p>
                  )}
                </div>

                {/* Teléfono (opcional) */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Teléfono{" "}
                    <span className="text-gray-400 font-normal">
                      (opcional)
                    </span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-color-principal focus:border-color-principal transition outline-none"
                    placeholder="+54 11 1234-5678"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    autoComplete="tel"
                  />
                </div>

                {/* Asunto */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Asunto
                  </label>
                  <select
                    id="subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-color-principal focus:border-color-principal transition outline-none bg-white"
                    value={asunto}
                    onChange={(e) => setAsunto(e.target.value)}
                  >
                    <option value="">Seleccioná un asunto</option>
                    <option value="quote">Cotización mayorista</option>
                    <option value="order">Consulta sobre mi pedido</option>
                    <option value="product">Consulta sobre productos</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                {/* Mensaje */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mensaje <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className={fieldClass(isMensajeValid, touched.mensaje)}
                    placeholder="Detallá tu consulta (mínimo 10 caracteres)..."
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    onBlur={() =>
                      setTouched((t) => ({ ...t, mensaje: true }))
                    }
                  />
                  {touched.mensaje && !isMensajeValid && (
                    <p className="text-red-500 text-xs mt-1">
                      El mensaje debe tener al menos 10 caracteres.
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-full transition-colors flex items-center justify-center gap-2 font-semibold"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  Enviar por WhatsApp
                </Button>

                <p className="text-xs text-center text-gray-400">
                  Al enviar, se abrirá WhatsApp con tu mensaje listo para
                  confirmar.
                </p>
              </form>
            )}
          </div>

          {/* Información de contacto */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200">
              <h2 className="text-2xl font-semibold text-color-principal mb-6">
                Información de contacto
              </h2>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="bg-[#E6F2FF] p-2 rounded-full">
                    <Mail className="w-5 h-5 text-color-principal" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Correo electrónico
                    </h3>
                    <p className="text-gray-600">ventas@wavearg.com</p>
                    <p className="text-gray-600">soporte@wavearg.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#E6F2FF] p-2 rounded-full">
                    <Phone className="w-5 h-5 text-color-principal" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Teléfono</h3>
                    <p className="text-gray-600">+54 223 306-4666 (Ventas)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#E6F2FF] p-2 rounded-full">
                    <MapPin className="w-5 h-5 text-color-principal" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Ubicación</h3>
                    <p className="text-gray-600">Necochea, Argentina</p>
                    <p className="text-gray-600">Mar del Plata, Argentina</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#E6F2FF] p-2 rounded-full">
                    <Clock className="w-5 h-5 text-color-principal" />
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

            {/* CTA directo a WhatsApp */}
            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-full transition-colors shadow-md"
            >
              <FaWhatsapp className="w-6 h-6" />
              Escribinos directo por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
