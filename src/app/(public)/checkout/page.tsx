
"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";


export default function CheckoutPage() {
  const { cart } = useCart();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [touched, setTouched] = useState({ nombre: false, email: false, telefono: false });

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Validaciones simples
  const isNombreValid = nombre.trim().length > 0;
  const isEmailValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const isTelefonoValid = /^\d{8,}$/.test(telefono.replace(/\D/g, ""));
  const isFormValid = isNombreValid && isEmailValid && isTelefonoValid;

  return (
    <div className="max-w-2xl mx-auto my-8 p-8 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Pago</h1>

      {/* Resumen del pedido */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Resumen del pedido</h2>
        {cart.length === 0 ? (
          <p className="text-gray-500">Tu carrito está vacío.</p>
        ) : (
          <>
            <ul className="divide-y divide-gray-200 mb-2">
              {cart.map((item) => (
                <li key={item.id} className="py-2 flex items-center gap-4">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={56}
                      height={56}
                      className="rounded"
                    />
                  )}
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between">
                    <span>{item.name} x{item.quantity}</span>
                    <span className="font-medium">${item.price * item.quantity}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${total}</span>
            </div>
          </>
        )}
      </div>

      {/* Divider visual */}
      <hr className="my-8 border-gray-200" />

      {/* Formulario de comprador */}
      <form className="mb-6" autoComplete="on">
        <h2 className="text-lg font-semibold mb-2">Datos del comprador</h2>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Nombre</label>
          <input
            type="text"
            className={`w-full border rounded px-3 py-2 ${!isNombreValid && touched.nombre ? 'border-red-500' : ''}`}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, nombre: true }))}
            placeholder="Tu nombre"
            autoComplete="name"
          />
          {!isNombreValid && touched.nombre && (
            <span className="text-red-500 text-sm">El nombre es obligatorio.</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            className={`w-full border rounded px-3 py-2 ${!isEmailValid && touched.email ? 'border-red-500' : ''}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            placeholder="tu@email.com"
            autoComplete="email"
          />
          {!isEmailValid && touched.email && (
            <span className="text-red-500 text-sm">Ingresá un email válido.</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Teléfono</label>
          <input
            type="tel"
            className={`w-full border rounded px-3 py-2 ${!isTelefonoValid && touched.telefono ? 'border-red-500' : ''}`}
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, telefono: true }))}
            placeholder="Ej: 11 1234-5678"
            autoComplete="tel"
          />
          {!isTelefonoValid && touched.telefono && (
            <span className="text-red-500 text-sm">El teléfono es obligatorio.</span>
          )}
        </div>
      </form>

      {/* Feedback visual de formulario completo */}
      {isFormValid && cart.length > 0 && (
        <div className="mb-4 flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2 animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          ¡Todo listo! Podés continuar el pago por WhatsApp.
        </div>
      )}

      <button
        className={`w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded flex items-center justify-center gap-2 text-lg transition ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
        type="button"
        disabled={!isFormValid}
        tabIndex={!isFormValid ? -1 : 0}
        aria-disabled={!isFormValid}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 12c0-4.556-3.694-8.25-8.25-8.25S3.75 7.444 3.75 12c0 1.385.338 2.69.934 3.833L3 21l5.333-1.667A8.212 8.212 0 0 0 12 20.25c4.556 0 8.25-3.694 8.25-8.25Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.635 11.25a3.375 3.375 0 0 0 6.73 0" />
        </svg>
        Continuar pago en WhatsApp
      </button>
    </div>
  );
}
