"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { solicitarArrepentimiento } from "@/lib/arrepentimiento";
import { arrepentimientoSchema, type ArrepentimientoFormValues } from "@/schemas/arrepentimiento.schema";
import { botonPrincipal } from "@/components/home/estilos";

const campo = (conError: boolean) =>
  `mt-2 w-full rounded-control border bg-white px-4 py-3 body-3 text-tinta placeholder:text-tinta-suave transition-colors duration-300 ease-ola ${
    conError ? "border-red-700" : "border-borde-fuerte hover:border-tinta-suave"
  }`;

type Campo = keyof ArrepentimientoFormValues;

const CAMPOS: { nombre: Campo; label: string; opcional?: boolean; tipo?: string; autoComplete?: string; placeholder?: string }[] = [
  { nombre: "nombre", label: "Nombre y apellido", autoComplete: "name" },
  { nombre: "email", label: "Email", tipo: "email", autoComplete: "email", placeholder: "tu@correo.com" },
  { nombre: "numeroPedido", label: "Número de pedido", opcional: true, autoComplete: "off", placeholder: "Está en Mis pedidos" },
];

// Botón de arrepentimiento (Res. 424/2020): registra la solicitud en el back y muestra el código
// que la identifica, que también le llega por mail. Si el back falla, la página ofrece WhatsApp y
// mail como alternativa.
export default function FormularioArrepentimiento() {
  const [codigo, setCodigo] = useState<string | null>(null);
  const [fallo, setFallo] = useState(false);
  // Al confirmar, el formulario desaparece: el foco va al título, que el lector de pantalla anuncia.
  const tituloRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (codigo) tituloRef.current?.focus();
  }, [codigo]);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ArrepentimientoFormValues>({
    resolver: zodResolver(arrepentimientoSchema),
    defaultValues: { nombre: "", email: "", numeroPedido: "", detalle: "" },
  });

  const onSubmit = async (valores: ArrepentimientoFormValues) => {
    setFallo(false);
    try {
      setCodigo(await solicitarArrepentimiento(valores));
    } catch {
      setFallo(true);
    }
  };

  if (codigo) {
    return (
      <div role="status" className="rounded-control border border-borde-fuerte p-6">
        <h3 ref={tituloRef} tabIndex={-1} className="heading-5 text-tinta focus:outline-none">
          Recibimos tu solicitud
        </h3>
        <p className="mt-3 body-3 text-tinta">
          El código de tu solicitud es <strong className="font-semibold">{codigo}</strong>. Guardalo: también te lo
          mandamos a <strong className="font-semibold">{getValues("email")}</strong>.
        </p>
        <p className="mt-3 body-3 text-tinta-suave">Te vamos a contactar para coordinar la devolución y el reintegro.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      {CAMPOS.map(({ nombre, label, opcional, tipo, autoComplete, placeholder }) => (
        <div key={nombre}>
          <label htmlFor={`arrepentimiento-${nombre}`} className="body-4 text-tinta">
            {label} {opcional && <span className="font-normal text-tinta-suave">(opcional)</span>}
          </label>
          <input
            id={`arrepentimiento-${nombre}`}
            type={tipo ?? "text"}
            autoComplete={autoComplete}
            placeholder={placeholder}
            aria-invalid={!!errors[nombre]}
            aria-describedby={errors[nombre] ? `arrepentimiento-${nombre}-error` : undefined}
            className={campo(!!errors[nombre])}
            {...register(nombre)}
          />
          {errors[nombre] && (
            <p id={`arrepentimiento-${nombre}-error`} role="alert" className="mt-2 caption-2 text-red-700">
              {errors[nombre]?.message}
            </p>
          )}
        </div>
      ))}

      <div>
        <label htmlFor="arrepentimiento-detalle" className="body-4 text-tinta">
          ¿Algo más que quieras contarnos? <span className="font-normal text-tinta-suave">(opcional)</span>
        </label>
        <textarea
          id="arrepentimiento-detalle"
          rows={3}
          aria-invalid={!!errors.detalle}
          aria-describedby={errors.detalle ? "arrepentimiento-detalle-error" : undefined}
          className={campo(!!errors.detalle)}
          {...register("detalle")}
        />
        {errors.detalle && (
          <p id="arrepentimiento-detalle-error" role="alert" className="mt-2 caption-2 text-red-700">
            {errors.detalle.message}
          </p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting} className={`${botonPrincipal} mt-2 w-full sm:w-auto disabled:bg-borde disabled:text-tinta-suave`}>
        {isSubmitting ? "Enviando…" : "Arrepentirme de la compra"}
      </button>

      {fallo && (
        <p role="alert" className="caption-2 text-red-700">
          No pudimos registrar tu solicitud. Probá de nuevo en un rato o pedila por WhatsApp o email, acá abajo.
        </p>
      )}
    </form>
  );
}
