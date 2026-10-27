"use client";

import { useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { esCheckoutPausado, MercadoPagoService } from "@/lib/api";
import { useEstado } from "@/context/EstadoContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, CreditCard, Loader2, AlertCircle, LogIn, Check, MapPin, PauseCircle } from "lucide-react";
import {
  primerCampoInvalido,
  validarDireccion,
  type CampoDireccion,
  type DireccionForm,
  type ErroresDireccion,
} from "@/lib/direccion";

// Campos de la dirección de envío, en el orden del formulario. autocomplete deja que el
// navegador los complete (front#9).
const CAMPOS: {
  campo: CampoDireccion;
  label: string;
  autoComplete: string;
  placeholder?: string;
  ancho?: boolean;
}[] = [
  { campo: "calle", label: "Calle y número", autoComplete: "street-address", placeholder: "Ej: Av. Corrientes 1234, Piso 3 Depto B", ancho: true },
  { campo: "ciudad", label: "Ciudad / Localidad", autoComplete: "address-level2", placeholder: "Ej: Rosario" },
  { campo: "codigoPostal", label: "Código Postal", autoComplete: "postal-code", placeholder: "Ej: 2000" },
  { campo: "provincia", label: "Provincia", autoComplete: "address-level1", ancho: true },
];

const PROVINCIAS = [
  "Buenos Aires", "CABA", "Catamarca", "Chaco", "Chubut", "Córdoba",
  "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja",
  "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan",
  "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero",
  "Tierra del Fuego", "Tucumán",
];

export default function CheckoutPage() {
  const { cart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState(false);
  // El estado llega del layout; si el checkout se apaga después, lo avisa el 503 del back.
  const [pausado, setPausado] = useState(!useEstado().checkoutHabilitado);
  const [formErrors, setFormErrors] = useState<ErroresDireccion>({});
  const camposRef = useRef<Partial<Record<CampoDireccion, HTMLInputElement | HTMLSelectElement | null>>>({});

  const [direccion, setDireccion] = useState<DireccionForm>({
    calle: "",
    ciudad: "",
    provincia: "",
    codigoPostal: "",
  });

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Con errores, el foco va al primer campo inválido, que anuncia su mensaje (aria-describedby).
  const direccionValida = (): boolean => {
    const errores = validarDireccion(direccion);
    setFormErrors(errores);
    const primero = primerCampoInvalido(errores);
    if (primero) camposRef.current[primero]?.focus();
    return primero === null;
  };

  const cambiarCampo = (campo: CampoDireccion, valor: string) => {
    setDireccion((d) => ({ ...d, [campo]: valor }));
    if (formErrors[campo]) setFormErrors((f) => ({ ...f, [campo]: undefined }));
  };

  const handlePagar = async () => {
    if (cart.length === 0) return;
    if (!direccionValida()) return;

    setLoading(true);
    setError(null);
    setAuthError(false);

    try {
      const items = cart.map((item) => {
        const parts = item.id.split("-");
        const varianteId = parseInt(parts[1] ?? parts[0], 10);
        if (isNaN(varianteId)) {
          throw new Error(
            `ID de variante inválido: "${item.id}". Vaciá el carrito y volvé a agregar los productos.`
          );
        }
        return {
          productoId: varianteId,
          nombre: item.name,
          cantidad: item.quantity,
          precio: item.price,
          esAccesorio: item.type === "accesorio",
        };
      });

      const preferencia = await MercadoPagoService.crearPreferencia(items, {
        calle: direccion.calle.trim(),
        ciudad: direccion.ciudad.trim(),
        provincia: direccion.provincia,
        codigoPostal: direccion.codigoPostal.trim(),
      });

      const raw = preferencia as Record<string, unknown>;
      const urlPago =
        (raw.url_real as string) ??
        (raw.url_prueba as string);

      if (!urlPago) {
        throw new Error(
          "No se recibió la URL de pago de MercadoPago. Revisá la consola para ver la respuesta del backend."
        );
      }

      window.location.href = urlPago;
    } catch (err: unknown) {
      if (esCheckoutPausado(err)) {
        setPausado(true);
        setLoading(false);
        return;
      }
      const message =
        err instanceof Error
          ? err.message
          : "Error al conectar con MercadoPago. Intentá de nuevo.";

      const msgLower = message.toLowerCase();

      if (msgLower.includes("sesión iniciada") || msgLower.includes("sesión")) {
        setAuthError(true);
      } else if (
        msgLower.includes("unauthorized") ||
        msgLower.includes("403") ||
        msgLower.includes("policy")
      ) {
        setError(
          "El servicio de pago no está disponible en este momento. Por favor contactanos por WhatsApp o intentá más tarde."
        );
      } else {
        setError(message);
      }
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-24 px-4 text-center">
        <ShoppingCart size={64} className="text-gray-300 mb-6" />
        <h1 className="text-2xl font-bold text-gray-700 mb-2">
          Tu carrito está vacío
        </h1>
        <p className="text-gray-500 mb-6">
          Agregá productos antes de continuar con el pago.
        </p>
        <Link
          href="/products"
          className="bg-color-principal text-white px-8 py-3 rounded-full hover:bg-color-principal-oscuro transition font-semibold"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Indicador de pasos (visual; el lector de pantalla lee el texto de abajo) */}
        <p className="sr-only">Paso 2 de 3: revisión del pedido.</p>
        <div aria-hidden="true" className="flex items-center justify-center gap-0 mb-10">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-color-principal flex items-center justify-center">
              <Check size={16} className="text-white" />
            </div>
            <span className="text-[11px] text-color-principal font-semibold mt-1.5">Carrito</span>
          </div>

          <div className="w-16 sm:w-24 h-0.5 bg-color-principal mb-5" />

          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-color-principal ring-4 ring-color-principal/20 flex items-center justify-center">
              <span className="text-white text-xs font-bold">2</span>
            </div>
            <span className="text-[11px] text-color-principal font-semibold mt-1.5">Revisión</span>
          </div>

          <div className="w-16 sm:w-24 h-0.5 bg-gray-200 mb-5" />

          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-xs font-bold">3</span>
            </div>
            <span className="text-[11px] text-gray-500 font-medium mt-1.5">Pago</span>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-color-principal">Revisá tu pedido</h1>
          <p className="text-gray-500 mt-1">
            Confirmá los productos y completá la dirección de envío
          </p>
        </div>

        {/* Resumen del pedido */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Resumen del pedido
          </h2>

          <ul className="divide-y divide-gray-100">
            {cart.map((item) => (
              <li key={item.id} className="py-4 flex items-center gap-4">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="rounded-xl object-cover border border-gray-100"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                    <ShoppingCart size={24} className="text-gray-500" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} × ${item.price.toLocaleString("es-AR")}
                  </p>
                </div>

                <div className="font-bold text-gray-900 text-right">
                  ${(item.price * item.quantity).toLocaleString("es-AR")}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-lg font-bold text-gray-800">Total</span>
            <span className="text-2xl font-bold text-color-principal">
              ${total.toLocaleString("es-AR")}
            </span>
          </div>
        </div>

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            handlePagar();
          }}
        >
        {/* Dirección de envío */}
        <fieldset className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <legend className="sr-only">Dirección de envío</legend>
          <div className="flex items-center gap-2 mb-5">
            <MapPin size={20} className="text-color-principal" strokeWidth={1.75} aria-hidden="true" />
            <h2 className="text-lg font-semibold text-gray-800">Dirección de envío</h2>
          </div>
          <p className="text-xs text-gray-600 mb-4">Todos los campos son obligatorios.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CAMPOS.map(({ campo, label, autoComplete, placeholder, ancho }) => {
              const id = `checkout-${campo}`;
              const error = formErrors[campo];
              const props = {
                id,
                name: campo,
                autoComplete,
                required: true,
                value: direccion[campo],
                "aria-invalid": error ? true : undefined,
                "aria-describedby": error ? `${id}-error` : undefined,
                className: `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-color-principal/30 focus:border-color-principal ${
                  error ? "border-red-600 bg-red-50" : "border-gray-300 bg-gray-50"
                }`,
              };
              return (
                <div key={campo} className={ancho ? "sm:col-span-2" : undefined}>
                  <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label} <span className="text-red-700" aria-hidden="true">*</span>
                  </label>
                  {campo === "provincia" ? (
                    <select
                      {...props}
                      ref={(el) => { camposRef.current[campo] = el; }}
                      onChange={(e) => cambiarCampo(campo, e.target.value)}
                    >
                      <option value="">Seleccioná una provincia</option>
                      {PROVINCIAS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      {...props}
                      type="text"
                      placeholder={placeholder}
                      ref={(el) => { camposRef.current[campo] = el; }}
                      onChange={(e) => cambiarCampo(campo, e.target.value)}
                    />
                  )}
                  {error && (
                    <p id={`${id}-error`} className="text-xs text-red-700 mt-1">{error}</p>
                  )}
                </div>
              );
            })}
          </div>
        </fieldset>

        {/* Info de pago */}
        <div className="bg-color-principal/5 border border-color-principal/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <CreditCard className="text-color-principal mt-0.5 shrink-0" size={20} />
          <div className="text-sm text-gray-700">
            <p className="font-semibold text-color-principal mb-0.5">
              Pago seguro con MercadoPago
            </p>
            <p>
              Serás redirigido al portal de pago de MercadoPago donde podrás
              abonar con tarjeta de crédito, débito, transferencia o efectivo.
            </p>
          </div>
        </div>

        {/* Error de sesión no iniciada */}
        {authError && (
          <div role="alert" className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 flex items-start gap-4">
            <LogIn className="text-amber-600 shrink-0 mt-0.5" size={22} aria-hidden="true" />
            <div className="flex-1">
              <p className="font-semibold text-amber-800 mb-1">
                Necesitás iniciar sesión
              </p>
              <p className="text-amber-700 text-sm mb-4">
                Para continuar con el pago es necesario que tengas una sesión
                iniciada. Por favor, iniciá sesión y volvé a intentarlo.
              </p>
              <button
                type="button"
                onClick={() => router.push(`/login?redirect=/checkout`)}
                className="bg-color-principal text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-color-principal-oscuro transition flex items-center gap-2"
              >
                <LogIn size={16} />
                Iniciar sesión
              </button>
            </div>
          </div>
        )}

        {/* Interruptores__CheckoutHabilitado=false en el back */}
        {pausado && (
          <div role="status" className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 flex items-start gap-4">
            <PauseCircle className="text-amber-600 shrink-0 mt-0.5" size={22} aria-hidden="true" />
            <div>
              <p className="font-semibold text-amber-800 mb-1">Las compras están pausadas</p>
              <p className="text-amber-700 text-sm">
                Volvemos a tomar pedidos en unos minutos. Tu carrito queda guardado.
              </p>
            </div>
          </div>
        )}

        {/* Error genérico */}
        {error && (
          <div role="alert" className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} aria-hidden="true" />
            <div className="text-sm">
              <p className="font-semibold text-red-700 mb-0.5">Ocurrió un error</p>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Botón de pago */}
        <button
          type="submit"
          disabled={loading || pausado}
          aria-busy={loading || undefined}
          className="w-full bg-mp-dark hover:bg-mp-darker active:bg-mp-darker disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 text-lg transition-all duration-200 shadow-lg shadow-mp/30"
        >
          {loading ? (
            <>
              <Loader2 size={22} className="animate-spin" aria-hidden="true" />
              Conectando con MercadoPago…
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                aria-hidden="true"
                className="w-6 h-6 fill-white"
              >
                <path d="M24 4C13 4 4 13 4 24s9 20 20 20 20-9 20-20S35 4 24 4zm0 36c-8.8 0-16-7.2-16-16S15.2 8 24 8s16 7.2 16 16-7.2 16-16 16zm-2-22h4v12h-4zm0-6h4v4h-4z" />
              </svg>
              Pagar con MercadoPago
            </>
          )}
        </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-4">
          Al continuar aceptás los{" "}
          <a href="#" className="underline hover:text-gray-600">
            términos y condiciones
          </a>{" "}
          de la compra.
        </p>

        <div className="mt-6 text-center">
          <Link
            href="/cart"
            className="text-color-principal hover:underline text-sm font-medium"
          >
            ← Volver al carrito
          </Link>
        </div>
      </div>
    </div>
  );
}
