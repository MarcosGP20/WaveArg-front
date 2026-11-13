"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LEADS_POR_API, leadDesdeFormulario, linkAvisoWhatsApp, registrarLead } from "@/lib/leads";
import { linkWhatsApp } from "@/lib/whatsapp";
import { leadSchema, type LeadFormValues } from "@/schemas/lead.schema";
import { botonPrincipal, enlace } from "./estilos";

type Resultado = { tipo: "guardado"; email: string } | { tipo: "whatsapp"; link: string };

const campo = (conError: boolean) =>
  `mt-2 w-full rounded-control border bg-white px-4 py-3 body-3 text-tinta placeholder:text-tinta-suave transition-colors duration-300 ease-ola ${
    conError ? "border-red-700" : "border-borde-fuerte hover:border-tinta-suave"
  }`;

// Formulario de avisos de la home: quien no compra hoy deja su contacto. Sólo el email es
// obligatorio. Según LEADS_POR_API, el pedido se guarda en el back o sale por WhatsApp con el
// mensaje ya escrito (ver lib/leads.ts): en los dos casos la persona sabe qué pasó con su dato.
export default function FormularioAvisos() {
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [fallo, setFallo] = useState(false);
  // Al confirmar, el formulario desaparece: el foco va al título, que el lector de pantalla anuncia.
  const tituloRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (resultado) tituloRef.current?.focus();
  }, [resultado]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: { email: "", modelo: "", whatsapp: "" },
  });

  const onSubmit = async (valores: LeadFormValues) => {
    const lead = leadDesdeFormulario(valores);
    if (!LEADS_POR_API) {
      const link = linkAvisoWhatsApp(lead);
      // Si el navegador bloquea la pestaña nueva, el mismo link queda a la vista en la confirmación.
      window.open(link, "_blank", "noopener,noreferrer");
      setResultado({ tipo: "whatsapp", link });
      return;
    }
    setFallo(false);
    try {
      await registrarLead(lead);
      setResultado({ tipo: "guardado", email: lead.email });
    } catch {
      setFallo(true);
    }
  };

  if (resultado?.tipo === "guardado") {
    return (
      <div role="status">
        <h3 ref={tituloRef} tabIndex={-1} className="heading-5 text-tinta focus:outline-none">
          Listo, quedaste en la lista
        </h3>
        <p className="mt-3 body-3 text-tinta-suave">
          Te vamos a escribir a <strong className="font-semibold text-tinta">{resultado.email}</strong> cuando entre stock.
        </p>
        <Link href="/products" className={`mt-6 inline-block body-2 ${enlace}`}>
          Mientras tanto, mirá lo que hay hoy
        </Link>
      </div>
    );
  }

  if (resultado?.tipo === "whatsapp") {
    return (
      <div role="status">
        <h3 ref={tituloRef} tabIndex={-1} className="heading-5 text-tinta focus:outline-none">
          Falta un paso: mandá el mensaje
        </h3>
        <p className="mt-3 body-3 text-tinta-suave">
          Abrimos WhatsApp con tu pedido ya escrito. Cuando lo envíes, quedás en la lista.
        </p>
        <a href={resultado.link} target="_blank" rel="noopener noreferrer" className={`${botonPrincipal} mt-6 w-full`}>
          Abrir WhatsApp
        </a>
        <button type="button" onClick={() => setResultado(null)} className={`mt-4 block py-3 body-2 ${enlace}`}>
          Volver al formulario
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <div>
        <label htmlFor="aviso-email" className="body-4 text-tinta">
          Email
        </label>
        <input
          id="aviso-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "aviso-email-error" : undefined}
          className={campo(!!errors.email)}
          {...register("email")}
        />
        {errors.email && (
          <p id="aviso-email-error" role="alert" className="mt-2 caption-2 text-red-700">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="aviso-modelo" className="body-4 text-tinta">
          ¿Buscás un modelo en particular? <span className="font-normal text-tinta-suave">(opcional)</span>
        </label>
        <input
          id="aviso-modelo"
          type="text"
          autoComplete="off"
          placeholder="Ej.: iPhone 15 Pro de 256GB"
          aria-invalid={!!errors.modelo}
          aria-describedby={errors.modelo ? "aviso-modelo-error" : undefined}
          className={campo(!!errors.modelo)}
          {...register("modelo")}
        />
        {errors.modelo && (
          <p id="aviso-modelo-error" role="alert" className="mt-2 caption-2 text-red-700">
            {errors.modelo.message}
          </p>
        )}
      </div>

      {LEADS_POR_API && (
        <div>
          <label htmlFor="aviso-whatsapp" className="body-4 text-tinta">
            WhatsApp <span className="font-normal text-tinta-suave">(opcional)</span>
          </label>
          <input
            id="aviso-whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Con código de área, por ejemplo 2262 123456"
            aria-invalid={!!errors.whatsapp}
            aria-describedby={errors.whatsapp ? "aviso-whatsapp-error" : undefined}
            className={campo(!!errors.whatsapp)}
            {...register("whatsapp")}
          />
          {errors.whatsapp && (
            <p id="aviso-whatsapp-error" role="alert" className="mt-2 caption-2 text-red-700">
              {errors.whatsapp.message}
            </p>
          )}
        </div>
      )}

      <button type="submit" disabled={isSubmitting} className={`${botonPrincipal} mt-2 w-full disabled:bg-borde disabled:text-tinta-suave`}>
        {isSubmitting ? "Enviando…" : LEADS_POR_API ? "Avisame" : "Avisame por WhatsApp"}
      </button>

      {fallo && (
        <p role="alert" className="caption-2 text-red-700">
          No pudimos guardar tu contacto. Probá de nuevo en un rato o{" "}
          <a
            href={linkWhatsApp("Hola, quiero que me avisen cuando entren iPhones.")}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            pedí el aviso por WhatsApp
          </a>
          .
        </p>
      )}

      <p className="caption-2 text-tinta-suave">
        {LEADS_POR_API ? "" : "Se abre WhatsApp con tu pedido ya escrito. "}
        Usamos tu contacto sólo para estos avisos.{" "}
        <Link href="/privacidad" className={enlace}>
          Política de privacidad
        </Link>
      </p>
    </form>
  );
}
