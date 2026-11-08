import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Grupo = "Los equipos" | "Pago y canje" | "Envíos";

export const PREGUNTAS: { grupo: Grupo; pregunta: string; respuesta: React.ReactNode }[] = [
  {
    grupo: "Los equipos",
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
    grupo: "Los equipos",
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
    grupo: "Envíos",
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
    grupo: "Pago y canje",
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
    grupo: "Pago y canje",
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
    grupo: "Los equipos",
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

// Agrupadas por tema para encontrar rápido la respuesta (orden de los grupos: lo que más se pregunta).
export const GRUPOS: Grupo[] = ["Los equipos", "Pago y canje", "Envíos"];

export default function FAQSection() {
  return (
    <section aria-labelledby="faq" className="border-t border-borde">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-24 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 md:py-32">
        <h2 id="faq" className="font-display font-extrabold tracking-[-0.025em] leading-[0.98] text-[clamp(32px,4.2vw,52px)]">
          Preguntas frecuentes
        </h2>
        <div className="flex flex-col gap-12">
          {GRUPOS.map((grupo) => (
            <div key={grupo}>
              <h3 className="mb-2 text-[15px] font-semibold text-tinta-suave">{grupo}</h3>
              <Accordion type="single" collapsible className="border-t border-borde">
                {PREGUNTAS.filter((p) => p.grupo === grupo).map(({ pregunta, respuesta }) => (
                  <AccordionItem key={pregunta} value={pregunta} className="border-b border-borde">
                    <AccordionTrigger className="py-5 text-left text-lg font-medium text-tinta hover:no-underline">
                      {pregunta}
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-3 pb-6 text-[17px] leading-relaxed text-tinta-suave [&_strong]:font-semibold [&_strong]:text-tinta">
                      {respuesta}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
