import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { GRUPOS, PREGUNTAS } from "@/components/faq-datos";
import { enlace, tituloSeccion } from "@/components/home/estilos";
import { linkWhatsApp } from "@/lib/whatsapp";

export default function FAQSection() {
  return (
    <section aria-labelledby="faq">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 md:py-24">
        <div>
          <h2 id="faq" className={tituloSeccion}>
            Preguntas frecuentes
          </h2>
          <p className="mt-4 body-3 text-tinta-suave">
            ¿No está tu duda?{" "}
            <a
              href={linkWhatsApp("Hola, tengo una consulta sobre los productos de Wave.")}
              target="_blank"
              rel="noopener noreferrer"
              className={enlace}
            >
              Escribinos por WhatsApp
            </a>
          </p>
        </div>
        <div className="flex flex-col gap-10">
          {GRUPOS.map((grupo) => (
            <div key={grupo}>
              <h3 className="mb-2 body-4 text-tinta-suave">{grupo}</h3>
              <Accordion type="single" collapsible className="border-t border-borde">
                {PREGUNTAS.filter((p) => p.grupo === grupo).map(({ pregunta, respuesta }) => (
                  <AccordionItem key={pregunta} value={pregunta} className="border-b border-borde">
                    <AccordionTrigger className="py-4 text-left title-2 text-tinta hover:no-underline">
                      {pregunta}
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-3 pb-6 body-3 text-tinta-suave [&_strong]:font-semibold [&_strong]:text-tinta">
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
