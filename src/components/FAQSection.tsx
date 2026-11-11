import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { GRUPOS, PREGUNTAS } from "@/components/faq-datos";

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
