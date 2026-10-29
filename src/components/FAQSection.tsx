import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const PREGUNTAS: { pregunta: string; respuesta: React.ReactNode }[] = [
  {
    pregunta: "¿Los iPhones son nuevos o usados?",
    respuesta: (
      <>
        <p>
          Todos los iPhones que vendemos son <strong>originales Apple</strong>, y pueden ser{" "}
          <strong>nuevos sellados</strong> o <strong>reacondicionados</strong> según el modelo.
        </p>
        <p>En cada publicación lo indicamos claramente: estado, capacidad, color y garantía.</p>
      </>
    ),
  },
  {
    pregunta: "¿Qué significa que un iPhone sea reacondicionado?",
    respuesta: (
      <>
        <p>
          Es <strong>un equipo original Apple que fue revisado, testeado y garantizado</strong>. Pasa por un
          control técnico completo: batería, cámara, pantalla, carcasa y software.
        </p>
        <p>
          En Wave solo publicamos equipos que cumplen <strong>100% con los estándares de calidad</strong> y
          funcionan como nuevos.
        </p>
      </>
    ),
  },
  {
    pregunta: "¿Hacen envíos a todo el país?",
    respuesta: (
      <>
        <p>
          Sí. Enviamos a <strong>todas las provincias de Argentina</strong> con correo asegurado. Cada envío se
          despacha en 24/48 hs hábiles y llega con número de seguimiento.
        </p>
        <p>También podés retirar personalmente en nuestros puntos habilitados si estás en Buenos Aires.</p>
      </>
    ),
  },
  {
    pregunta: "¿Qué medios de pago aceptan?",
    respuesta: (
      <>
        <p>
          Podés pagar con <strong>tarjeta de crédito o débito, transferencia bancaria</strong> (con descuento) o{" "}
          <strong>Mercado Pago</strong>. En cuotas, el interés depende del banco o la promoción vigente.
        </p>
        <p>
          También aceptamos <strong>plan canje</strong>, donde entregás tu iPhone usado como parte de pago.
        </p>
      </>
    ),
  },
  {
    pregunta: "¿Cómo funciona el plan canje?",
    respuesta: (
      <>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Nos mandás las fotos y el modelo de tu iPhone actual.</li>
          <li>Te hacemos una cotización real según el estado y el almacenamiento.</li>
          <li>
            Usás ese monto para <strong>ahorrar en tu nuevo iPhone Wave</strong>.
          </li>
        </ol>
        <p>Sin vueltas ni valuaciones infladas. Te decimos lo que vale, de verdad.</p>
      </>
    ),
  },
  {
    pregunta: "¿Tienen garantía?",
    respuesta: (
      <>
        <p>
          Sí. Todos nuestros equipos incluyen <strong>garantía de 3 meses</strong> contra fallas de fábrica. Los
          iPhones nuevos sellados cuentan además con la <strong>garantía oficial de Apple</strong>.
        </p>
        <p>
          Ante cualquier inconveniente técnico, nos contactás directamente y lo resolvemos. No desaparecemos
          después de la venta: <strong>damos la cara siempre.</strong>
        </p>
      </>
    ),
  },
];

export default function FAQSection() {
  return (
    <section aria-labelledby="faq" className="mx-auto max-w-6xl px-4 pt-32 md:pt-36">
      <div className="grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
        <h2 id="faq" className="revelar text-5xl md:text-7xl font-semibold tracking-[-0.045em] leading-[0.98]">
          Preguntas frecuentes
        </h2>
        <Accordion type="single" collapsible className="border-t border-borde">
          {PREGUNTAS.map(({ pregunta, respuesta }, i) => (
            <AccordionItem key={pregunta} value={`item-${i}`} className="border-b border-borde">
              <AccordionTrigger className="py-6 text-left text-xl font-medium text-tinta hover:no-underline">
                {pregunta}
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-3 pb-6 text-[17px] leading-relaxed text-tinta-suave [&_strong]:font-semibold [&_strong]:text-tinta">
                {respuesta}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
