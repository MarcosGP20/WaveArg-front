import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection() {
  return (
    <>
      <h2 className="mt-14 text-3xl text-[#05467D] font-bold text-center">
        Preguntas frecuentes
      </h2>
      <div className="w-full flex justify-center items-center py-10">
        <Accordion
          type="single"
          collapsible
          className=" w-full max-w-3xl  "
          defaultValue="item-1"
        >
          <AccordionItem
            className="border-b-0 border-gray-300 rounded-lg shadow-md overflow-hidden"
            value="item-1"
          >
            <AccordionTrigger className="font-semibold text-xl px-4 py-5 text-left text-[#05467D] hover:bg-gray-200 hover:no-underline rounded-lg shadow-md overflow-hidden">
              ¿Los iPhones son nuevos o usados?
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance p-4 text-[#05467D] text-lg">
              <p>
                Todos los iPhones que vendemos son{" "}
                <span className="font-semibold">originales Apple</span>, y
                pueden ser{" "}
                <span className="font-semibold">nuevos sellados</span> o
                <span className="font-semibold">reacondicionados</span> según el
                modelo
              </p>
              <p>
                En cada publicación lo indicamos claramente: estado, capacidad,
                color y garantía
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            className="border-b-0 border-gray-300 rounded-lg shadow-md overflow-hidden"
            value="item-2"
          >
            <AccordionTrigger className="font-semibold text-xl px-4 py-5 text-left text-[#05467D] hover:bg-gray-200 hover:no-underline rounded-lg shadow-md overflow-hidden">
              ¿Qué signfica que un iPhone sea reacondicionado?
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance p-4  text-[#05467D] text-lg">
              <p>
                Un iPhone reacondicionado es{" "}
                <span className="font-semibold">
                  un equipo original Apple que fue revisado, testeado y
                  garantizado.
                </span>
              </p>

              <p>
                Pasa por un control técnico completo: batería, cámara, pantalla,
                carcasa y software.
              </p>
              <p>
                En WAVE solo publicamos equipos que cumplen
                <span className="font-semibold">
                  100% con los estándares de calidad
                </span>
                y funcionan como nuevos.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            className="border-b-0 border-gray-300 rounded-lg shadow-md overflow-hidden"
            value="item-3"
          >
            <AccordionTrigger className="font-semibold text-xl px-4 py-5 text-left text-[#05467D] hover:bg-gray-200 hover:no-underline rounded-lg shadow-md overflow-hidden">
              ¿Hacen envíos a todo el país?
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance p-4  text-[#05467D] text-lg">
              <p>
                Sí. Enviamos a{" "}
                <span className="font-semibold">
                  todas las provincias de Argentina
                </span>
                con correo asegurado. Cada envío se despacha en 24/48 hs hábiles
                y llega con número de seguimiento.
              </p>
              <p>
                También podés retirar personalmente en nuestros puntos
                habilitados si estás en Buenos Aires.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            className="border-b-0 border-gray-300 rounded-lg shadow-md overflow-hidden"
            value="item-4"
          >
            <AccordionTrigger className="font-semibold text-xl px-4 py-5 text-left text-[#05467D] hover:bg-gray-200 hover:no-underline rounded-lg shadow-md overflow-hidden">
              ¿Qué medios de pago aceptan?
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance p-4  text-[#05467D] text-lg">
              <p>
                Podés pagar con
                <span className="font-semibold">
                  tarjeta de crédito o débito, transferencia bancaria
                </span>
                (con descuento) o
                <span className="font-semibold"> Mercado Pago.</span>
              </p>
              <p>
                En cuotas, el interés depende del banco o la promoción vigente.
                También aceptamos
                <span className="font-semibold">plan canje</span>, donde
                entregás tu iPhone usado como parte de pago.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            className="border-b-0 border-gray-300 rounded-lg shadow-md overflow-hidden"
            value="item-5"
          >
            <AccordionTrigger className="font-semibold text-xl px-4 py-5 text-left  text-[#05467D] hover:bg-gray-200 hover:no-underline rounded-lg shadow-md overflow-hidden">
              ¿Cómo funciona el plan canje?
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance p-4  text-[#05467D] text-lg">
              El plan canje es simple: <br /> 1-Nos mandás las fotos y el modelo
              de tu iPhone actual. <br />
              2- Te hacemos una cotización real según el estado y el
              almacenamiento. <br />
              3-Podés usar ese monto para{" "}
              <span className="font-semibold">
                ahorrar en tu nuevo iPhone WAVE.
              </span>{" "}
              Sin vueltas ni valuaciones infladas. Te decimos lo que vale, de
              verdad.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            className="border-b-0 border-gray-300 rounded-lg shadow-md overflow-hidden"
            value="item-6"
          >
            <AccordionTrigger className="font-semibold text-xl px-4 py-5 text-left  text-[#05467D] hover:bg-gray-200 hover:no-underline rounded-lg shadow-md overflow-hidden">
              🧾 ¿Tienen garantía?
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance p-4 text-[#05467D] text-lg">
              <p>
                Sí. Todos nuestros equipos incluyen{" "}
                <span className="font-semibold">garantía de 3 meses</span> contra
                fallas de fábrica. Los iPhones nuevos sellados cuentan además con
                la{" "}
                <span className="font-semibold">garantía oficial de Apple</span>.
              </p>
              <p>
                En caso de cualquier inconveniente técnico, nos contactás
                directamente y lo resolvemos. No desaparecemos después de la
                venta:{" "}
                <span className="font-semibold">damos la cara siempre.</span>
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}
