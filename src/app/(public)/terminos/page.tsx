import type { Metadata } from "next";
import PaginaLegal from "@/components/PaginaLegal";

// noindex mientras el texto sea un borrador: sacarlo cuando Wave cargue el documento definitivo.
export const metadata: Metadata = {
  title: "Términos y condiciones | Wave Arg",
  robots: { index: false },
};

export default function TerminosPage() {
  return (
    <PaginaLegal
      titulo="Términos y condiciones"
      pendiente="Wave tiene que aportar este documento, revisado por su asesor legal, antes de publicar el sitio."
    >
      <p>Cuando esté publicado, este documento va a explicar:</p>
      <ul>
        <li>Quién vende y cómo contactarlo.</li>
        <li>Cómo se publican los productos, los precios y el stock.</li>
        <li>Los medios de pago y las cuotas.</li>
        <li>Los envíos, los plazos y la entrega.</li>
        <li>La garantía de los equipos nuevos y usados.</li>
        <li>Los cambios, las devoluciones y el derecho de arrepentimiento.</li>
        <li>El plan canje.</li>
        <li>La ley aplicable y dónde reclamar.</li>
      </ul>
    </PaginaLegal>
  );
}
