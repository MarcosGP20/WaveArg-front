import type { Metadata } from "next";
import PaginaLegal from "@/components/PaginaLegal";

// noindex mientras el texto sea un borrador: sacarlo cuando Wave cargue el documento definitivo.
export const metadata: Metadata = {
  title: "Política de privacidad | Wave Arg",
  robots: { index: false },
};

export default function PrivacidadPage() {
  return (
    <PaginaLegal
      titulo="Política de privacidad"
      pendiente="Wave tiene que aportar este documento, revisado por su asesor legal, antes de publicar el sitio."
    >
      <p>Cuando esté publicado, este documento va a explicar:</p>
      <ul>
        <li>Qué datos pide el sitio: los de la cuenta, los del envío y el contacto que dejás para recibir avisos.</li>
        <li>Para qué se usa cada uno.</li>
        <li>Con quién se comparten para poder cobrar y enviar el pedido.</li>
        <li>Cuánto tiempo se guardan.</li>
        <li>Cómo pedir que te muestren, corrijan o borren tus datos (Ley 25.326 de Protección de Datos Personales).</li>
        <li>Cómo dejar de recibir avisos.</li>
      </ul>
    </PaginaLegal>
  );
}
