import { PENDIENTE, VENDEDOR } from "@/lib/vendedor";

// Marco de las páginas legales (/terminos, /privacidad, /arrepentimiento). El aviso de "pendiente"
// marca lo que todavía tiene que aportar Wave: no se inventa texto legal.
export default function PaginaLegal({
  titulo,
  pendiente,
  children,
}: {
  titulo: string;
  /** Qué falta para que la página esté completa. */
  pendiente?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-tinta md:py-24">
      <h1 className="heading-4 text-balance md:heading-3">{titulo}</h1>
      {pendiente && (
        <p className="mt-8 rounded-panel border border-borde-fuerte bg-superficie p-6 body-3">
          <strong className="font-semibold">Texto pendiente.</strong> {pendiente}
        </p>
      )}
      <div className="mt-8 flex flex-col gap-4 body-3 text-pretty [&_h2]:mt-6 [&_h2]:heading-6 [&_li]:ml-6 [&_li]:list-disc [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2">
        {children}
      </div>
      <h2 className="mt-12 heading-6">Datos del vendedor</h2>
      <address className="mt-4 flex flex-col gap-1 body-3 not-italic text-tinta-suave">
        <span>{VENDEDOR.nombre}</span>
        <span>Razón social: {VENDEDOR.razonSocial ?? PENDIENTE}</span>
        <span>CUIT: {VENDEDOR.cuit ?? PENDIENTE}</span>
        <span>Domicilio legal: {VENDEDOR.domicilioLegal ?? PENDIENTE}</span>
        <a href={`mailto:${VENDEDOR.email}`} className="self-start text-color-principal underline underline-offset-4">
          {VENDEDOR.email}
        </a>
      </address>
    </div>
  );
}
