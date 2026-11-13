import type { Metadata } from "next";
import Link from "next/link";
import PaginaLegal from "@/components/PaginaLegal";
import { botonPrincipal, enlace } from "@/components/home/estilos";
import { VENDEDOR } from "@/lib/vendedor";
import { linkWhatsApp } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Botón de arrepentimiento | Wave Arg",
  description: "Cómo arrepentirte de una compra hecha en la web de Wave Arg dentro de los 10 días.",
};

const PEDIDO = "Quiero arrepentirme de una compra hecha en la web.\nNombre:\nNúmero de pedido:";

// Botón de arrepentimiento (Res. 424/2020): sin registro ni trámite previo. Hoy el pedido sale por
// WhatsApp o mail con los datos ya pedidos en el mensaje; falta un endpoint en el back que lo
// registre y devuelva el código de la solicitud.
export default function ArrepentimientoPage() {
  return (
    <PaginaLegal
      titulo="Botón de arrepentimiento"
      pendiente="Wave tiene que confirmar cómo se devuelve el equipo y por dónde se reintegra el dinero."
    >
      <p>
        Si compraste por la web, tenés <strong className="font-semibold">10 días corridos</strong> desde que recibís el
        equipo para arrepentirte de la compra, sin dar explicaciones y sin costo (artículo 34 de la Ley 24.240 de
        Defensa del Consumidor).
      </p>
      <p>
        Para pedirlo no hace falta tener cuenta ni iniciar sesión. Mandanos tu nombre y el número de pedido, que está
        en{" "}
        <Link href="/account/orders" className={enlace}>
          Mis pedidos
        </Link>
        , por cualquiera de estos medios:
      </p>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
        <a href={linkWhatsApp(`Hola. ${PEDIDO}`)} target="_blank" rel="noopener noreferrer" className={botonPrincipal}>
          Pedir por WhatsApp
        </a>
        <a
          href={`mailto:${VENDEDOR.email}?subject=${encodeURIComponent("Arrepentimiento de compra")}&body=${encodeURIComponent(PEDIDO)}`}
          className={`body-2 ${enlace}`}
        >
          Pedir por email
        </a>
      </div>
      <h2>Qué pasa después</h2>
      <p>Dentro de las 24 horas te respondemos por el mismo medio con el código de tu solicitud.</p>
    </PaginaLegal>
  );
}
